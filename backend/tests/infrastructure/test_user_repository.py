# Coverage gap: app/infrastructure/repositories/user_repository.py has zero tests.
#
# TODO(dependency): these tests need a fake DynamoDB table. Two options:
#   1. Add "moto" to [dependency-groups].dev in pyproject.toml and use
#      @mock_aws + boto3.resource("dynamodb").create_table(...) to spin up a real
#      in-memory table per test (best: exercises actual boto3 Key conditions).
#   2. Or pass a MagicMock() as `table` and assert on call args (faster, but
#      doesn't catch bugs in KeyConditionExpression construction).
# Prefer option 1 for repositories - moto catches wrong Key()/index-name bugs
# that a MagicMock will happily accept even when wrong.

import pytest
from app.infrastructure.repositories.user_repository import UserRepository


@pytest.fixture
def repo():
    # TODO: return UserRepository(table=<moto in-memory table with GSI1 + GSI2>)
    pass


class TestCreateUser:
    def test_returns_cleaned_item(self):
        # TODO: create_user(...) result should not contain PK/SK/GSI1PK/etc (see Keys.user/username_index/email_index)
        pass

    def test_stores_lowercased_username_and_email(self):
        # TODO: create_user with "TestUser"/"Test@Example.com", then get_user_by_username("testuser") should find it
        pass


class TestGetUserById:
    def test_found(self):
        pass

    def test_not_found_returns_none(self):
        pass


class TestGetUserByUsername:
    def test_found_via_gsi1(self):
        pass

    def test_not_found_returns_none(self):
        pass


class TestGetUserByEmail:
    def test_found_via_gsi2(self):
        pass

    def test_not_found_returns_none(self):
        pass


class TestUpdateUser:
    def test_updates_field(self):
        # TODO: update_user(user_id, {"bio": "new bio"}) -> Attributes reflect new bio
        pass

    def test_renaming_username_keeps_gsi1_in_sync(self):
        # TODO: this is the trickiest branch - update_user with {"username": "NewName"} must
        # also update GSI1PK, otherwise get_user_by_username("newname") would fail to find the user
        # while get_user_by_username(<old name>) would incorrectly still find them
        pass

    def test_renaming_email_keeps_gsi2_in_sync(self):
        pass
