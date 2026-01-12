

export default function EditNameModal({ isOpen, onClose, name, setName }) {

  const saveData = async (name) => {
  const response = await fetch("http://localhost:3000/user-profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies (JWT)
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return await response.json();
};

const onSave = async (name) => {
  try {
    const updatedUser = await saveData(name);
    console.log("Profile updated:", updatedUser);
    onClose(); // close only after success
  } catch (error) {
    console.error(error.message);
    alert("Unable to save changes");
  }
};
  


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161b22] p-6 rounded-lg w-80">
        <h2 className="text-lg font-medium mb-4">Edit Name</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(name)}
            className="text-sm bg-blue-600 px-4 py-1.5 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
