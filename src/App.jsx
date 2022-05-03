import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { setLogged, setProfile } from "./actions";
import firebase, { db } from "./firebase/firebase";
import Layout from "./layout/Layout";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

const App = () => {
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
        // const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        // onSnapshot(q, (querySnapshot) => {
        //   querySnapshot.forEach((doc) => {
        //     dispatch(setProfile(doc.data()));
        //   });
        // });
        dispatch(
          setProfile({
            displayName: user?.displayName,
            email: user?.email,
            photoUrl: user?.photoURL,
            emailVerified: user?.emailVerified,
            uid: user?.uid,
          })
        );
        dispatch(setLogged(true));
        // console.log(user);
      } else {
        dispatch(setLogged(false));
      }
    });
    console.log(user_profile);
  }, []);

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
