import AvatarStack from "./AvatarStack";

export default function GroupCard({ group , onClick}) {
  const { name, category, description, members, createdBy, createdAt } = group;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div onClick={onClick} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-[#8b949e] transition" >
      {/* Title */}
      <div className="flex items-start justify-between mb-1">
        <h2 className="font-semibold text-lg cursor-pointer hover:underline">
          {name}
        </h2>
        <span className="text-xs text-[#8b949e] capitalize">
          {category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-[#8b949e] mb-3 line-clamp-2">
        {description}
      </p>

      {/* Members */}
      <div className="mb-3">
        <AvatarStack members={members} />
        <p className="text-xs text-[#8b949e] mt-1">
          {members.length} members
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-[#8b949e]">
        <span>Created by {createdBy.name}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
