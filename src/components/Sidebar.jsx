import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAllUsers } from "../actions";
import { db } from "../firebase/firebase";
import Loading from "./Loading";

const Sidebar = () => {
  const [searchVal, setSearchVal] = useState("");
  const [loading_all_users, setLoadingAll_users] = useState(true);
  const [chatsLoading, setChatsLoading] = useState(true);
  const dispatch = useDispatch();
  const user_profile = useSelector((state) => {
    return state.user_profile;
  });
  const [chats, setChats] = useState([]);
  const all_users = useSelector((state) => {
    return state.all_users;
  });
  const isLogged = useSelector((state) => {
    return state.isLogged;
  });
  // const handleSearch = async (e) => {
  //   setSearchVal(e.target.value);
  //   if (searchVal !== "") {
  //     const q = query(
  //       collection(db, "users"),
  //       where("email", ">=", searchVal),
  //       where("email", "<=", searchVal + "\uf8ff")
  //     );
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       const data = [];
  //       // doc.data() is never undefined for query doc snapshots
  //       // console.log(doc.id, " => ", doc.data(), "hdsa");
  //       data.push(doc.data());
  //       setJoinedUsers(data);
  //     });
  //   }
  // };

  // console.log(all_users);
  const navigate = useNavigate();
  useEffect(() => {
    onSnapshot(doc(db, "users", user_profile.uid), (doc) => {
      setChats(doc.data().connected_users);
      setChatsLoading(false);
    });
  }, []);
  useEffect(() => {
    if (isLogged) {
      const getAllUsers = async () => {
        const q = query(
          collection(db, "users"),
          where("uid", "!=", user_profile?.uid)
        );
        const datas = [];
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            datas.push(doc.data());
          });
          dispatch(setAllUsers(datas));
          setLoadingAll_users(false);
        });
      };
      getAllUsers();
    }
  }, [isLogged]);
  return (
    <aside className="sidebar w-4/12 h-100 pt-4 text-primary border-r-slate-600 border-r">
      <header className="w-full px-4 flex h-min items-center text-slate-400">
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
            // onChange={(e) => {
            //   handleSearch(e);
            // }}
            name="search"
            placeholder="Search"
            type="text"
            className="p-2 w-full rounded-xl px-3 pl-8 outline-none placeholder:text-slate-400 bg-slate-600"
          />
        </label>
      </header>
      <main className="mt-3 overflow-y-scroll px-4 h-full pb-20">
        <div className="inne">
          <div className="chats-head px-3 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1 cursor-pointer">
              <span>Chats</span>
              <MdKeyboardArrowDown />
            </div>
            <i className="cursor-pointer">
              <BiMessageRoundedAdd />
            </i>
          </div>
          {chatsLoading ? (
            <div className="p-5 w-full h-50 flex items-center justify-center">
              <Loading />
            </div>
          ) : (
            <>
              {chats && chats.length > 0 ? (
                <>
                  {chats.map((conversation, i) => (
                    <div
                      onClick={() => navigate(`/chat/${conversation.email}`)}
                      className="chat cursor-pointer p-2 flex items-center gap-2 transition-all rounded-lg hover:bg-slate-800"
                      key={i}
                    >
                      <div className="avatar-wrapper h-10">
                        <div className="avatar w-10 h-full rounded-full overflow-hidden bg-slate-600">
                          <img
                            className="w-full h-full object-center object-cover"
                            src={conversation.photoUrl}
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="cont">
                        <h3>{conversation.displayName}</h3>
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
                      You don't have any conversations yet. Say hi to anyone and
                      grow connection 🚀
                    </p>
                    <button className="mt-4 p-1 transition-all bg-slate-800 px-3 border border-transparent hover:border-white cursor-pointer rounded-lg text-slate-400">
                      Explore
                    </button>
                  </div>
                </>
              )}
            </>
          )}
          <div className="all_users_wrapper">
            {chats && chats.length < 5 && (
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
                {loading_all_users ? (
                  <div className="p-5 w-full h-50 flex items-center justify-center">
                    <Loading />
                  </div>
                ) : (
                  <>
                    {all_users &&
                      all_users.map((profile, i) => (
                        <div
                          onClick={() => navigate(`/chat/${profile.email}`)}
                          className={`chat ${
                            !profile.photoUrl && "animate-pulse"
                          } cursor-pointer p-2 flex items-center gap-2 transition-all rounded-lg hover:bg-slate-800`}
                          key={i}
                        >
                          <div className="avatar-wrapper">
                            <div className="avatar-wrapper overflow-hidden w-12 h-12 rounded-full bg-slate-800">
                              {profile.photoUrl !== "" && (
                                <img
                                  className="w-full h-full object-center object-cover"
                                  src={profile.photoUrl}
                                  alt=""
                                />
                              )}
                            </div>
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
              </>
            )}
          </div>
        </div>
      </main>
    </aside>
  );
};

export default Sidebar;
