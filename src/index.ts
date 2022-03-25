import cron from "node-cron";
import Snoowrap from "snoowrap";
import getPosts from "./getPosts";
import RSS from "rss";
import express from "express";

export const snoowrap = new Snoowrap({
  userAgent: "trending-slackbot",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});

const app = express();
const port = process.env.PORT || 3000;

app.get("/trending/:subreddit", async (req, res) => {
  const limit = Math.min(100, +(req.query.limit || 100) || 100);
  const feed = new RSS({
    title: `r/all top ${limit} posts from r/${req.params.subreddit}`,
    feed_url: "localhost",
    site_url: "https://reddit.com",
  });

  const posts = await getPosts(req.params.subreddit, limit);
  posts.forEach((post) => {
    feed.item({
      url: `https://reddit.com${post.permalink}`,
      title: post.title,
      description: [
        req.query.beforeText,
        `Currently #${post.rank} on r/all`,
        req.query.afterText,
      ]
        .filter((p) => p)
        .join(" "),
      date: new Date(post.created_utc * 1000),
    });
  });

  res.send(feed.xml());
});

app.listen(port, () => {
  console.log(`reddit-trending listening on port ${port}`);
});
