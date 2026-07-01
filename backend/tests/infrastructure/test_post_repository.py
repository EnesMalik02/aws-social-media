# Coverage gap: app/infrastructure/repositories/post_repository.py has zero tests.
# Same moto note as test_user_repository.py - do that setup first, then come back here.

import pytest
from app.infrastructure.repositories.post_repository import PostRepository


@pytest.fixture
def repo():
    # TODO: PostRepository(table=<moto table with GSI3 for discover index>)
    pass


class TestCreatePost:
    def test_writes_both_post_and_user_post_items(self):
        # TODO: create_post(...) then verify get_post_by_id(post_id) AND get_user_posts(user_id)
        # both return the same post - it's written twice (transact_write_items) by design
        pass


class TestGetUserPosts:
    def test_returns_posts_newest_first(self):
        # TODO: create 3 posts for same user, assert get_user_posts returns them ScanIndexForward=False order
        pass

    def test_empty_when_no_posts(self):
        pass


class TestLikeUnlike:
    def test_like_increments_likes_count(self):
        # TODO: create_post, like_post, then get_post_by_id(...)["likes_count"] == 1
        pass

    def test_unlike_decrements_likes_count(self):
        pass

    def test_unlike_below_zero_raises(self):
        # TODO: unlike_post on a post with likes_count == 0 - ConditionExpression "likes_count > :zero"
        # should raise botocore.exceptions.ClientError (ConditionalCheckFailedException)
        pass

    def test_is_liked_true_and_false(self):
        pass

    def test_batch_is_liked(self):
        # TODO: like 2 of 3 posts for a user, batch_is_liked(all_3_ids, user_id) should map
        # the liked ones to True and the third to False
        pass


class TestComments:
    def test_add_comment_then_get_comments_in_order(self):
        # TODO: add 2 comments, get_comments should return oldest first (ScanIndexForward=True)
        pass


class TestGetDiscoverPosts:
    def test_pagination_has_more_flag(self):
        # TODO: create more posts than `limit`, first page has_more == True and returns a last_evaluated_key,
        # passing that key back in should fetch the next page
        pass
