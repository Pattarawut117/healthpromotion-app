import React from 'react';
import { IRanking } from '@/app/ranking/page';

export default function RankTable({ ranking, unit = 'คะแนน', renderValue }: { ranking: IRanking[], unit?: string, renderValue?: (row: IRanking) => React.ReactNode }) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200/50 overflow-hidden">
      <table className="table table-sm w-full">
        {/* head */}
        <thead className="bg-base-200/50 text-base-content/80 text-xs sm:text-sm">
          <tr>
            <th className="w-12 sm:w-16 text-center px-1 sm:px-4">อันดับ</th>
            <th className="px-1 sm:px-4">ชื่อ</th>
            <th className="text-right px-1 sm:px-4">{unit}</th>
          </tr>
        </thead>
        <tbody>
          {ranking.length > 0 ? (
            ranking.map((row: IRanking, index: number) => {
              const isTop1 = index === 0;
              const isTop2 = index === 1;
              const isTop3 = index === 2;

              return (
                <tr key={index} className="hover:bg-base-200/30 transition-colors border-b border-base-200/50 last:border-b-0">
                  <td className="text-center font-bold px-1 sm:px-4">
                    {isTop1 ? (
                      <div className="avatar placeholder">
                        <div className="bg-warning text-warning-content rounded-full w-6 h-6 sm:w-8 sm:h-8 shadow-sm">
                          <span className="text-sm sm:text-lg">🥇</span>
                        </div>
                      </div>
                    ) : isTop2 ? (
                      <div className="avatar placeholder">
                        <div className="bg-gray-300 text-gray-800 rounded-full w-6 h-6 sm:w-8 sm:h-8 shadow-sm">
                          <span className="text-sm sm:text-lg">🥈</span>
                        </div>
                      </div>
                    ) : isTop3 ? (
                      <div className="avatar placeholder">
                        <div className="bg-orange-300 text-orange-900 rounded-full w-6 h-6 sm:w-8 sm:h-8 shadow-sm">
                          <span className="text-sm sm:text-lg">🥉</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-base-content/60 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto text-xs sm:text-base">{index + 1}</span>
                    )}
                  </td>
                  <td className="px-1 sm:px-4">
                    <div className="font-semibold text-base-content text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{row.sname || row.user_info?.sname || '-'}</div>
                  </td>
                  <td className="text-right font-bold text-sm sm:text-lg text-primary px-1 sm:px-4">
                    {renderValue ? renderValue(row) : row.value ?? 0}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-8 text-base-content/50 text-sm">
                ไม่พบข้อมูล
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}