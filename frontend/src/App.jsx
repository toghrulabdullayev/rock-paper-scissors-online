import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ErrorPage from "./pages/Error";

import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import CpuPage from "./pages/Cpu";
import OnlinePage from "./pages/OnlineLayout";

import AuthLayout from "./pages/Auth";
import AuthPage from "./pages/AuthPage";

import ProfileLayout from "./pages/ProfileLayout";
import UserPage from "./pages/User";
import SettingsPage from "./pages/SettingsPage";
import LobbyPage from "./pages/LobbyPage";
import RoomPage from "./pages/RoomPage";

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "cpu", element: <CpuPage /> },
      {
        path: "online",
        element: <OnlinePage />,
        children: [
          { index: true, element: <LobbyPage /> },
          { path: ":roomId", element: <RoomPage /> },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [{ index: true, element: <AuthPage /> }],
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [{ path: ":username", element: <UserPage /> }],
      },

      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  );
}

export default App;
