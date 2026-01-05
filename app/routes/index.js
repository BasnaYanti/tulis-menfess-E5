const express = require("express");
const router = express.Router();
const db = require("../config/database");

// =====================
// HALAMAN UTAMA
// =====================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM menfess ORDER BY created_at DESC"
    );
    res.render("index", { messages: rows });
  } catch (err) {
    console.error(err);
    res.render("index", { messages: [], error: "Database connection failed!" });
  }
});

// =====================
// HALAMAN CREATE
// =====================
router.get("/create", (req, res) => {
  res.render("create");
});

// =====================
// KIRIM MENFESS
// =====================
router.post("/send", async (req, res) => {
  const { sender, content, color } = req.body;
  if (!sender || !content) return res.redirect("/create");

  try {
    await db.query(
      "INSERT INTO menfess (sender, content, color, like_count, dislike_count) VALUES (?, ?, ?, 0, 0)",
      [sender, content, color]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/create");
  }
});

// LIKE
router.post("/like/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE menfess SET like_count = like_count + 1 WHERE id = ?",
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// DISLIKE
router.post("/dislike/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE menfess SET dislike_count = dislike_count + 1 WHERE id = ?",
      [id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


module.exports = router;
