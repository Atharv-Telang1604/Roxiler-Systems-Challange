import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

const isValidName = (name = "") => name.length >= 20 && name.length <= 60;
const isValidAddress = (address = "") => address.length <= 400;
const isValidPassword = (password = "") => {
  const lengthOk = password.length >= 8 && password.length <= 16;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return lengthOk && hasUpper && hasSpecial;
};
const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!isValidName(form.name)) {
      e.name = "Name must be between 20 and 60 characters.";
    }
    if (!isValidEmail(form.email)) {
      e.email = "Invalid email format.";
    }
    if (!isValidAddress(form.address)) {
      e.address = "Address must not exceed 400 characters.";
    }
    if (!isValidPassword(form.password)) {
      e.password =
        "Password must be 8-16 characters and include at least one uppercase letter and one special character.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validate()) return;
    setLoading(true);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess("Registered successfully. You can now login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className="card-title">Create your account</div>
      <div className="card-subtitle">
        Sign up as a normal user to rate stores on the platform.
      </div>
      <form className="stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
        </div>
        <div className="form-field">
          <label>Address</label>
          <textarea
            rows={3}
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            required
          />
          {errors.address && (
            <div className="form-error">{errors.address}</div>
          )}
        </div>
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          <span className="form-error">
            8-16 chars, with at least one uppercase and one special character.
          </span>
          {errors.password && (
            <div className="form-error">{errors.password}</div>
          )}
        </div>
        {serverError && <div className="form-error">{serverError}</div>}
        {success && (
          <div style={{ color: "#16a34a", fontSize: "0.85rem" }}>
            {success}
          </div>
        )}
        <div className="stack-row" style={{ justifyContent: "space-between" }}>
          <span className="page-subtitle">
            Already have an account?{" "}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </span>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
}

