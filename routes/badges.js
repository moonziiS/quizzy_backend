const express = require("express");
const router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid");

// GET: list badge user
router.get("/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;

        const [rows] = await db.query(
            `SELECT b.id, b.name, b.description, b.icon_url, ub.awarded_at
             FROM user_badges ub
             JOIN badges b ON b.id = ub.badge_id
             WHERE ub.user_id = ?`,
            [user_id]
        );

        res.json({ success: true, data: rows });
    } catch (err) {
        console.error("Badge fetch FAILED:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST: kasih badge ke user
router.post("/award", async (req, res) => {
    try {
        const { user_id, badge_id } = req.body;

        if (!user_id || !badge_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const awardId = uuidv4();

        await db.query(
            `INSERT INTO user_badges (id, user_id, badge_id)
             VALUES (?, ?, ?)`,
            [awardId, user_id, badge_id]
        );

        res.json({ success: true, message: "Badge awarded", award_id: awardId });
    } catch (err) {
        console.error("Badge award FAILED:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
