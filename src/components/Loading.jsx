import React from "react";

const Loading = () => {
  return (
    <div
      style={{ width: "20px", height: "20px" }}
      className="w-50 h-50 h-1 rounded-full border-2 border-slate-600 border-t-slate-400 animate-spin"
    ></div>
  );
};

export default Loading;
