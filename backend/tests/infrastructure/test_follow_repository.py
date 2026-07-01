# Coverage gap: app/infrastructure/repositories/follow_repository.py has zero tests.
# Same moto note as test_user_repository.py.
# This one is worth prioritizing: follow_user/unfollow_user use multi-item
# transact_write_items with ConditionExpression guards - easy to get wrong silently.

import pytest
from app.infrastructure.repositories.follow_repository import FollowRepository


@pytest.fixture
def repo():
    # TODO: FollowRepository(table=<moto table>)
    pass


class TestFollowUser:
    def test_creates_follow_and_reverse_index(self):
        # TODO: follow_user(a, b) then get_follow(a, b) is not None,
        # and get_followers(b) / get_following(a) both include the pair
        pass

    def test_increments_both_counts(self):
        # TODO: follow_user(a, b) -> user a's following_count +1, user b's followers_count +1
        pass

    def test_duplicate_follow_raises(self):
        # TODO: follow_user(a, b) twice - ConditionExpression "attribute_not_exists(PK)..."
        # should raise ClientError on the second call
        pass


class TestUnfollowUser:
    def test_removes_follow_and_reverse_index(self):
        pass

    def test_decrements_both_counts(self):
        pass

    def test_unfollow_when_not_following_raises(self):
        # TODO: unfollow_user without a prior follow_user - ConditionExpression "attribute_exists(PK)..."
        # should raise ClientError
        pass

    def test_count_never_goes_negative(self):
        # TODO: exercise the "following_count > :zero" / "followers_count > :zero" guards directly
        pass


class TestGetFollowingGetFollowers:
    def test_respects_limit(self):
        pass

    def test_empty_lists_when_none(self):
        pass
