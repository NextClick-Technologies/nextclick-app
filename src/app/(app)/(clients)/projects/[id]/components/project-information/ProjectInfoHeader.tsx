"use client";

export function ProjectInfoHeader() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
        <span className="text-xs">📋</span>
      </div>
      <h2 className="text-lg font-semibold">Project Information</h2>
    </div>
  );
}
