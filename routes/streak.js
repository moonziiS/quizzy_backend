const express = require("express");
const router = express.Router();
const db = require("../db");

// TEST ROUTE
router.get("/test", (req, res) => {
    res.send("STREAK ROUTE LOADED!");
});

// UPDATE STREAK
router.post("/:id/update", async (req, res) => {
    try {
        const userId = req.params.id;

        // Ambil profile
        const [rows] = await db.query(
            `SELECT streak, last_active FROM profiles WHERE id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        let { streak, last_active } = rows[0];

        const today = new Date();
        const last = last_active ? new Date(last_active) : null;

        let newStreak = streak;

        if (!last) newStreak = 1; 
        else {
            const diff = Math.floor((today - last) / (1000 * 60 * 60 * 24));

            if (diff === 1) newStreak = streak + 1;
            else if (diff > 1) newStreak = 1;
        }

        const xpBonus = 2;

        await db.query(
            `UPDATE profiles 
             SET streak = ?, xp = xp + ?, last_active = ? 
             WHERE id = ?`,
            [newStreak, xpBonus, today, userId]
        );

        res.json({
            success: true,
            message: "Streak updated.",
            newStreak,
            xpBonus
        });

    } catch (err) {
        console.error("Streak update FAILED:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
