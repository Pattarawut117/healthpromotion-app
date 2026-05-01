'use client';

import React, { useState, useEffect } from 'react';
import RankTable from '@/components/ranking/RankTable';
import axios from 'axios';

export interface IRanking {
  user_id: string;
  sname?: string;
  max_streak?: number;
  total_logs?: number;
  category?: string;
  quantity?: number;
  duration_minutes?: number;
  water?: number;
  food?: number;
  sleep?: number;
  exercise?: number;
  bingo?: number;
  activity_type?: string;
  campaign_id?: number;
  created_at?: string;
  id?: number;
  log_date?: string;
  pic_url?: string;
  user_info?: {
    sname: string;
  };
  value?: number;
  task_id?: number;
  target_value?: number;
}

const users = [
  {
    value: '1',
    label: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white font-bold">R</span>
        </div>
        <span className="text-sm font-medium">Run</span>
      </div>
    ),
  },
  {
    value: 'water',
    label: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center">
          <span className="text-xl">💧</span>
        </div>
        <span className="text-sm font-medium">Water</span>
      </div>
    ),
  },
  {
    value: 'food',
    label: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center">
          <span className="text-xl">🍽️</span>
        </div>
        <span className="text-sm font-medium">Food</span>
      </div>
    ),
  },
  {
    value: 'sleep',
    label: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center">
          <span className="text-xl">😴</span>
        </div>
        <span className="text-sm font-medium">Sleep</span>
      </div>
    ),
  },
  {
    value: 'exercise',
    label: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center">
          <span className="text-xl">💪</span>
        </div>
        <span className="text-sm font-medium">Exercise</span>
      </div>
    ),
  },
  {
    value: 'bingo',
    label: (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
          <span className="text-xl">🎯</span>
        </div>
        <span className="text-sm font-medium">Bingo</span>
      </div>
    ),
  },
];

export default function RankingPage() {
  // Helper to get yesterday's date string YYYY-MM-DD
  const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  const [selectedValue, setSelectedValue] = useState('1');
  const [ranking, setRanking] = useState<IRanking[]>([]);
  // Default to yesterday
  const [filterDate, setFilterDate] = useState(getYesterday());
  const [runFilter, setRunFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [streakRes, logRes, bingoRes] = await Promise.all([
          axios.get('/api/campaign/21daysSubmit'),
          axios.get('/api/campaign/runSubmission'),
          axios.get('/api/campaign/bingoSubmissions')
        ]);

        const logs21Days = streakRes.data;   // All usage logs for 21 days
        const logsRun = logRes.data;         // run logs
        const logsBingo = bingoRes.data;     // bingo logs
        const map: Record<string, IRanking> = {};
        // Temporary storage for unique dates
        const userDates: Record<string, {
          water: Set<string>,
          food: Set<string>,
          sleep: Set<string>,
          exercise: Set<string>
        }> = {};

        // 1) Process 21Days Logs (Aggregation by Unique Days)
        for (const log of logs21Days) {
          const uid = log.user_id;

          // Init map entry
          if (!map[uid]) {
            map[uid] = {
              user_id: uid,
              sname: log.user_info?.sname || 'Unknown',
              max_streak: 0,
              total_logs: 0,
              water: 0,
              food: 0,
              sleep: 0,
              exercise: 0,
              bingo: 0,
              campaign_id: 3,
              user_info: { sname: log.user_info?.sname || 'Unknown' },
              value: 0
            };
          }

          // Init date tracking
          if (!userDates[uid]) {
            userDates[uid] = {
              water: new Set(),
              food: new Set(),
              sleep: new Set(),
              exercise: new Set()
            };
          }

          // Extract Date YYYY-MM-DD
          const dateStr = log.created_at ? log.created_at.substring(0, 10) : '';

          // Filter: If log date is AFTER filterDate, skip it
          if (!dateStr || (filterDate && dateStr > filterDate)) continue;
          if (!dateStr) continue;

          // Add to unique date sets
          if (log.category === 'water') userDates[uid].water.add(dateStr);
          else if (log.category === 'food') userDates[uid].food.add(dateStr);
          else if (log.category === 'sleep') userDates[uid].sleep.add(dateStr);
          else if (log.category === 'exercise') userDates[uid].exercise.add(dateStr);
        }

        // Apply counts to map
        for (const uid in userDates) {
          if (map[uid]) {
            map[uid].water = userDates[uid].water.size;
            map[uid].food = userDates[uid].food.size;
            map[uid].sleep = userDates[uid].sleep.size;
            map[uid].exercise = userDates[uid].exercise.size;
          }
        }

        // Process Bingo Logs
        const userBingoTasks: Record<string, Set<string>> = {};
        for (const log of logsBingo) {
          const uid = log.user_id;

          if (!map[uid]) {
            map[uid] = {
              user_id: uid,
              sname: log.user_info?.sname || 'Unknown',
              max_streak: 0,
              total_logs: 0,
              water: 0,
              food: 0,
              sleep: 0,
              exercise: 0,
              bingo: 0,
              campaign_id: 4,
              user_info: { sname: log.user_info?.sname || 'Unknown' },
              value: 0
            };
          }

          // Check status === 'APPROVED' before counting
          if (log.status !== 'APPROVED') continue;

          if (!userBingoTasks[uid]) {
            userBingoTasks[uid] = new Set();
          }

          // Count unique tasks
          if (log.task_id) {
            userBingoTasks[uid].add(String(log.task_id));
          }
        }

        for (const uid in userBingoTasks) {
          if (map[uid]) {
            map[uid].bingo = userBingoTasks[uid].size;
          }
        }

        // 2) Process Run Logs
        for (const log of logsRun) {
          const uid = log.user_id;

          const logDateStr = log.created_at ? log.created_at.substring(0, 10) : '';

          // Filter: If log date is AFTER filterDate, skip it
          if (filterDate && logDateStr > filterDate) continue;

          if (!map[uid]) {
            map[uid] = {
              user_id: uid,
              sname: log.user_info?.sname || 'Unknown',
              max_streak: 0,
              total_logs: 0,
              water: 0,
              food: 0,
              sleep: 0,
              exercise: 0,
              campaign_id: 1, // Run default
              user_info: { sname: log.user_info?.sname || 'Unknown' },
              value: 0,
              target_value: log.target_value
            };
          }

          // Accumulate Run Distance
          const distance = parseFloat(log.value) || 0;
          map[uid].value = (map[uid].value || 0) + distance;
          if (log.target_value) {
            map[uid].target_value = log.target_value;
          }
        }

        setRanking(Object.values(map));

      } catch (err) {
        console.error("Failed to load ranking", err);
      }
    };

    load();
  }, [filterDate]); // Re-run when filterDate changes

  // Filter and Sort based on Tab
  const getFilteredRanking = () => {
    if (selectedValue === '1') { // Run
      let filtered = ranking.filter(r => (r.value || 0) > 0);
      
      if (runFilter !== 'all') {
        filtered = filtered.filter(r => String(r.target_value) === runFilter);
      }
      
      return filtered.sort((a, b) => (b.value || 0) - (a.value || 0));
    }

    // 21 Days Categories and Bingo
    return ranking
      .filter(r => {
        // Basic filter: do they have ANY score in this category?
        if (selectedValue === 'water') return (r.water || 0) > 0;
        if (selectedValue === 'food') return (r.food || 0) > 0;
        if (selectedValue === 'sleep') return (r.sleep || 0) > 0;
        if (selectedValue === 'exercise') return (r.exercise || 0) > 0;
        if (selectedValue === 'bingo') return (r.bingo || 0) > 0;
        return false;
      })
      .map(r => ({
        ...r,
        // Map the specific category score to 'value' for the table
        value: selectedValue === 'water' ? r.water :
          selectedValue === 'food' ? r.food :
            selectedValue === 'sleep' ? r.sleep :
              selectedValue === 'exercise' ? r.exercise :
                selectedValue === 'bingo' ? r.bingo : 0
      }))
      .sort((a, b) => (b.value || 0) - (a.value || 0));
  };

  const filteredData = getFilteredRanking();

  // Get unique run target values for filtering
  const runTargetValues = Array.from(new Set(ranking.filter(r => r.target_value).map(r => String(r.target_value)))).sort();

  const getUnit = () => {
    switch (selectedValue) {
      case 'water': return 'จำนวน (วัน)';
      case 'food': return 'จำนวน (วัน)';
      case 'sleep': return 'จำนวน (วัน)';
      case 'exercise': return 'จำนวน (วัน)';
      case 'bingo': return 'ความคืบหน้า (30 กิจกรรม)';
      case '1': return 'ระยะทาง (Km)';
      default: return 'คะแนน';
    }
  }

  const renderValue = selectedValue === 'bingo' ? (row: IRanking) => (
    <div className="flex flex-col gap-1 w-full min-w-[100px] sm:min-w-[150px] items-end">
      <div className="flex justify-between w-full text-xs sm:text-sm font-medium text-base-content/80">
        <span>{row.bingo || 0}/30</span>
        <span className="text-primary">{Math.round(((row.bingo || 0) / 30) * 100)}%</span>
      </div>
      <progress className="progress progress-warning w-full" value={row.bingo || 0} max="30"></progress>
    </div>
  ) : undefined;

  return (
    <div className="min-h-screen bg-base-200 text-base-content pb-20 relative">
      <div className="navbar bg-base-100 sticky top-0 z-50 shadow-sm px-4">
        <div className="flex-1">
          <h1 className="font-bold text-xl text-primary">จัดอันดับ</h1>
        </div>
        <div className="flex-none">
          <div className="flex flex-col items-end pt-1">
            <span className="text-[10px] text-base-content/60 font-semibold tracking-wide">ข้อมูลล่าสุด ณ วันที่</span>
            <input
              type="date"
              value={filterDate}
              max={getYesterday()}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent border-none text-xs sm:text-sm font-bold p-0 m-0 w-max outline-none text-base-content"
              disabled
            />
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 md:p-6 space-y-4 mt-2">
        {/* Header Controls Area */}
        <div className="flex flex-col gap-3">
          {/* Category Tabs */}
          <div className="card bg-base-100 shadow-sm border border-base-200/50 p-2 overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <div role="tablist" className="tabs tabs-boxed bg-transparent gap-1 flex-nowrap w-max min-w-full">
                {users.map((user) => {
                  const isActive = selectedValue === user.value;
                  return (
                    <button
                      key={user.value}
                      role="tab"
                      onClick={() => {
                        setSelectedValue(user.value);
                        setRunFilter('all');
                      }}
                      className={`tab h-auto py-2 px-3 sm:px-4 flex-nowrap transition-all duration-300 rounded-xl flex-1 shrink-0 ${isActive
                        ? 'tab-active !bg-primary/10 shadow-sm border border-primary/20 scale-105'
                        : 'hover:bg-base-200 opacity-60 hover:opacity-100'
                        }`}
                    >
                      {user.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RUN Sub-filter */}
          {selectedValue === '1' && runTargetValues.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 py-1">
              <button
                onClick={() => setRunFilter('all')}
                className={`btn btn-xs sm:btn-sm rounded-full ${runFilter === 'all' ? 'btn-primary' : 'btn-ghost bg-base-100 shadow-sm border border-base-200/50'}`}
              >
                ทั้งหมด
              </button>
              {runTargetValues.map(val => (
                <button
                  key={val}
                  onClick={() => setRunFilter(val)}
                  className={`btn btn-xs sm:btn-sm rounded-full ${runFilter === val ? 'btn-primary' : 'btn-ghost bg-base-100 shadow-sm border border-base-200/50'}`}
                >
                  {Number(val).toLocaleString()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table View */}
        <div className="mt-2">
          <RankTable ranking={filteredData} unit={getUnit()} renderValue={renderValue} />
        </div>
      </div>
    </div>
  );
}