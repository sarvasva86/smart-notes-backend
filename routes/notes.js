const express = require("express");
const router = express.Router();
const pool = require("../db"); // our database connection
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET
    , (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // contains userId from login
    next();
  });
}

module.exports = router;


// Create a new note
router.post("/", authenticateToken, async (req, res) => {
    try {
      const { title, content } = req.body;
      const userId = req.user.userId;
  
      const newNote = await pool.query(
        "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
        [title, content, userId]
      );
  
      res.json(newNote.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  
  // Get all notes for the logged-in user
router.get("/", authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
  
      const notes = await pool.query(
        "SELECT * FROM notes WHERE user_id = $1",
        [userId]
      );
  
      res.json(notes.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  
  // Update a note
router.put("/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.user.userId;
  
      const updatedNote = await pool.query(
        "UPDATE notes SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
        [title, content, id, userId]
      );
  
      if (updatedNote.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      res.json(updatedNote.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  
  // Delete a note
router.delete("/:id", authenticateToken, async (req, res) => {
    
    try {
      const { id } = req.params;
      const userId = req.user.userId;
  
      const deletedNote = await pool.query(
        "DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *",
        [id, userId]
      );
  
      if (deletedNote.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      res.json({ message: "Note deleted successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  