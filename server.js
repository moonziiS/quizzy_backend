const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES – HARUS DI ATAS app.listen
app.use("/categories", require("./routes/categories"));
app.use("/questions", require("./routes/questions"));
app.use("/attempts", require("./routes/attempts"));

app.listen(process.env.PORT, () => {
    console.log("Backend running on port " + process.env.PORT);
});
