const express = require("express");
const router = express.Router();
const db = require("../db");

// GET ATTEMPT HISTORY FOR A USER
router.get("/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    const [rows] = await db.query(
      `SELECT 
          qa.id,
          qa.category_id,
          c.name AS category_name,
          qa.score,
          qa.correct_count,
          qa.total_questions,
          qa.duration_seconds,
          qa.finished_at
       FROM quiz_attempts qa
       JOIN categories c ON c.id = qa.category_id
       WHERE qa.user_id = ?
       ORDER BY qa.finished_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      total: rows.length,
      history: rows
    });

  } catch (error) {
    console.error("Attempt history FAILED:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
