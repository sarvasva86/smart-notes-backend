require("dotenv").config();


const express = require("express");
const cors = require("cors");
const path = require("path");
console.log("Current directory:", __dirname);

const app = express();
const PORT = 5000;

// Middleware

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require(path.join(__dirname, "routes", "auth"));
console.log("Auth routes loaded");
app.use("/auth", authRoutes);

app.post("/auth/register", (req, res) => {
    res.send("Route is working!");
});


// Test root
app.get("/", (req, res) => {
  res.send("Smart Notes Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const notesRoutes = require("./routes/notes");
app.use("/notes", notesRoutes);
