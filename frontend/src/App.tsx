import { useState } from "react";
import "./App.css";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import WelcomeCard from "./components/layout/WelcomeCard";

function App() {
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans antialiased text-gray-800">
      <Sidebar
        activateItemId={activeSidebarItem}
        onNavigate={setActiveSidebarItem}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <WelcomeCard />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
