import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/admin/DashBoard";
import BookManagement from "./pages/admin/BookManagement/BookManagement";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "/book_management", element: <BookManagement /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
