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
}

// ... imports

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
              value: 0
            };
          }

          // Accumulate Run Distance
          const distance = parseFloat(log.distance) || 0;
          map[uid].value = (map[uid].value || 0) + distance;
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
      return ranking
        .filter(r => (r.value || 0) > 0) // Show only if they ran? Or show all
        .sort((a, b) => (b.value || 0) - (a.value || 0));
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
    <div className="flex flex-col gap-1 w-full mt-1 max-w-[150px]">
      <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-700">
        <span>{row.bingo || 0}/30</span>
        <span>{Math.round(((row.bingo || 0) / 30) * 100)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-yellow-400 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(((row.bingo || 0) / 30) * 100, 100)}%` }}></div>
      </div>
    </div>
  ) : undefined;

  return (
    <div className="p-4 flex flex-col gap-4 text-black">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-2xl font-bold">จัดอันดับ</h1>

        {/* Date Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">ข้อมูล ณ วันที่:</span>
          <input
            type="date"
            value={filterDate}
            max={getYesterday()}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded p-1"
            disabled
          />
        </div>

        {/* Scrollable Tabs if needed, or flex wrap */}
        <div className="flex items-center gap-2 overflow-x-scroll max-w-full pb-2">
          {users.map((user) => (
            <button
              key={user.value}
              onClick={() => setSelectedValue(user.value)}
              className={`p-2 rounded-lg transition-colors duration-300 min-w-max ${selectedValue == user.value ? 'bg-white shadow ring-1 ring-gray-200' : 'bg-gray-100 text-gray-400'
                }`}>
              {user.label}
            </button>
          ))}
        </div>
      </div>

      <RankTable ranking={filteredData} unit={getUnit()} renderValue={renderValue} />
    </div>
  );
}