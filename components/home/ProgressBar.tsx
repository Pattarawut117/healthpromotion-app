"use client";

const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full px-4 mt-2">
      <div className="h-3 bg-gray-200 rounded-full relative">
        <div
          className="absolute left-0 top-0 h-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
