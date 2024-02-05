import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Signup from "./pages/Signup.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import Profile from "./pages/Profile.jsx";
import Signin from "./pages/Signin.jsx";
import PrivateRoute from "./privateRoutes/PrivateRoute.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatInbox from "./pages/ChatInbox.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        ),
        children: [{ path: "inbox/:chatId", element: <ChatInbox /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
