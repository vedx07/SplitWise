export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white">
      <div className="flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-[#30363d] border-t-blue-500 rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm text-gray-400 tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  )};
