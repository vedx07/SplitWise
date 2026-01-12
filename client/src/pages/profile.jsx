import { useState, useEffect } from "react";
import Avatar from "../components/Avatar";
import EditNameModal from "../components/EditNameModal";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "./loading.jsx";

import { useContext } from "react";
import { UserContext } from "../context/userContext.jsx";

const getProfileData = async () => {
  const response = await fetch("http://localhost:3000/user-profile", {
    method: "GET",
    credentials: "include", // Include cookies
  });
  const data = await response.json();
  return {
    name: data.name,
    email: data.email,
    avatarUrl: data.avatarUrl || null,
  };
};



export default function Profile() {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@email.com");
  const [avatar, setAvatar] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setAvatarUrl, avatarUrl  } = useContext(UserContext);


  useEffect(() => {
    document.title = "My Profile";

    const fetchProfile = async () => {
      try {
        const data = await getProfileData();
        setName(data.name);
        setEmail(data.email);
        setAvatar(data.avatarUrl);
        setLoading(false);
        setAvatarUrl(data.avatarUrl);
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    fetchProfile();
  }, []);


   if (loading) return  <Loading />;
  return (
    
    
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Navbar */}
      <Navbar avatarUrl={avatarUrl}/>

      {/* Main Content */}
      <main className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-xl mt-10">
          <h1 className="text-2xl font-semibold mb-6">Your Profile</h1>

          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <Avatar
                name={name}
                avatar={avatar}
                setAvatar={setAvatar}
              />
            </div>

            {/* Name */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-lg">{name}</p>
              </div>
              <button
                onClick={() => setEditOpen(true)}
                className="text-sm text-blue-500 hover:underline"
              >
                Edit
              </button>
            </div>

            {/* Email */}
            <div className="mb-4">
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg text-gray-300">{email}</p>
            </div>

            <hr className="border-[#30363d] my-6" />

            {/* Options */}
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-[#21262d]">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-2 rounded text-red-500 hover:bg-red-500/10">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <EditNameModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        name={name}
        setName={setName}
      />
    </div>
  );
}
