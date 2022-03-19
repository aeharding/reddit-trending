import cron from "node-cron";
import Snoowrap from "snoowrap";
import getPosts from "./getPosts";
import RSS from "rss";
import express from "express";
import apicache from "apicache";

const snoowrap = new Snoowrap({
  userAgent: "trending-slackbot",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});

const app = express();
const port = process.env.PORT || 3000;
let cache = apicache.middleware;

app.get("/trending/:subreddit", cache("5 minutes"), async (req, res) => {
  const feed = new RSS({
    title: `r/all top 100 posts from r/${req.params.subreddit}`,
    feed_url: "localhost",
    site_url: "https://reddit.com",
  });

  const posts = await getPosts(req.params.subreddit, snoowrap);
  posts.forEach((post) => {
    feed.item({
      url: `https://reddit.com${post.permalink}`,
      title: post.title,
      description: `Currently #${post.rank} on r/all`,
      date: new Date(post.created_utc * 1000),
    });
  });

  res.send(feed.xml());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
