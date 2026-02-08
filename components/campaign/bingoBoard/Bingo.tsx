'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useLiff } from "@/contexts/LiffContext";

export type BingoStatus = "APPROVED" | "PENDING" | "LOCKED";

export interface BingoActivity {
  id: number;
  activity_name: string;
  row?: number;
}

export interface BingoCell {
  id: number;
  activity_name: string;
  status: BingoStatus;
}

export interface BingoRow {
  row: number;
  cells: BingoCell[];
}

export interface TeamMember {
  user_id: string;
  sname: string;
}

export interface TeamInfo {
  team_id: string;
  team_name: string;
  team_size: number;
  members: TeamMember[];
  progress: { task_id: number; submission_count: number }[];
}

export default function BingoBoardMobile() {
  const { profile, idToken } = useLiff();
  const [selectedCell, setSelectedCell] = useState<BingoCell | null>(null);
  const [bingoData, setBingoData] = useState<BingoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<{ user_id: string; task_id: number | string; status: string }[]>([]);
  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!file || !selectedCell) return;

    if (!profile?.userId) {
      alert("ไม่ข้อมูลผู้ใช้งาน (User ID not found). กรุณารอกรสักครู่หรือรีโหลดหน้านี้");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload Image
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await axios.post('/api/campaign/bingoUpload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (uploadRes.data.success) {
        const imageUrl = uploadRes.data.path;

        // 2. Submit Task
        await axios.post('/api/campaign/bingoSubmissions', {
          task_id: selectedCell.id,
          user_id: profile.userId,
          image_url: imageUrl
        }, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        alert("ส่งภารกิจเรียบร้อย!");
        setSelectedCell(null);
        setFile(null);
        setPreviewUrl(null);

        // Optimistically update UI status to 'PENDING' or 'APPROVED'
        setBingoData(prevDocs => prevDocs.map(row => ({
          ...row,
          cells: row.cells.map(cell =>
            cell.id === selectedCell.id ? { ...cell, status: 'PENDING' } : cell
          )
        })));

      } else {
        alert("Upload failed");
      }

    } catch (error: unknown) {
      console.error("Submission error", error);
      const msg = (axios.isAxiosError(error) && error.response?.data?.message) ? error.response.data.message : "เกิดข้อผิดพลาดในการส่งข้อมูล";
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      if (!profile?.userId) return;

      try {
        setLoading(true);

        // 1. Fetch Bingo Tasks (Parallel)
        const tasksPromise = axios.get<BingoActivity[]>("/api/campaign/bingoTask");

        // 2. Fetch Team Info (Parallel start, but needed for submissions)
        // We need team info to know which team to filter submissions for
        let currentTeamId: string | null = null;
        try {
          const teamRes = await axios.get<TeamInfo>(`/api/campaign/teamMembers?user_id=${profile.userId}`);
          setTeamInfo(teamRes.data);
          currentTeamId = teamRes.data.team_id;
        } catch (err) {
          console.error("Failed to fetch team data", err);
        }

        // 3. Fetch Submissions (Filtered)
        // If we have a team ID, filter by it. Otherwise, fallback to user_id or empty.
        let submissionsPromise;
        if (currentTeamId) {
          submissionsPromise = axios.get(`/api/campaign/bingoSubmissions?team_id=${currentTeamId}`);
        } else {
          submissionsPromise = axios.get(`/api/campaign/bingoSubmissions?user_id=${profile.userId}`);
        }

        const [tasksResponse, submissionsResponse] = await Promise.all([tasksPromise, submissionsPromise]);

        const activities = tasksResponse.data;
        const submissions: { user_id: string; task_id: number | string; status: string }[] = submissionsResponse.data;
        setAllSubmissions(submissions);

        // Filter submissions for current user for the BOARD STATUS
        const userSubmissions = submissions.filter(sub => sub.user_id === profile.userId);

        const rows: BingoRow[] = [];
        const itemsPerRow = 5;

        for (let i = 0; i < 6; i++) {
          const rowNum = i + 1;
          let cellData: BingoActivity[] = [];

          if (activities.length > 0 && 'row' in activities[0]) {
            cellData = activities.filter(act => act.row === rowNum);
          } else {
            cellData = activities.slice(i * itemsPerRow, (i + 1) * itemsPerRow);
          }

          if (cellData.length > 0) {
            rows.push({
              row: rowNum,
              cells: cellData.map(c => {
                // Ensure ID comparison is type-safe
                const submission = userSubmissions.find(s => String(s.task_id) === String(c.id));
                let status: BingoStatus = "LOCKED";

                if (submission) {
                  if (submission.status === "APPROVED") {
                    status = "APPROVED";
                  } else if (submission.status === "PENDING" || !submission.status) {
                    status = "PENDING";
                  }
                }

                return {
                  id: c.id,
                  activity_name: c.activity_name,
                  status: status
                };
              })
            });
          }
        }
        setBingoData(rows);

      } catch (error) {
        console.error("Main fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [profile]);
  // Helper: flatten rows to simple array for grid
  const allCells = bingoData.flatMap((row) =>
    row.cells.map((cell) => ({
      ...cell,
      row: row.row,
    }))
  );

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading Bingo Board...</div>;
  }

  return (
    <div className=" bg-gradient-to-br from-orange-50 to-amber-100 p-2 text-black">
      {/* Header */}
      <header className="mb-4 text-center">
        <h1 className="text-2xl font-extrabold text-orange-600 drop-shadow-sm">
          🏆 Health Bingo
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          ทำภารกิจให้ครบทุกแถว!
        </p>
      </header>

      {/* Team Info */}
      {teamInfo && (
        <div className="mb-6 mx-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-orange-100">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-orange-800 mb-2">
              Team: {teamInfo.team_name}
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {teamInfo.members.map((member) => (
                <span
                  key={member.user_id}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${member.user_id === profile?.userId
                    ? "bg-orange-100 text-orange-700 border-orange-200"
                    : "bg-white text-gray-600 border-gray-200"
                    }`}
                >
                  {member.sname}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid Board - 5 Columns */}
      <div className="max-w-md mx-auto bg-white/40 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50">
        <div className="grid grid-cols-5 gap-2">
          {allCells.map((cell) => {
            // Status Aesthetics
            let bgClass = "bg-white";
            let borderClass = "border-gray-100";
            let disabled = false;

            if (cell.status === "APPROVED") {
              bgClass = "bg-green-100";
              borderClass = "border-green-300";
              disabled = true;
            } else if (cell.status === "PENDING") {
              bgClass = "bg-yellow-50";
              borderClass = "border-yellow-200";
            }

            return (
              <motion.button
                key={cell.id}
                whileTap={cell.status === "APPROVED" ? {} : { scale: 0.9 }}
                onClick={() => {
                  if (cell.status !== "APPROVED") {
                    setSelectedCell(cell);
                  }
                }}
                disabled={disabled}
                className={`
                  relative aspect-square flex flex-col items-center justify-center p-1 rounded-xl shadow-sm border transition-all
                  ${bgClass} ${borderClass}
                  ${cell.status === "APPROVED" ? "opacity-60 cursor-not-allowed" : "hover:shadow-md cursor-pointer"}
                `}
              >
                {cell.status === "APPROVED" && (
                  <div className="absolute top-1 right-1 text-xs text-green-600">✓</div>
                )}
                <span className={`text-[0.6rem] font-bold text-center leading-tight line-clamp-2 w-full break-words`}>
                  {cell.activity_name}
                </span>

                {/* Team Progress Count */}
                {teamInfo && (
                  <div className="absolute bottom-1 right-1 bg-black/10 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                    <span className="text-[0.6rem] font-medium text-gray-700">
                      {(() => {
                        // Client-side calculation: count unique users from team who submitted this task
                        // Submissions are already filtered by team_id from the API (if teamInfo exists)
                        // Just need to ensure safety
                        const teamTaskSubmissions = allSubmissions.filter(s =>
                          String(s.task_id) === String(cell.id)
                          // member check is technically redundant if API filters by team, but safe to keep
                          // && teamInfo.members.some(m => m.user_id === s.user_id) 
                        );

                        // Count unique user_ids
                        const uniqueSubmitters = new Set(teamTaskSubmissions.map(s => s.user_id)).size;
                        return uniqueSubmitters;
                      })()}
                      /
                      {teamInfo.team_size}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCell(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative overflow-hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Decoration Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-50 pointer-events-none" />

              <div className="text-center space-y-4 relative z-10">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🎯
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {selectedCell.activity_name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    ส่งรูปถ่ายของคุณเพื่อยืนยันภารกิจนี้
                  </p>
                </div>

                <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload" className="flex flex-col items-center gap-2 cursor-pointer w-full">
                    {previewUrl ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <>
                        <span className="text-2xl">📸</span>
                        <span className="text-sm font-medium text-gray-600">แตะเพื่อเลือกรูปภาพ</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    className="w-full py-3 rounded-xl text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSelectedCell(null);
                      setFile(null);
                      setPreviewUrl(null);
                    }}
                    disabled={uploading}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="w-full py-3 rounded-xl text-white font-semibold bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={!file || uploading}
                  >
                    {uploading ? "กำลังส่ง..." : "ส่งภารกิจ"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}