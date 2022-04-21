import React from "react";
import { MdClear } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { RiLogoutBoxLine } from "react-icons/ri";

const ChatDetails = () => {
  return (
    <aside className="chat-details w-4/12 h-100 p-4 pt-4 text-primary border-slate-600 border-l">
      <header className="flex text-slate-400 items-center justify-between">
        <p>Chat Details</p>
        <i>
          <MdClear />
        </i>
      </header>
      {/* <div className="actions flex items-center justify-between text-slate-800 p-4 px-0">
        <i>
          <IoMdNotificationsOutline />
        </i>
        <i>
          <IoPersonAddOutline />
        </i>
        <i>
          <AiOutlineInfoCircle />
        </i>
        <i className="leave text-red-800">
          <RiLogoutBoxLine />
        </i>
      </div> */}
      <div className="mt-4 p-1 transition-all bg-slate-700 px-3 border border-transparent hover:border-white cursor-pointer rounded-lg text-slate-400">
        Your conversation details will be showed here 🔥
      </div>
    </aside>
  );
};

export default ChatDetails;
