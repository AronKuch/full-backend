import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

const useDB = async (operations, res) => {
  try {
    const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
    const db = client.db("back-blog");
    await operations(db);
    client.close;
  } catch (error) {
    res.status(500).json({ message: "Error. Good luck! Message: ", error });
  }
};

app.use(bodyParser.json());

app.get("/api/articles/:name", async (req, res) => {
  useDB(async (db) => {
    let articleName = req.params.name;
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(articleInfo);
  }, res);
});

app.post("/api/articles/:name/upvote", async (req, res) => {
  useDB(async (db) => {
    let articleName = req.params.name;
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    await db
      .collection("articles")
      .updateOne(
        { _id: articleInfo._id },
        { $set: { upvotes: ++articleInfo.upvotes } }
      );
    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res
      .status(200)
      .send(
        `${updatedArticleInfo.name} now has ${updatedArticleInfo.upvotes} upvotes!`
      );
  }, res);
});

app.post("/api/articles/:name/comment", (req, res) => {
  useDB(async (db) => {
    let articleName = req.params.name;
    let { username, comment } = req.body;
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    articleInfo.comments.push({ username, comment });
    await db
      .collection("articles")
      .updateOne(
        { _id: articleInfo._id },
        { $set: { comments: articleInfo.comments } }
      );
    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });

    res.status(200).json(updatedArticleInfo);
  }, res);
});

app.listen(7001, () => console.log("Listening on port 7001"));
