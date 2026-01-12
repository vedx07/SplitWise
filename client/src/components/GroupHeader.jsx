import GroupAvatarStack from "./GroupAvatarStack";
import Button from "./Button";
import { useNavigate, useParams } from "react-router-dom";

const CATEGORY_EMOJI_MAP = {
  food: "🍔",
  travel: "✈️",
  stay: "🏨",
  shopping: "🛍️",
  party: "🥂",
  trip: "🏖️",
  other: "🛸",
};

export default function GroupHeader({
  name,
  category,
  description,
  members,
  createdAt,
}) {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const emoji = CATEGORY_EMOJI_MAP[category] || "👥";
  const memberCount = members.length;

  const createdDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left */}
      <div className="space-y-2">
        {/* Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-semibold text-white">
            {name}
          </h1>
          <span className="text-xl">{emoji}</span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-400 max-w-xl">
            {description}
          </p>
        )}

        {/* Members */}
        <div className="flex items-center gap-3">
          <GroupAvatarStack members={members} />
          <span className="text-sm text-gray-400">
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Meta */}
        <p className="text-xs text-gray-500">
          Created on {createdDate}
        </p>
      </div>

      {/* Right */}
      <div className="flex gap-2">
        <Button onClick={() => navigate(`/group/${groupId}/add-members`)}>
          + Add Member
        </Button>

        <Button onClick={() => navigate(`/group/${groupId}/settings`)}>
          ⚙️ Settings
        </Button>
      </div>
    </div>
  );
}
