import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import Profile from "./pages/Profile.jsx";
import Signin from "./pages/Signin.jsx";
import PrivateRoute from "./privateRoutes/PrivateRoute.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatInbox from "./pages/ChatInbox.jsx";
import ChatsProvider from "./providers/ChatsProvider.jsx";
import CreateGroup from "./pages/CreateGroup.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatPage />,
    children: [
      {
        path: "/",
        element: (
          <div className="h-full w-full grid place-items-center">
            <div>
              <h1>Select chat and start messaging</h1>
            </div>
          </div>
        ),
      },
      {
        path: "inbox/:chatId",
        element: (
          <PrivateRoute>
            <ChatInbox />
          </PrivateRoute>
        ),
      },
      {
        path: "profile/:userId",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "createGroup",
        element: (
          <PrivateRoute>
            <CreateGroup />
          </PrivateRoute>
        ),
      },
      {
        path: "createGroup/:groupId",
        element: (
          <PrivateRoute>
            <CreateGroup />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "signin",
    element: <Signin />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatsProvider>
          <RouterProvider router={router} />
        </ChatsProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
