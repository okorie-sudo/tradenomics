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
import Notificatin from "./pages/Notificatin";
import Profile from "./pages/Profile";
import Create from "./pages/Create";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import BottomNav from "./components/BottomNav";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { user } = useAuth();

  console.log(user);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={!user ? <Auth /> : <Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <Notificatin />
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
