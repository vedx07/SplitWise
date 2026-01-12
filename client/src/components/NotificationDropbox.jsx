 
 export const NotificationDropbox = () => {
  return (
    <>  
 
 {/* Notification Dropdown (static UI for now) */}
          <div className="absolute right-0 mt-3 w-64 bg-[#161a20] border border-[#242a33] rounded-md shadow-lg">
            <ul className="max-h-60 overflow-y-auto">
              <li className="p-3 text-sm border-b border-[#242a33]">
                <span>👋</span> <b>Welcome back! </b> <br />
Ready to split expenses, settle balances, and stay stress-free with your finances.
              </li>
  
              <li className="p-3 text-sm">
              Notification support is under development.
              </li>
            </ul>
            <button className="w-full py-2 text-sm bg-gray-100 text-black rounded-b-md hover:bg-white transition">
              Clear all
            </button>
          </div>
    </>
  );
}