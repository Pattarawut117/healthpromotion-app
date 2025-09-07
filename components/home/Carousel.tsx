import React from 'react';

export default function Carousel() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col items-center justify-center bg-card text-card-foreground w-32 h-32 rounded-lg shadow-md">
          <p>Exercise</p>
          <p className="text-primary">minutes</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-card text-card-foreground w-32 h-32 rounded-lg shadow-md">
          <p>Water</p>
          <p className="text-primary">ml</p>
        </div>
      </div>
      <div className="flex w-full justify-between items-center bg-card text-card-foreground rounded-lg shadow-md px-4 py-2">
        <p>Exercise Target</p>
        <p className="text-primary">300 minutes/day</p>
      </div>
    </div>
  );
}
