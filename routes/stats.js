const express = require("express");
const router = express.Router();
const db = require("../db");

// USER STATISTICS
router.get("/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    // 1. Total quiz played
    const [totalQuiz] = await db.query(
      `SELECT COUNT(*) AS total FROM quiz_attempts WHERE user_id = ?`,
      [userId]
    );

    // 2. Average score
    const [avgScore] = await db.query(
      `SELECT AVG(score) AS average_score 
       FROM quiz_attempts 
       WHERE user_id = ?`,
      [userId]
    );

    // 3. Total correct answers
    const [correct] = await db.query(
      `SELECT SUM(correct_count) AS total_correct,
              SUM(total_questions - correct_count) AS total_wrong
       FROM quiz_attempts
       WHERE user_id = ?`,
      [userId]
    );

    // 4. Fastest quiz
    const [fastest] = await db.query(
      `SELECT MIN(duration_seconds) AS fastest_time 
       FROM quiz_attempts 
       WHERE user_id = ?`,
      [userId]
    );

    // 5. Highest score
    const [highestScore] = await db.query(
      `SELECT MAX(score) AS highest_score
       FROM quiz_attempts 
       WHERE user_id = ?`,
      [userId]
    );

    // 6. Most played category
    const [mostPlayed] = await db.query(
      `SELECT c.name AS category_name, COUNT(*) AS times_played
       FROM quiz_attempts qa
       JOIN categories c ON c.id = qa.category_id
       WHERE qa.user_id = ?
       GROUP BY qa.category_id
       ORDER BY times_played DESC
       LIMIT 1`,
      [userId]
    );

    res.json({
      success: true,
      stats: {
        total_quiz: totalQuiz[0].total || 0,
        average_score: avgScore[0].average_score || 0,
        total_correct: correct[0].total_correct || 0,
        total_wrong: correct[0].total_wrong || 0,
        fastest_time: fastest[0].fastest_time || null,
        highest_score: highestScore[0].highest_score || 0,
        most_played_category: mostPlayed[0] || null
      }
    });

  } catch (err) {
    console.error("Stats API FAILED:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
