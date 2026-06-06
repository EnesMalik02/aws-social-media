// types
export type { User, UserProfile } from "./model/types";

// query keys
export { userKeys } from "./lib/user-keys";

// read hooks
export { useMe, useUserProfile, useFollowers, useFollowing } from "./queries";

// auth store
export { useAuthStore } from "./store/auth-store";

// api — consumed by features for mutations
export {
  followUser,
  unfollowUser,
  fetchFollowers,
  fetchFollowing,
} from "./api/rest";
