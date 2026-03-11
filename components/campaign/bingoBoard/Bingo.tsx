'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useLiff } from "@/contexts/LiffContext";
import { useBingoSubmission } from "@/hooks/useBingoSubmission";

export type BingoStatus = "APPROVED" | "PENDING" | "LOCKED" | "REJECTED";

export interface BingoActivity {
  id: number;
  activity_name: string;
  row?: number;
}

export interface BingoCell {
  id: number;
  activity_name: string;
  status: BingoStatus;
  created_at?: string;
  admin_comment?: string;
}

export interface BingoRow {
  row: number;
  cells: BingoCell[];
}

export default function BingoBoardMobile() {
  const { profile } = useLiff();
  const [selectedCell, setSelectedCell] = useState<BingoCell | null>(null);
  const [bingoData, setBingoData] = useState<BingoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);

  // Callback for successful submission (Optimistic Update)
  const handleSuccess = () => {
    if (!selectedCell) return;

    setBingoData(prevDocs => prevDocs.map(row => ({
      ...row,
      cells: row.cells.map(cell =>
        cell.id === selectedCell.id ? { ...cell, status: 'PENDING' } : cell
      )
    })));
    setHasSubmittedToday(true);
  };
  // Custom Hook
  const {
    file,
    previewUrl,
    uploading,
    fileInputRef,
    onSelectFile,
    handleSubmit,
    reset,
    isCompressing,
    compressionProgress
  } = useBingoSubmission(
    selectedCell?.id || null,
    handleSuccess,
    () => {
      setSelectedCell(null);
      // Ensure reset is called when closing if needed, though hook handles it on success.
      // If user manually closes without submitting, we might want to reset explicitly?
      // The hook exposes reset, we can call it here if we want to clear file when just closing modal.
      reset();
    }
  );

  useEffect(() => {
    const initData = async () => {
      if (!profile?.userId) return;

      try {
        setLoading(true);

        // 1. Fetch Bingo Tasks (Parallel)
        const tasksPromise = axios.get<BingoActivity[]>("/api/campaign/bingoTask");

        // 2. Fetch Submissions
        const submissionsPromise = axios.get(`/api/campaign/bingoSubmissions?user_id=${profile.userId}`);

        const [tasksResponse, submissionsResponse] = await Promise.all([tasksPromise, submissionsPromise]);

        const activities = tasksResponse.data;
        const submissions: { user_id: string; task_id: number | string; status: string; created_at: string; admin_comment?: string }[] = submissionsResponse.data;

        // Filter submissions for current user for the BOARD STATUS
        const userSubmissions = submissions.filter(sub => sub.user_id === profile.userId);

        // Determine if there is a submission today
        const now = new Date();
        const todayStr = now.toISOString().slice(0, 10);

        const submittedToday = userSubmissions.some(sub => {
          if (!sub.created_at) return false;
          const subDateStr = new Date(sub.created_at).toISOString().slice(0, 10);
          return subDateStr === todayStr;
        });
        setHasSubmittedToday(submittedToday);

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
                  } else if (submission.status === "REJECTED") {
                    status = "REJECTED";
                  } else if (submission.status === "PENDING" || !submission.status) {
                    status = "PENDING";
                  }
                }

                return {
                  id: c.id,
                  activity_name: c.activity_name,
                  status: status,
                  created_at: submission?.created_at,
                  admin_comment: submission?.admin_comment
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
        <AnimatePresence>
          {hasSubmittedToday && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 mx-4 p-2 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-xs font-medium shadow-sm"
            >
              คุณได้ส่งภารกิจของวันนี้แล้ว ภารกิจถัดไปจะเปิดให้ส่งในวันพรุ่งนี้
            </motion.div>
          )}
        </AnimatePresence>
      </header>

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
            } else if (cell.status === "REJECTED") {
              bgClass = "bg-red-100";
              borderClass = "border-red-300";
            } else if (cell.status === "PENDING") {
              bgClass = "bg-yellow-50";
              borderClass = "border-yellow-200";
            } else if (hasSubmittedToday) {
              bgClass = "bg-gray-100";
              borderClass = "border-gray-200 opacity-60";
              disabled = true;
            }

            return (
              <motion.button
                key={cell.id}
                whileTap={cell.status === "APPROVED" || (hasSubmittedToday && cell.status !== "PENDING") ? {} : { scale: 0.9 }}
                onClick={() => {
                  if (cell.status === "APPROVED") return;
                  if (hasSubmittedToday && cell.status !== "PENDING" && cell.status !== "REJECTED") return;

                  setSelectedCell(cell);
                  reset();
                }}
                disabled={disabled}
                className={`
                  relative aspect-square flex flex-col items-center justify-center p-1 rounded-xl shadow-sm border transition-all
                  ${bgClass} ${borderClass}
                  ${cell.status === "APPROVED" || (hasSubmittedToday && cell.status !== "PENDING" && cell.status !== "REJECTED") ? "opacity-60 cursor-not-allowed" : "hover:shadow-md cursor-pointer"}
                `}
              >
                {(cell.status === "APPROVED" || cell.status === "REJECTED" || (hasSubmittedToday && cell.status !== "PENDING")) && (
                  <div className={`absolute top-1 right-1 text-xs ${cell.status === "APPROVED" ? "text-green-600" : cell.status === "REJECTED" ? "text-red-500" : "text-gray-500"}`}>
                    {cell.status === "APPROVED" ? "✓" : cell.status === "REJECTED" ? "❌" : "🔒"}
                  </div>
                )}
                <span className={`text-[0.6rem] font-bold text-center leading-tight line-clamp-2 w-full break-words`}>
                  {cell.activity_name}
                </span>
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
            onClick={() => {
              setSelectedCell(null);
              reset();
            }}
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
                  {selectedCell.status === "REJECTED" && selectedCell.admin_comment && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-left">
                      <strong>หมายเหตุจากแอดมิน:</strong><br />
                      {selectedCell.admin_comment}
                    </div>
                  )}
                </div>

                <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    id="file-upload"
                    accept="video/*"
                    // Bind the ref from the hook
                    ref={fileInputRef}
                    onChange={onSelectFile}
                  />
                  <label htmlFor="file-upload" className="flex flex-col items-center gap-2 cursor-pointer w-full">
                    {previewUrl ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center bg-black">
                        {file?.type.startsWith('video/') ? (
                          <video src={previewUrl} controls className="w-full h-full object-contain" />
                        ) : (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                          </>
                        )}
                      </div>
                    ) : (
                      <>
                        <span className="text-2xl">📸/🎥</span>
                        <span className="text-sm font-medium text-gray-600">แตะเพื่อเลือกหรือวิดีโอ</span>
                        <span className="text-xs font-medium text-gray-600">(วิดีโอต้องมีขนาดไม่เกิน 15MB และไม่เกิน 15 วินาที)</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    className="w-full py-3 rounded-xl text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      setSelectedCell(null);
                      reset();
                    }}
                    disabled={uploading}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className="w-full py-3 rounded-xl text-white font-semibold bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSubmit}
                    disabled={!file || uploading || isCompressing || (hasSubmittedToday && selectedCell?.status === "REJECTED")}
                  >
                    {isCompressing
                      ? `กำลังบีบอัด... ${compressionProgress}%`
                      : uploading
                        ? "กำลังส่ง..."
                        : "ส่งภารกิจ"
                    }
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