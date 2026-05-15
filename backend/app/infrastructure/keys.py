class Keys:
    """
    DynamoDB key builders — single source of truth for all key patterns.
    All keys follow the pattern: ENTITY_TYPE#id
    """

    # ── User ──────────────────────────────────────────────────────────

    @staticmethod
    def user(user_id: str) -> dict:
        """Primary key for user profile."""
        return {"PK": f"USER#{user_id}", "SK": "PROFILE"}

    @staticmethod
    def username_index(username: str) -> dict:
        """GSI1 key — query user by username."""
        return {"GSI1PK": f"USERNAME#{username.lower()}", "GSI1SK": "PROFILE"}

    @staticmethod
    def email_index(email: str) -> dict:
        """GSI2 key — query user by email."""
        return {"GSI2PK": f"EMAIL#{email.lower()}", "GSI2SK": "PROFILE"}

    # ── Post ──────────────────────────────────────────────────────────

    @staticmethod
    def post(post_id: str) -> dict:
        """Primary key for post metadata."""
        return {"PK": f"POST#{post_id}", "SK": "META"}

    @staticmethod
    def user_post(user_id: str, created_at: str, post_id: str) -> dict:
        """
        Key for listing a user's posts.
        SK includes timestamp so posts are sorted by date automatically.
        """
        return {
            "PK": f"USER#{user_id}",
            "SK": f"POST#{created_at}#{post_id}",
        }

    # ── Like ──────────────────────────────────────────────────────────

    @staticmethod
    def like(post_id: str, user_id: str) -> dict:
        """
        Key for a like record.
        Exists = liked. Does not exist = not liked.
        """
        return {"PK": f"POST#{post_id}", "SK": f"LIKE#{user_id}"}

    # ── Comment ───────────────────────────────────────────────────────

    @staticmethod
    def comment(post_id: str, created_at: str, comment_id: str) -> dict:
        """
        Key for a comment record.
        SK includes timestamp so comments are sorted by date automatically.
        """
        return {
            "PK": f"POST#{post_id}",
            "SK": f"COMMENT#{created_at}#{comment_id}",
        }

    @staticmethod
    def following(follower_id: str, following_id: str) -> dict:
        """Key for 'follower_id follows following_id' record."""
        return {
            "PK": f"USER#{follower_id}",
            "SK": f"FOLLOWING#{following_id}",
        }

    @staticmethod
    def follower(following_id: str, follower_id: str) -> dict:
        """Key for reverse index — who follows following_id."""
        return {
            "PK": f"USER#{following_id}",
            "SK": f"FOLLOWER#{follower_id}",
        }