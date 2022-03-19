import Snoowrap from "snoowrap";

export default async function getPosts(subredditName: string, r: Snoowrap) {
  const posts = await r.getSubreddit("all").getHot({ limit: 100 });

  const filteredPosts = posts.filter(
    (post) =>
      post.subreddit.display_name.toLowerCase() === subredditName.toLowerCase()
  );

  return filteredPosts.map((post) => ({
    ...post,
    rank: posts.findIndex(({ id }) => post.id === id),
  }));
}
