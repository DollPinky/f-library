import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { adminNavItems, userNavItems } from "@/data/mockData";

export default function MainLayout() {
  const [activateItemId, setActiveItemId] = useState<string>("admin-dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if we're in admin or user section
  const isUserSection = location.pathname.startsWith("/user");
  const currentNavItems = isUserSection ? userNavItems : adminNavItems;

  useEffect(() => {
    const currPath = location.pathname;

    // Handle exact path matching and also /admin -> /admin/dashboard, /user -> /user/dashboard
    let matchingItem = currentNavItems.find((item) => item.href === currPath);

    // If no exact match, try to find based on path segments
    if (!matchingItem) {
      if (currPath.startsWith("/admin/book-management")) {
        matchingItem = currentNavItems.find(
          (item) => item.id === "admin-book-management"
        );
      } else if (currPath === "/admin" || currPath === "/admin/dashboard") {
        matchingItem = currentNavItems.find(
          (item) => item.id === "admin-dashboard"
        );
      } else if (currPath === "/user" || currPath === "/user/dashboard") {
        matchingItem = currentNavItems.find(
          (item) => item.id === "user-dashboard"
        );
      } else {
        // Try to match by path segments
        matchingItem = currentNavItems.find(
          (item) =>
            currPath.startsWith(item.href) || item.href.startsWith(currPath)
        );
      }
    }

    if (matchingItem) {
      setActiveItemId(matchingItem.id);
    }
  }, [location.pathname, currentNavItems]);

  const handleNavigate = (id: string, href: string) => {
    setActiveItemId(id);
    navigate(href);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        activateItemId={activateItemId}
        onNavigate={handleNavigate}
        navItems={currentNavItems}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activateItemId={activateItemId}
          onNavigate={handleNavigate}
          navItems={currentNavItems}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
