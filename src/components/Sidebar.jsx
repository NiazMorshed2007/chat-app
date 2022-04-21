import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";

const Sidebar = () => {
  const [searchVal, setSearchVal] = useState("");
  const [joinedUsers, setJoinedUsers] = useState([]);
  const chats = useSelector((state) => {
    return state.chats;
  });
  const all_users = useSelector((state) => {
    return state.all_users;
  });
  const handleSearch = async (e) => {
    setSearchVal(e.target.value);
    if (searchVal !== "") {
      const q = query(
        collection(db, "users"),
        where("email", ">=", searchVal),
        where("email", "<=", searchVal + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = [];
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data(), "hdsa");
        data.push(doc.data());
        setJoinedUsers(data);
        console.log(data);
      });
    }
  };

  // console.log(all_users);
  const navigate = useNavigate();
  return (
    <aside className="sidebar w-4/12 h-100 p-4 pt-4 text-primary border-r-slate-600 border-r">
      <header className="w-full flex h-min items-center text-slate-400">
        <div className="burger w-12 p-2 h-10 flex flex-col items-center justify-center cursor-pointer rounded-full transition-all active:bg-slate-800">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <label className="relative translate-x-2" htmlFor="search">
          <i className="absolute top-1/2 -translate-y-2 left-3">
            <FiSearch />
          </i>
          <input
            value={searchVal}
            onChange={(e) => {
              handleSearch(e);
            }}
            name="search"
            placeholder="Search"
            type="text"
            className="p-2 w-full rounded-xl px-3 pl-8 outline-none placeholder:text-slate-400 bg-slate-600"
          />
        </label>
      </header>
      <main className="pt-3">
        <div className="chats-head px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1 cursor-pointer">
            <span>Messages</span>
            <MdKeyboardArrowDown />
          </div>
          <i className="cursor-pointer">
            <BiMessageRoundedAdd />
          </i>
        </div>
        {chats && chats.conversations.length > 0 ? (
          <>
            {chats?.conversations.map((conversation, i) => (
              <div
                onClick={() => navigate(`/chat/${conversation.reciver_email}`)}
                className="chat cursor-pointer p-2 flex items-center gap-2 transition-all rounded-lg hover:bg-slate-800"
                key={i}
              >
                <div className="avatar-wrapper h-10">
                  <div className="avatar w-10 h-full rounded-full bg-slate-600"></div>
                </div>
                <div className="cont">
                  <h3>{conversation.reciver_name}</h3>
                  <p className="w-full text-slate-500">
                    {/* {conversation?.messages[0].content} */}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="empty p-3 flex flex-col items-center justify-center bg-slate-700 rounded-lg text-sm">
              <p className="text-center">
                You don't have any conversations yet. Say hi to anyone and grow
                connection 🚀
              </p>
              <button className="mt-4 p-1 transition-all bg-slate-800 px-3 border border-transparent hover:border-white cursor-pointer rounded-lg text-slate-400">
                Explore
              </button>
            </div>
          </>
        )}
        {chats && chats.conversations.length < 1 && (
          <>
            <div className="chats-head px-3 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1 cursor-pointer">
                <span>People joined</span>
                <MdKeyboardArrowDown />
              </div>
              {/* <i className="cursor-pointer">
                <BiMessageRoundedAdd />
              </i> */}
            </div>
            {all_users &&
              all_users.map((profile, i) => (
                <div
                  onClick={() => navigate(`/chat/${profile.email}`)}
                  className="chat cursor-pointer p-2 flex items-center gap-2 transition-all rounded-lg hover:bg-slate-800"
                  key={i}
                >
                  <div className="avatar-wrapper h-10">
                    <div className="avatar w-10 h-full rounded-full bg-slate-600"></div>
                  </div>
                  <div className="cont">
                    <h3>{profile.displayName}</h3>
                    <p className="w-full text-slate-500">
                      {/* {conversation?.messages[0].content} */}
                    </p>
                  </div>
                </div>
              ))}
          </>
        )}
      </main>
    </aside>
  );
};

export default Sidebar;
