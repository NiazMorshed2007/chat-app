import React from "react";
import ChatDetails from "../components/ChatDetails";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <main className="layout flex w-100-vw overflow-hidden h-screen">
      <Sidebar />
      {children}
      <ChatDetails />
    </main>
  );
};

export default Layout;
