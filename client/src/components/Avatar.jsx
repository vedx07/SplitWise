import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext.jsx";


export default function Avatar({ name, avatar, setAvatar }) {
  const firstLetter = name?.charAt(0).toUpperCase();
  const [loading, setLoading] = useState(false);
    const { setAvatarUrl  } = useContext(UserContext); //To update it for Navbar


  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Splitwise");

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/dojvm7rgg/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudData = await cloudRes.json();

      if (!cloudRes.ok) {
        throw new Error("Cloudinary upload failed");
      }

      // Save avatar URL to backend
      const res = await fetch("http://localhost:3000/user-avatar", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatarUrl: cloudData.secure_url }),
      });

      const updatedUser = await res.json();

      if (!res.ok) {
        throw new Error("Failed to save avatar");
      }

      // Update UI
      setAvatar(updatedUser.avatarUrl);
      //For Navbar Using Context API
      setAvatarUrl(updatedUser.avatarUrl);


    } catch (err) {
      console.error(err);
      alert("Avatar upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group w-28 h-28">
      {/* Avatar Circle */}
      <div className="w-full h-full rounded-full overflow-hidden bg-[#2d333b] flex items-center justify-center text-4xl font-semibold text-white">
        {avatar ? (
          <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          firstLetter
        )}
      </div>

      {/* Upload Overlay */}
      <label className="absolute inset-0 bg-black/50 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer text-sm text-white">
        {loading ? "Uploading..." : "Change"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadImage}
          disabled={loading}
        />
      </label>
    </div>
  );
}
