const express = require("express");
const router = express.Router();
const db = require("../db");

// GET questions by category_id
router.get("/:categoryId", async (req, res) => {
    const { categoryId } = req.params;

    try {
        const [questions] = await db.query(
            "SELECT * FROM questions WHERE category_id = ?",
            [categoryId]
        );

        // Ambil choices-nya sekalian
        for (let q of questions) {
            const [choices] = await db.query(
                "SELECT id, choice_text, is_correct FROM choices WHERE question_id = ?",
                [q.id]
            );
            q.choices = choices;
        }

        res.json(questions);

    } catch (err) {
        console.error("Error getting questions:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
