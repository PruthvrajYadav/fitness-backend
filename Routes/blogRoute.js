const { getBlog, postBlog, putBlog, deleteBlog } = require("../Controller/blogController")
const auth = require("../Middleware/auth")

const route = require("express").Router()

route.get("/", getBlog)
route.post("/", auth, postBlog)
route.put("/:id", auth, putBlog)
route.delete("/:id", auth, deleteBlog)

module.exports = route