export default function FriendCard({ friend, onRemove }) {
  const firstLetter = friend.name?.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded-lg p-4">
      
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2d333b] flex items-center justify-center text-white font-semibold overflow-hidden">
          {friend.avatarUrl ? (
            <img
              src={friend.avatarUrl}
              alt={friend.name}
              className="w-full h-full object-cover"
            />
          ) : (
            firstLetter
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-medium">{friend.name}</p>
          <p className="text-sm text-gray-400">{friend.email}</p>
        </div>
      </div>

      <button
        onClick={() => onRemove(friend._id)}
        className="text-sm text-red-400 hover:underline"
      >
        Remove
      </button>
    </div>
  );
}
