export default function AvatarStack({ members = [], max = 5 }) {
  const visibleMembers = members.slice(0, max);
  const extraCount = members.length - max;

  return (
    <div className="flex items-center">
      {visibleMembers.map((m, index) => {
        const showImage = Boolean(m.avatarUrl);

        return (
          <div
            key={m.id}
            className={`relative group ${index !== 0 ? "-ml-2" : ""}`}
          >
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full
                         border border-[#242a33]
                         bg-[#30363d]
                         flex items-center justify-center
                         overflow-hidden text-sm font-medium text-white"
            >
              {showImage ? (
                <img
                  src={m.avatarUrl}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="uppercase">
                  {m.name?.[0] || "?"}
                </span>
              )}
            </div>

            {/* Tooltip */}
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2
                         px-2 py-1 rounded
                         bg-[#161b22] border border-[#242a33]
                         text-xs text-white whitespace-nowrap
                         opacity-0 group-hover:opacity-100
                         pointer-events-none"
            >
              {m.name}
            </div>
          </div>
        );
      })}

      {/* +N indicator */}
      {extraCount > 0 && (
        <div
          className="-ml-2 w-9 h-9 rounded-full
                     border border-[#242a33]
                     bg-[#21262d]
                     flex items-center justify-center
                     text-xs font-medium text-gray-300"
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
}
