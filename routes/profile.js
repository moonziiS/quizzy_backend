const express = require("express");
const router = express.Router();
const db = require("../db");

// GET PROFILE BY USER ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const [rows] = await db.query(
      `SELECT 
          id,
          username,
          xp,
          streak
       FROM profiles
       WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error("Profile fetch FAILED:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
