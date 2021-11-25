import express from "express";
import bodyParser from "body-parser";

const articlesInfo = {
  "learn-react": {
    upvotes: 0,
    comments: [],
  },
  "learn-node": {
    upvotes: 0,
    comments: [],
  },
  "my-thoughts-on-resumes": {
    upvotes: 0,
    comments: [],
  },
};

const app = express();

app.use(bodyParser.json());

app.get("/hello", (req, res) =>
  res.send(
    "Hello, it's me.<br>I was wondering if after all these years you'd like to meet."
  )
);
app.get("/hello/:name", (req, res) =>
  res.send(`Hello ${req.params.name}. Nice to meet you.`)
);
app.post("/hello", (req, res) => res.send(`Hello ${req.body.name}`));

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
