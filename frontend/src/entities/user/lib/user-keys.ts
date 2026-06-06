export const userKeys = {
  me:        ["user", "me"]                              as const,
  profile:   (username: string) => ["user", "profile",   username] as const,
  followers: (userId: string)   => ["user", "followers", userId]   as const,
  following: (userId: string)   => ["user", "following", userId]   as const,
};
