# Coverage gap: app/api/v1/routes/posts.py has zero tests.
# Same pattern as test_auth_routes.py: TestClient + dependency_overrides on
# get_post_service and get_current_user, service logic itself is out of scope here.

import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.modules.posts.dependencies import get_post_service
from app.core.dependencies import get_current_user


@pytest.fixture
def mock_service():
    return MagicMock()


@pytest.fixture
def client(mock_service):
    app.dependency_overrides[get_post_service] = lambda: mock_service
    app.dependency_overrides[get_current_user] = lambda: "test-user-id"
    yield TestClient(app)
    app.dependency_overrides.clear()


class TestGetUploadUrl:
    def test_rejects_unsupported_content_type(self, client):
        # TODO: GET /v1/posts/upload-url?filename=x.txt&content_type=text/plain -> 400
        # (see ALLOWED_IMAGE_TYPES check in the route, this is validated in the route not the service)
        pass

    def test_accepts_supported_content_type(self, client, mock_service):
        pass


class TestCreatePost:
    def test_returns_201(self, client, mock_service):
        pass


class TestGetPost:
    def test_public_no_auth_required(self, client, mock_service):
        # TODO: GET /v1/posts/{id} has no get_current_user dependency - should work
        # even without overriding auth. Verify unauthenticated access succeeds.
        pass


class TestDeletePost:
    def test_returns_204(self, client, mock_service):
        pass

    def test_forbidden_when_not_owner(self, client, mock_service):
        # TODO: mock_service.delete.side_effect = HTTPException(403, "Not your post")
        pass


class TestLikeUnlike:
    def test_like_returns_204(self, client, mock_service):
        pass

    def test_unlike_returns_204(self, client, mock_service):
        pass


class TestComments:
    def test_add_comment_returns_201(self, client, mock_service):
        pass

    def test_get_comments_public(self, client, mock_service):
        pass
