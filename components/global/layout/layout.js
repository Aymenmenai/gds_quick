import * as React from "react";
import SideBar from "@/components/build/layout/sidebar";
import Nbar from "@/components/build/layout/n-bar";
import Status from "@/components/v2/app/containers/status";

function Layout({ children }) {
  return (
    <div className="h-auto w-screen flex justify-start items-starts bg-gray-100">
      <Status />
      <SideBar />
      <div className="flex-1">
        <Nbar />
        <div className="flex-1 p-4">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
