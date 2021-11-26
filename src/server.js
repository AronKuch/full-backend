import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

app.use(bodyParser.json());

app.get("/api/articles/:name", async (req, res) => {
  try {
    let articleName = req.params.name;
    const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
    let db = client.db("back-blog");
    let articlesInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(articlesInfo);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to db ", error });
  }
});

app.post("/api/articles/:name/upvote", (req, res) => {
  let articleName = req.params.name;

  articlesInfo[articleName].upvotes += 1;
  res
    .status(200)
    .send(
      `${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`
    );
});

app.post("/api/articles/:name/comments", (req, res) => {
  let articleName = req.params.name;
  let comment = req.body.comment;

  articlesInfo[articleName].comments.push(comment);
  res.status(200).send(`Your comment on ${articleName} has been logged.`);
});

app.listen(7001, () => console.log("Listening on port 7001"));
