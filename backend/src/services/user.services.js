const pool = require("../config/db.js");
const bcrypt = require("bcryptjs");
// If you are using plain JavaScript, you usually don't need a .type.js file 
// unless it contains logic. If it's just a class/object, require it here:
// const User = require("../types/user.type.js"); 

const createUser = async (user) => {
  // 1. Hash the password
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // 2. Destructure result from the query
  const [result] = await pool.query(
    `INSERT INTO users (full_name, username, password, role)
     VALUES (?, ?, ?, ?)`,
    [user.full_name, user.username, hashedPassword, user.role]
  );

  return result;
};

const getAllUsers = async () => {
  const [rows] = await pool.query(
    "SELECT id, fullName, username, role, created_at FROM users"
  );
  return rows;
};

// --- EXPORTING ---
// This is how you export multiple functions in basic Node.js
module.exports = {
  createUser,
  getAllUsers
};