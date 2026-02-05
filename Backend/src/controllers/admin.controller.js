const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Store = require("../models/store.model");
const Rating = require("../models/rating.model");


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

exports.getDashboard = async (req, res) => {
  try {
    const users = await User.getAll();
    const stores = await Store.getAll();
    const ratings = await Rating.countAll();

    res.json({
      totalUsers: users.length,
      totalStores: stores.length,
      totalRatings: ratings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurede in Fetching" });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!isValidName(name)) {
      return res
        .status(400)
        .json({ message: "Name must be between 20 and 60 characters." });
    }
    if (!isValidAddress(address)) {
      return res
        .status(400)
        .json({ message: "Address must not be above 400 characters." });
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
    if (!["USER", "ADMIN", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      address,
      role,
    });

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
};


exports.listUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;
    const users = await User.getAllWithFilters({ name, email, address, role });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let storeRating = null;

    if (user.role === "STORE_OWNER") {
      const result = await Store.getAllWithFilters({}); 
      const ownerStoresResult = await require("../config/db").query(
        `
        SELECT 
          s.id,
          s.name,
          ROUND(AVG(r.rating), 1) AS "avgRating"
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE s.owner_id = $1
        GROUP BY s.id
        `,
        [id]
      );
      storeRating = ownerStoresResult.rows;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      storeRatings: storeRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user details" });
  }
};
