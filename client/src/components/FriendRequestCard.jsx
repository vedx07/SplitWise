export default function FriendRequestCard({ request, onAccept, onReject }) {
  const firstLetter = request.name?.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between bg-[#161b22] border border-[#30363d] rounded-lg p-4">
      
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#2d333b] flex items-center justify-center text-white font-semibold overflow-hidden">
          {request.avatarUrl ? (
            <img
              src={request.avatarUrl}
              alt={request.name}
              className="w-full h-full object-cover"
            />
          ) : (
            firstLetter
          )}
        </div>

        {/* User Info */}
        <div>
          <p className="font-medium">{request.name}</p>
          <p className="text-sm text-gray-400">{request.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onAccept(request._id)}
          className="px-3 py-1 text-sm rounded bg-green-600 hover:bg-green-700"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(request._id)}
          className="px-3 py-1 text-sm rounded bg-[#30363d] hover:bg-[#3c444d]"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
