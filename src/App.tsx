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
import { AuthProvider } from "./context/AuthProvider";
import BottomNav from "./components/BottomNav";
import { useAuth } from "./hooks/useAuth";
import Chat from "./pages/Chat";
import UserProfile from "./pages/UserProfile";

function App() {
  const { user } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={!user ? <Auth /> : <Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
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
    </AuthProvider>
  );
}

export default App;
