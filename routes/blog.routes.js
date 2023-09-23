const express = require("express");
const db = require("../data/database");

const router = express.Router();

router.get("/", async function(req, res) {

    res.redirect("/posts");
});

router.get("/posts", async function(req, res) {
    const query = `
        select posts.*, authors.name as author_name from posts
         inner join authors on posts.author_id = authors.id
    `;
    const [ posts ] = await db.query(query);
    res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function(req, res) {
    const [ authors ] = await db.query("select * from authors");
    res.render("create-post", { authors: authors });
});

router.post("/posts", async function(req, res) {
    const { title, summary, content, author } = req.body;
    const data = [title, summary, content, author];

    await db.query('insert into posts (title, summary, body, author_id) values (?)', [data]);

    res.redirect("/posts");
});

router.get("/posts/:id", async function(req, res) {
    const { id } = req.params;
    const query = `select posts.*, authors.name as author_name, authors.email as author_email from posts
     inner join authors on posts.author_id = authors.id where posts.id = ?`;
    const [ posts ] = await db.query(query, [id]);

    if(!posts || posts.length === 0) {
        return res.status(404).render("404");
    }

    const post = {
        ...posts[0],
        machineReadableDate: posts[0].date.toISOString(),
        humanReadableDate: posts[0].date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    res.render("post-detail", { post: post });
});

router.get("/posts/:id/edit", async function(req, res) {
    const { id } = req.params;
    const query = `select * from posts where posts.id = ?`;
    const [posts] = await db.query(query, [id]);
    res.render("update-post", { post: posts[0]});
});

router.post("/posts/:id/edit", async function(req, res) {
    console.log("Hello");
    const { id } = req.params;
    const { title, summary, content } = req.body;
    const query = `update posts set title = ?, summary = ?, body = ? where id = ?`;
    await db.query(query, [title, summary, content, id]);

    res.redirect("/posts");
})


module.exports = router;