const mongoose = require("mongoose")
const express = require("express")
require("dotenv/config")
const userRoute = require("./Routes/userRoute")
const blogRoute = require("./Routes/blogRoute")
const cors = require("cors")

const app = express()

app.use(express.json())

app.use(cors({
    origin: "http://localhost:5173", // or "*" to allow all
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/api/user", userRoute)
app.use("/api/blog", blogRoute)

app.listen(process.env.PORT)

async function DB() {
    try {
        const res = await mongoose.connect(process.env.DB)
        const data = await res.STATES.connected
        console.log(data);

    } catch (error) {
        console.log(error.message);

    }
}
DB()