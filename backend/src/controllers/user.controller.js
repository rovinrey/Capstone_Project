// 1. Use require instead of import
const { createUser, getAllUsers, submitTupadApplication,submit_DILP_Application} = require("../services/user.services");

// 2. Remove "export" keyword and TypeScript types (Request/Response)
async function addUser(req, res) {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
}

const fetchUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// tupad controller 
const postTupadForm = async (req, res) => {
  try {
    const result = await submitTupadApplication(req.body);
    res.status(201).json({ 
        success: true, 
        message: "Application submitted!", 
        id: result.insertId 
    });
  } catch (error) {
    console.error("BUG DETECTED:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// DILP controllers
const postDilpForm = async (req, res) => {
  try {
    const result = await submit_DILP_Application(req.body);
    req.status(201).json({
      success: true,
      message: 'Appication submitted!',
      id: result.insertId
    });
  } catch (error) {
    console.error('erroe detected: ', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Export everything together at the bottom
module.exports = { 
  addUser, 
  fetchUsers, 
  postTupadForm ,
  postDilpForm
};