export const postKeys = {
  byUser:   (userId: string)  => ["posts", "user",     userId]  as const,
  comments: (postId: string)  => ["posts", "comments", postId]  as const,
  feed:     ()                => ["posts", "feed"]               as const,
  discover: ()                => ["posts", "discover"]           as const,
};
