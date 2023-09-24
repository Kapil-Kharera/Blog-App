require("dotenv").config();
const express = require("express");
const path = require("path");

const blogRoutes = require("./routes/blog.routes");

const app = express();

//activating ejs view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(blogRoutes);

app.use(function(err, req, res, next) {
    console.log("Error : ", err);
    res.status(500).render('500');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});