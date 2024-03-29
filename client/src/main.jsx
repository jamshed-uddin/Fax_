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
import NotFound from "./pages/NotFound.jsx";
import ThemeProvider from "./providers/ThemeProvider.jsx";
import SocketProvider from "./providers/SocketProvider.jsx";
import ChatPageHome from "./pages/ChatPageHome.jsx";
import OnlineStatusProvider from "./providers/OnlineStatusProvider.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatPage />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <ChatPageHome />,
        errorElement: <NotFound />,
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
        path: "editGroup/:groupId",
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
  {
    path: "forgotPassword",
    element: <ForgotPassword />,
  },
  {
    path: "resetPassword/:resetToken",
    element: <ResetPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <QueryClientProvider client={queryClient}>
      <OnlineStatusProvider>
        <AuthProvider>
          <ChatsProvider>
            <SocketProvider>
              <ThemeProvider>
                <RouterProvider router={router} />
              </ThemeProvider>
            </SocketProvider>
          </ChatsProvider>
        </AuthProvider>
      </OnlineStatusProvider>
    </QueryClientProvider>
  </>
);
