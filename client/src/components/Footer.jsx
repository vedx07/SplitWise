import { useState } from "react";
export default function Footer() {
  
  return (
    <footer className="mt-auto border-t border-[#242a33] bg-[#0d1117] py-4">
      <p className="text-center text-sm text-gray-400 select-none flex items-center justify-center gap-1">
        Made with
        {/* Heartbeat */}
        <span className="inline-block animate-pulse [animation-duration:1.5s] hover:animate-none">❤️</span>
        &
          {/* Tea / Coffee with steam */}
        <span className="relative inline-flex items-center mx-1">
          ☕
          {/* Steam particles */}
          <span className="absolute -top-2 left-1 text-xs text-gray-400 animate-ping opacity-60">
            •
          </span>
          <span className="absolute -top-3 left-2 text-xs text-gray-500 animate-ping opacity-40 [animation-delay:0.6s]">
            •
          </span>
          <span className="absolute -top-4 left-1.5 text-xs text-gray-600 animate-ping opacity-30 [animation-delay:1.2s]">
            •
          </span>
        </span>
        by
        <span className="text-gray-300 font-medium ml-1">
          Vedant
        </span>
      </p>
    </footer>
  );
}
