import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data.token, data.user || { email, role: data.role });
      const role = data.role;
      if (role === "ADMIN") navigate("/admin");
      else if (role === "STORE_OWNER") navigate("/owner");
      else navigate("/user");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="card-title">Welcome back</div>
      <div className="card-subtitle">
        Log in to rate stores or manage the platform.
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="stack-row" style={{ justifyContent: "space-between" }}>
          <span className="page-subtitle">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </span>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

