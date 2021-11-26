import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();

// returns {client, db, articleInfo}
// client so that you can later client.close()
// db to make updates/inserts, etc.
// articleInfo is a JSON of the article
// This might go away because I don't know how much it helps.
const getArticle = async (articleName) => {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  const db = client.db("back-blog");
  const articleInfo = await db
    .collection("articles")
    .findOne({ name: articleName });
  return { client, db, articleInfo };
};

app.use(bodyParser.json());

app.get("/api/articles/:name", async (req, res) => {
  try {
    let articleName = req.params.name;
    let { client, db, articleInfo } = await getArticle(articleName);
    res.status(200).json(articleInfo);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to db ", error });
  }
});

app.post("/api/articles/:name/upvote", async (req, res) => {
  let articleName = req.params.name;
  let { client, db, articleInfo } = await getArticle(articleName);
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
  ("");
});

app.post("/api/articles/:name/comments", (req, res) => {
  let articleName = req.params.name;
  let comment = req.body.comment;

  articlesInfo[articleName].comments.push(comment);
  res.status(200).send(`Your comment on ${articleName} has been logged.`);
});

app.listen(7001, () => console.log("Listening on port 7001"));
