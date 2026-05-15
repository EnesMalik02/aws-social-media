from fastapi import HTTPException
from botocore.exceptions import ClientError
from app.infrastructure.dynamodb import user_repo, follow_repo
from app.modules.follows.schemas import FollowStatusResponse, FollowUserResponse


class FollowService:
    def __init__(self, user_repo, follow_repo):
        self.user_repo   = user_repo
        self.follow_repo = follow_repo

    def follow(self, follower_id: str, following_id: str) -> FollowStatusResponse:
        if follower_id == following_id:
            raise HTTPException(status_code=400, detail="You cannot follow yourself")

        # Check if user exists
        user = self.user_repo.get_user_by_id(following_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Try to follow — transaction will fail if already following
        try:
            self.follow_repo.follow_user(follower_id, following_id)
        except ClientError as e:
            if e.response["Error"]["Code"] == "TransactionCanceledException":
                raise HTTPException(status_code=409, detail="Already following")
            raise

        # Return updated follower count
        updated_user = self.user_repo.get_user_by_id(following_id)
        return FollowStatusResponse(
            following=True,
            followers_count=updated_user.get("followers_count", 0),
        )

    def unfollow(self, follower_id: str, following_id: str) -> FollowStatusResponse:
        if follower_id == following_id:
            raise HTTPException(status_code=400, detail="You cannot unfollow yourself")

        user = self.user_repo.get_user_by_id(following_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        try:
            self.follow_repo.unfollow_user(follower_id, following_id)
        except ClientError as e:
            if e.response["Error"]["Code"] == "TransactionCanceledException":
                raise HTTPException(status_code=409, detail="Not following")
            raise

        updated_user = self.user_repo.get_user_by_id(following_id)
        return FollowStatusResponse(
            following=False,
            followers_count=updated_user.get("followers_count", 0),
        )

    def get_following(self, user_id: str) -> list[FollowUserResponse]:
        """Get list of users that user_id follows."""
        records = self.follow_repo.get_following(user_id)
        result  = []
        for record in records:
            user = self.user_repo.get_user_by_id(record["following_id"])
            if user:
                result.append(FollowUserResponse(
                    user_id=user["user_id"],
                    username=user["username"],
                    avatar=user.get("avatar", ""),
                ))
        return result

    def get_followers(self, user_id: str) -> list[FollowUserResponse]:
        """Get list of users that follow user_id."""
        records = self.follow_repo.get_followers(user_id)
        result  = []
        for record in records:
            user = self.user_repo.get_user_by_id(record["follower_id"])
            if user:
                result.append(FollowUserResponse(
                    user_id=user["user_id"],
                    username=user["username"],
                    avatar=user.get("avatar", ""),
                ))
        return result


# Global instance
follow_service = FollowService(user_repo=user_repo, follow_repo=follow_repo)