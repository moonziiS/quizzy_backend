const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/categories", require("./routes/categories"));
app.use("/questions", require("./routes/questions"));
app.use("/attempts", require("./routes/attempts"));
app.use("/leaderboard", require("./routes/leaderboard"));
app.use("/profile", require("./routes/profile"));
app.use("/streak", require("./routes/streak"));
app.use("/attempts/history", require("./routes/attempt_history"));
app.use("/stats", require("./routes/stats"));
app.use("/badges", require("./routes/badges"));


// START SERVER
app.listen(process.env.PORT, () => {
    console.log("Backend running on port " + process.env.PORT);
});
