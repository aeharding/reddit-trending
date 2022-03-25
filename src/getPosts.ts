import Snoowrap from "snoowrap";
import memoizee from "memoizee";
import { snoowrap } from ".";

export default async function getPosts(subredditName: string, limit: number) {
  const posts = await getAllPosts();

  const filteredPosts = posts
    .slice(0, limit)
    .filter(
      (post) =>
        post.subreddit.display_name.toLowerCase() ===
        subredditName.toLowerCase()
    );

  return filteredPosts.map((post) => ({
    ...post,
    rank: posts.findIndex(({ id }) => post.id === id),
  }));
}

const getAllPosts = memoizee(
  () => {
    return snoowrap.getSubreddit("all").getHot({ limit: 100 });
  },
  { maxAge: 1000 * 60 * 4 } // Slack RSS refreshes every 5 mins
);
