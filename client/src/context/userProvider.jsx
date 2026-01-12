import { useState } from "react";
import { UserContext } from "./userContext";

export default function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [avatarUrl,setAvatarUrl] = useState(null);
  const [name,setName] = useState("User");
  return (
    <UserContext.Provider value={{ userId, setUserId , avatarUrl , setAvatarUrl,name,setName}}>
      {children}
    </UserContext.Provider>
  );
}
