import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { navItems, settingsNavItem } from "@/data/mockData";

export default function MainLayout() {
  const [activateItemId, setActiveItemId] = useState<string>("dashboard");
  const location = useLocation();

  useEffect(() => {
    const currPath = location.pathname;
    const currentItem = [...navItems, settingsNavItem].find(
      (item) => item.href === currPath
    );

    if (currentItem) {
      setActiveItemId(currentItem.id);
    }
  }, [location.pathname]);

  const handleNavigate = (id: string) => {
    setActiveItemId(id);
  };
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activateItemId={activateItemId}
          onNavigate={() => handleNavigate(activateItemId)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
