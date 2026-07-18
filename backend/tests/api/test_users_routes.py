# Coverage gap: app/api/v1/routes/users.py has zero tests.
#
# NOTE: unlike posts/auth routes, this route imports a module-level `follow_service`
# singleton directly (from app.modules.follows.service import follow_service),
# not through Depends(...). dependency_overrides won't reach it. You'll need
# unittest.mock.patch("app.api.v1.routes.users.follow_service") instead.
# TODO(design): consider raising this - refactoring follow_service behind a
# Depends() factory (like get_post_service/get_auth_service) would make it
# consistent with the other two routers and easier to test/override.

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user


@pytest.fixture
def client():
    app.dependency_overrides[get_current_user] = lambda: "test-user-id"
    yield TestClient(app)
    app.dependency_overrides.clear()


class TestFollowRoute:
    def test_returns_200(self, client):
        # TODO: with patch("app.api.v1.routes.users.follow_service") as mock_fs:
        #     mock_fs.follow.return_value = <FollowStatusResponse-shaped dict>
        #     POST /v1/users/{id}/follow, assert 200 + mock_fs.follow called with (test-user-id, id)
        pass


class TestUnfollowRoute:
    def test_returns_200(self, client):
        pass


class TestGetFollowing:
    def test_no_auth_required(self, client):
        # TODO: this route has no get_current_user dependency - confirm it's reachable unauthenticated
        pass


class TestGetFollowers:
    def test_no_auth_required(self, client):
        pass
