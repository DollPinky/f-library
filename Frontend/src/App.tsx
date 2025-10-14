import "./App.css";
import { RouterProvider } from "react-router-dom";

import router from "./routes/index";
// const router = createBrowserRouter([
//   // Auth (no layout)
//   { path: "/login", element: <AuthWithProvider /> },

//   {
//     path: "/",
//     element: <LayoutWithAuth />,
//     children: [
//       { index: true, element: <Navigate to="/admin" replace /> },

//       // Admin routes
//       {
//         path: "/admin",
//         children: [
//           { index: true, element: <AdminDashboard /> },
//           { path: "dashboard", element: <AdminDashboard /> },
//           { path: "book-management", element: <BookManagement /> },
//           { path: "book-management/book/:bookId", element: <BookDetail /> },
//           {
//             path: "user-management",
//             element: <div>User Management (Coming Soon)</div>,
//           },
//           { path: "reports", element: <div>Reports (Coming Soon)</div> },
//         ],
//       },

//       // User routes
//       {
//         path: "/user",
//         children: [
//           { index: true, element: <UserDashboard /> },
//           { path: "dashboard", element: <UserDashboard /> },
//           { path: "borrow-books", element: <BorrowBookManagement /> },
//           { path: "return-books", element: <ReturnBookManagement /> },
//         ],
//       },

//       // Legacy (compatibility)
//       { path: "/book-management", element: <BookManagement /> },
//     ],
//   },
// ]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
