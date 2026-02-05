import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserStoresPage from "./pages/UserStoresPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import OwnerDashboardPage from "./pages/OwnerDashboardPage";
import ChangePasswordModal from "./components/ChangePasswordModal";

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar-title">Store Ratings Platform</div>
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="chip">
                {user.name || user.email} — {user.role}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/user"
            element={
              <RequireRole role="USER">
                <UserStoresPage />
              </RequireRole>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireRole role="ADMIN">
                <AdminDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/owner"
            element={
              <RequireRole role="STORE_OWNER">
                <OwnerDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={roleToHome(user.role)} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

function roleToHome(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "STORE_OWNER") return "/owner";
  return "/user";
}

function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={roleToHome(user.role)} replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

