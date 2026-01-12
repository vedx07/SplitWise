export default function AvatarStack({ members }) {
  const maxVisible = 4;
  const visibleMembers = members.slice(0, maxVisible);
  const extraCount = members.length - maxVisible;

  return (
    <div className="flex items-center">
      {visibleMembers.map((member, index) => {
        const firstLetter = member.name?.charAt(0).toUpperCase();

        return member.avatarUrl ? (
          <img
            key={member._id}
            src={member.avatarUrl}
            alt={member.name}
            title={member.name}
            className="w-8 h-8 rounded-full border-2 border-[#0d1117] object-cover"
            style={{ marginLeft: index === 0 ? 0 : -10 }}
          />
        ) : (
          <div
            key={member._id}
            title={member.name}
            className="w-8 h-8 rounded-full bg-[#30363d] text-sm font-semibold text-[#c9d1d9] flex items-center justify-center border-2 border-[#0d1117]"
            style={{ marginLeft: index === 0 ? 0 : -10 }}
          >
            {firstLetter}
          </div>
        );
      })}

      {extraCount > 0 && (
        <div
          className="w-8 h-8 rounded-full bg-[#30363d] text-xs flex items-center justify-center border-2 border-[#0d1117] text-[#c9d1d9]"
          style={{ marginLeft: -10 }}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
}
