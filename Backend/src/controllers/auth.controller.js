const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { generateToken } = require("../config/jwt");

// Basic validators as per requirements
const isValidName = (name = "") => name.length >= 20 && name.length <= 60;
const isValidAddress = (address = "") => address.length <= 400;
const isValidPassword = (password = "") => {
  // 8–16 chars, at least one uppercase, at least one special character
  const lengthOk = password.length >= 8 && password.length <= 16;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return lengthOk && hasUpper && hasSpecial;
};
const isValidEmail = (email = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    if (!isValidName(name)) {
      return res
        .status(400)
        .json({ message: "Name must be between 20 and 60 characters." });
    }
    if (!isValidAddress(address)) {
      return res
        .status(400)
        .json({ message: "Address must not exceed 400 characters." });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters and include at least one uppercase letter and one special character.",
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      address,
      role: "USER",
    });

    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    // Return more specific error message for debugging
    const errorMessage = err.message || "Registration failed";
    // Check if it's a database error (table doesn't exist, etc.)
    if (err.code === '42P01') {
      return res.status(500).json({ 
        message: "Database table 'users' does not exist. Please run the schema.sql file in your Supabase SQL Editor."
      });
    }
    if (err.code === '23505') {
      return res.status(400).json({ 
        message: "Email already registered."
      });
    }
    res.status(500).json({ 
      message: errorMessage || "Registration failed"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password is not valid" });
    }

    const token = generateToken({ id: user.id, role: user.role });
    res.json({
      token,
      role: user.role,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed error occurred" });
  }
};

// Allow any authenticated user (normal, owner, admin) to update password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        message:
          "New password must be 8-16 characters and include at least one uppercase letter and one special character.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(userId, hashed);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update password" });
  }
};
