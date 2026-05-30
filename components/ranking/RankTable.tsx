import React, { useState, useEffect } from 'react';
import { IRanking } from '@/app/ranking/page';

export default function RankTable({ ranking, unit = 'คะแนน', renderValue, isRun = false }: { ranking: IRanking[], unit?: string, renderValue?: (row: IRanking) => React.ReactNode, isRun?: boolean }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to page 1 when ranking data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [ranking]);
  console.log('ranking', ranking)

  const totalPages = Math.ceil(ranking.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = ranking.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-4">
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
            {currentData.length > 0 ? (
              currentData.map((row: IRanking, index: number) => {
                const actualIndex = startIndex + index;
                const isTop1 = actualIndex === 0;
                const isTop2 = actualIndex === 1;
                const isTop3 = actualIndex === 2;

                return (
                  <tr key={actualIndex} className="hover:bg-base-200/30 transition-colors border-b border-base-200/50 last:border-b-0">
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
                        <span className="text-base-content/60 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mx-auto text-xs sm:text-base">{actualIndex + 1}</span>
                      )}
                    </td>
                    <td className="px-1 sm:px-4">
                      <div className="flex flex-col">
                        <div className="font-semibold text-base-content text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">
                          {isRun ? (row.code_id || '-') : (row.sname || row.user_info?.sname || '-')}
                        </div>
                      </div>
                    </td>
                    <td className="text-right font-bold text-sm sm:text-lg text-primary px-1 sm:px-4">
                      {renderValue ? renderValue(row) : (row.value ? Number(row.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00')}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show limited page numbers if there are too many
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    className={`btn btn-sm w-8 ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === currentPage - 2 ||
                pageNum === currentPage + 2
              ) {
                return <span key={pageNum} className="flex items-end px-1">...</span>;
              }
              return null;
            })}
          </div>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
}