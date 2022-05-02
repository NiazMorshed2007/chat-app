import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { gsap, Power2 } from "gsap";
import { TextPlugin } from "gsap/all";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setLogged } from "../actions";
import firebase, { db, storage } from "../firebase/firebase";
gsap.registerPlugin(TextPlugin);

const Auth = () => {
  const [errMsg, setErrMsg] = useState("");
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const storageRef = ref(storage, "avatars/" + file?.name);
  let formRef = useRef();
  const metadata = {
    contentType: "image/jpeg",
  };
  const auth = firebase && getAuth();

  const types = ["image/png", "image/jpg", "image/jpeg"];

  const avatarHandler = (e) => {
    const selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setErrMsg("");
    } else {
      setFile(null);
      setErrMsg("Please select a image file (jpg, png, gif or jpeg)");
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (isSigningUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const uploadTask = uploadBytesResumable(storageRef, file, metadata);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
              switch (error.code) {
                case "storage/unauthorized":
                  break;
                case "storage/canceled":
                  break;
                case "storage/unknown":
                  break;
              }
            },
            async () => {
              const URL = await getDownloadURL(uploadTask.snapshot.ref).then(
                (downloadURL) => {
                  return downloadURL;
                }
              );
              const user_profile = {
                displayName: name,
                photoUrl: URL,
                email: user?.email,
                emailVerified: user?.emailVerified,
                uid: user?.uid,
                connected_users: [],
              };
              const chat = {
                owner: user?.uid,
              };
              setErrMsg("");
              setDoc(doc(db, "users", user?.uid), {
                ...user_profile,
              });
              setDoc(doc(db, "chats", user?.uid), {
                ...chat,
              });
              dispatch(setLogged(true));
            }
          );
        })
        .catch((err) => {
          switch (err.code) {
            case "auth/email-already-in-use":
              {
                setErrMsg("This email is alerady in use");
              }
              break;
            case "auth/invalid-email":
              {
                setErrMsg("This email doesn't exists");
              }
              break;
            case "auth/weak-password": {
              setErrMsg("Please enter a strong password(at least 6 chars)");
            }
          }
        });
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setErrMsg("");
        })
        .catch((err) => {
          setErrMsg("Invalid email or password");
        });
    }
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUrl("");
    }
  }, [file]);

  useEffect(() => {
    gsap.fromTo(
      ".cursor",
      {
        opacity: 0,
        duration: 0.9,
      },
      {
        opacity: 1,
        repeat: -1,
        ease: Power2.easeOut,
      }
    );
    let tl = gsap.timeline();
    tl.to(".welcome", {
      duration: 2,
      text: "Welcome to the connected world!",
      ease: "none",
      delay: 0.9,
    })
      .to(".f-welcome", { display: "none" })
      .fromTo(
        ".l-welcome",
        {
          display: "none",
        },
        {
          display: "block",
        }
      )
      .to(".begin", {
        duration: 1,
        text: "Let's begin the journey!!",
        ease: "none",
      })
      .fromTo(
        ".form",
        {
          height: 0 + "px",
          opacity: 0,
          duration: 3,
        },
        {
          height: "max-content",
          opacity: 1,
          ease: Power2.easeOut,
        }
      );
  }, []);
  return (
    <main className="auth px-3 text-slate-400 flex flex-col items-center justify-center w-screen h-screen">
      <div className="fixed top-5 gap-3 items-center flex right-5">
        <h3>Already have an account?</h3>
        <button className="cursor-pointer bg-slate-800 p-1 px-3 rounded-xl">
          Sign in
        </button>
      </div>
      <div>
        <h1 className="welcome text-2xl text-slate-400 inline-block"></h1>
        <span className="text-slate-400 cursor f-welcome">__</span>
        <div className="flex">
          <h2 className="text-slate-500 begin"></h2>
          <span className="text-slate-500 cursor l-welcome">__</span>
        </div>
        <form
          ref={formRef}
          onSubmit={handleAuth}
          className="form rounded-lg overflow-hidden mt-8 pb-4 bg-slate-900 border border-slate-800 p-3"
        >
          <div className="flex bg-slate-700 gap-3 mb-3 h-max py-5 p-4 rounded-lg items-center">
            <div className="avatar-wrapper overflow-hidden w-16 h-16 rounded-full bg-slate-800">
              {url !== "" && (
                <img
                  className="w-full h-full object-center object-cover"
                  src={url}
                  alt=""
                />
              )}
            </div>
            <div>
              <input
                required
                onChange={avatarHandler}
                className=" w-10/12 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:cursor-pointer
              file:text-sm file:font-semibold
              file:bg-cyan-700 file:text-slate-300
              hover:file:bg-cyan-600"
                type="file"
              />
            </div>
          </div>
          <label htmlFor="name">
            <p className="text-slate-500">Enter you Name</p>
            <input
              className="w-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              required
              id="name"
            />
          </label>
          <label htmlFor="email">
            <p className="text-slate-500">Enter you email</p>
            <input
              className="w-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
              type="email"
              id="email"
            />
          </label>
          <label htmlFor="password">
            <p className="text-slate-500 mt-4">Enter you password</p>
            <input
              required
              value={password}
              className="w-input"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrMsg("");
              }}
              id="password"
              type="password"
            />
          </label>
          <p className="text-red-600 pt-2">{errMsg}</p>
          <button className="my-4 text-white p-2 rounded-2xl w-full bg-blue-500 shadow-lg shadow-blue-500/50">
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
};

export default Auth;
