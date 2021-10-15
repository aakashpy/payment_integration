const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json());
app.use("/payment", require("./routes/payment"));
app.get("/", (request, response) => {
    response.json({ message: "Server is working!!!!!!" });
});
app.listen(port, () => console.log(`server started on port ${port}`));