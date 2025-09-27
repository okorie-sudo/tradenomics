// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Leaderboard from "./pages/Leaderboard";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";

import BottomNav from "./components/BottomNav";

import Chat from "./pages/Chat";
import UserProfile from "./pages/UserProfile";
import { useAuth } from "./hooks/useAuth";
import AuthCallback from "./pages/AuthCallback";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Feed />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/settings" element={user ? <Settings /> : <Auth />} />
        <Route
          path="/messages/:id"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;

// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import BottomNav from "./components/BottomNav";
// import Feed from "./pages/Feed";
// import AuthCallback from "./pages/AuthCallback";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/auth" element={<Auth />} />
//         <Route path="/auth/callback" element={<AuthCallback />} />
//         <Route path="/feed" element={<Feed />} />
//       </Routes>
//       <BottomNav />
//     </BrowserRouter>
//   );
// };

// export default App;
