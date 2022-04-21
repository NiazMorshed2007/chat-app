import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiSend, FiImage } from "react-icons/fi";
import { BiSticker } from "react-icons/bi";
import { AiOutlineFileGif } from "react-icons/ai";
import {
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const Chat = () => {
  const { chat_id } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [reciverProfile, setReciverProfile] = useState(null);
  const user_profile = useSelector((state) => {
    return state.user_profile;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg_ref = doc(
      db,
      "chats/",
      user_profile.uid,
      "/conversations",
      reciverProfile.uid
    );
    const msg_ref2 = doc(
      db,
      "chats/",
      reciverProfile.uid,
      "/conversations",
      user_profile.uid
    );
    const message = {
      content: text,
      sender_uid: user_profile.uid,
      reciver_uid: reciverProfile.uid,
    };
    await updateDoc(msg_ref, {
      messages: arrayUnion(message),
    });
    await updateDoc(msg_ref2, {
      messages: arrayUnion(message),
    });
    setText("");
  };
  // const chat = chats && chats.conversations.find((convers))
  const newConversation = async () => {
    const firstMessage = {
      content: "Hi✋",
      sender_uid: user_profile.uid,
      reciver_uid: reciverProfile.uid,
    };
    const reciver_chatsRef = doc(
      db,
      "chats",
      reciverProfile.uid,
      "conversations",
      user_profile.uid
    );
    const sender_chatsRef = doc(
      db,
      "chats",
      user_profile.uid,
      "conversations",
      reciverProfile.uid
    );
    const forReciver = {
      reciver_uid: user_profile.uid,
      reciver_name: user_profile.displayName,
      reciver_email: user_profile.email,
      messages: [
        {
          ...firstMessage,
        },
      ],
    };
    const forSender = {
      reciver_uid: reciverProfile.uid,
      reciver_name: reciverProfile.displayName,
      reciver_email: reciverProfile.email,
      messages: [
        {
          ...firstMessage,
        },
      ],
    };
    await setDoc(reciver_chatsRef, {
      ...forReciver,
    });
    await setDoc(sender_chatsRef, {
      ...forSender,
    });
  };

  useEffect(() => {
    const q = query(collection(db, "users"), where("email", "==", chat_id));
    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setReciverProfile(doc.data());
        setLoading(false);
      });
    });
  }, [chat_id]);
  useEffect(() => {
    if (reciverProfile?.uid) {
      onSnapshot(
        doc(
          db,
          "chats/",
          user_profile.uid,
          "/conversations",
          reciverProfile.uid
        ),
        (doc) => {
          if (doc.data() === undefined) {
            setMessages([]);
          } else {
            setMessages(doc.data().messages);
          }
        }
      );
    }
  }, [reciverProfile]);
  return (
    <div className="relative chat h-full">
      {reciverProfile && (
        <>
          <header className="p-3 pb-2 h-1/12 border-b text-slate-100 border-slate-600 flex items-center gap-3">
            <div className="avatar-wrapper h-12">
              <div className="avatar w-12 h-full rounded-full bg-slate-600"></div>
            </div>
            <div className="cont">
              {/* <h3>{profile.displayName}</h3> */}
              <h3>{reciverProfile.displayName}</h3>
              <p className="w-full text-sm text-slate-500">
                last seen 1 hour ago
                {/* {conversation?.messages[0].content} */}
              </p>
            </div>
          </header>
          <main
            className={`text-slate-400 h-full pb-28 flex ${
              messages.length < 1
                ? "justify-center items-center"
                : "flex-col p-3"
            }`}
          >
            {messages.length > 0 ? (
              <>
                {messages.map((message, i) => (
                  <div
                    className={`msg p-1 flex w-max text-slate-300 px-4 rounded-lg ${
                      message.sender_uid === user_profile.uid
                        ? "bg-cyan-700 self-end"
                        : "bg-slate-800"
                    }`}
                    key={i}
                  >
                    {message.content}
                  </div>
                ))}
              </>
            ) : (
              <div className="say-hi p-3 flex flex-col items-center justify-center bg-slate-700 rounded-lg">
                <div className="avatar-wrapper m-2 h-14">
                  <div className="avatar w-14 h-full rounded-full bg-slate-600"></div>
                </div>
                <div className="cont">
                  {/* <h3>{profile.displayName}</h3> */}
                  <h3>{chat_id}</h3>
                  <p className="w-full text-sm text-slate-500">
                    last seen 1 hour ago
                    {/* {conversation?.messages[0].content} */}
                  </p>
                </div>
                <p className="mt-5">
                  Say hi to
                  <span className="t px-2 text-cyan-500">
                    {reciverProfile.displayName}
                  </span>
                  and be his friend 🚀
                </p>
                <button
                  onClick={newConversation}
                  className="mt-4 p-1 transition-all bg-slate-800 px-3 border border-transparent hover:border-white cursor-pointer rounded-lg text-slate-400"
                >
                  Say hi
                </button>
              </div>
            )}
          </main>
          <form
            onSubmit={handleSubmit}
            className="absolute text-slate-400 flex gap-3 items-center left-0 bottom-0 p-4 bg-slate-800 w-full"
          >
            <i>
              <FiImage />
            </i>
            <i>
              <BiSticker />
            </i>
            <i>
              <AiOutlineFileGif />
            </i>
            {/* <form className="flex w-4/5"> */}
            <input
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              placeholder="Type a message..."
              className="p-2 px-3 w-4/5 bg-slate-600 placeholder:text-sm outline-none rounded-lg"
              type="text"
            />
            <button type="submit">
              <FiSend />
            </button>
            {/* </form> */}
          </form>
        </>
      )}
    </div>
  );
};

export default Chat;
