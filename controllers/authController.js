const { executeSql } = require("../utils/db");
const jwt = require("jsonwebtoken");
const { TYPES } = require("tedious"); // Import TYPES from tedious

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const users = await executeSql(
      `
      SELECT id, username, password, role FROM Users 
      WHERE username = @username
    `,
      [{ name: "username", type: TYPES.VarChar, value: username }]
    );

    if (users.length === 0 || users[0].password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function register(req, res) {
  const { username, password, role = "consumer" } = req.body;

  try {
    const existingUsers = await executeSql(
      `SELECT id FROM Users WHERE username = @username`,
      [{ name: "username", type: TYPES.VarChar, value: username }]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    await executeSql(
      `
      INSERT INTO Users (username, password, role) 
      VALUES (@username, @password, @role)
    `,
      [
        { name: "username", type: TYPES.VarChar, value: username },
        { name: "password", type: TYPES.VarChar, value: password },
        { name: "role", type: TYPES.VarChar, value: role },
      ]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { login, register };
