const express = require("express");
const router = express.Router();
const db = require("../db");

// GET LEADERBOARD (XP TERTINGGI)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          id,
          username,
          xp,
          streak
        FROM profiles
        ORDER BY xp DESC
        LIMIT 20`
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("Leaderboard FAILED:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
