import React from "react";
import ChatDetails from "../components/ChatDetails";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <main className="layout flex w-100-vw h-screen">
      <Sidebar />
      <main className="chat-viewer h-full w-11/12">{children}</main>
      <ChatDetails />
    </main>
  );
};

export default Layout;
