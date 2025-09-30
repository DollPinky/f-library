import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import BookManagement from "./pages/admin/BookManagement/BookManagement";
import Dashboard from "./pages/admin/Dashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/book-management", element: <BookManagement /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
