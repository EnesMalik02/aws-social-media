# app/infrastructure/keys.py

class Keys:
    """DynamoDB key builders — single source of truth for all key patterns."""

    # Primary keys
    @staticmethod
    def user(user_id: str) -> dict:
        return {"PK": f"USER#{user_id}", "SK": "PROFILE"}

    @staticmethod
    def post(post_id: str) -> dict:
        return {"PK": f"POST#{post_id}", "SK": "META"}

    @staticmethod
    def follow(follower_id: str, following_id: str) -> dict:
        return {"PK": f"USER#{follower_id}", "SK": f"FOLLOW#{following_id}"}

    @staticmethod
    def like(user_id: str, post_id: str) -> dict:
        return {"PK": f"POST#{post_id}", "SK": f"LIKE#{user_id}"}

    # GSI keys
    @staticmethod
    def username_index(username: str) -> dict:
        return {"GSI1PK": f"USERNAME#{username.lower()}", "GSI1SK": "PROFILE"}

    @staticmethod
    def email_index(email: str) -> dict:
        return {"GSI2PK": f"EMAIL#{email.lower()}", "GSI2SK": "PROFILE"}