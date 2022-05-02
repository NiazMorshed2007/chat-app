import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { setLogged, setProfile } from "./actions";
import firebase from "./firebase/firebase";
import Layout from "./layout/Layout";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const auth = firebase && getAuth();
  const user_profile = useSelector((state) => {
    return state.user_profile;
  });
  const isLogged = useSelector((state) => {
    return state.isLogged;
  });
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const user_obj = {
          displayName: user?.displayName,
          email: user?.email,
          photoUrl: user?.photoURL,
          emailVerified: user?.emailVerified,
          uid: user?.uid,
        };
        dispatch(setProfile(user_obj));
        setLoading(false);
        dispatch(setLogged(true));
      } else {
        setLoading(false);
        dispatch(setLogged(false));
      }
    });
  }, []);
  useEffect(() => {
    // onSnapshot(collection(db, "chats/", user_profile.uid), (doc) => {
    //   if (doc.data() === undefined) {
    //     // setMessages([]);
    //   } else {
    //     console.log(doc.data());
    //     // setMessages(doc.data().messages);
    //   }
    // });
    // const q = query(
    //   collection(db, "chats"),
    //   where("owner", "==", user_profile.uid)
    // );
    // onSnapshot(q, (querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     dispatch(setChats(doc.data()));
    //   });
    // });
  }, [loading]);

  return (
    <>
      {isLogged ? (
        <Layout>
          <Routes>
            <Route path="/chat/:chat_id" element={<Chat />} />
            <Route
              path="*"
              element={
                <>
                  <div className="flex w-11/12 empty-chat text-slate-500 h-full items-center justify-center">
                    <h3 className="p-1 bg-slate-800 px-3 rounded-xl">
                      Select a chat to message 🥡
                    </h3>
                  </div>
                </>
              }
            />
          </Routes>
        </Layout>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
