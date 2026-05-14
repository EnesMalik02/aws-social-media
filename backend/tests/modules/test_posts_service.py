import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from app.modules.posts.schemas import CreatePostRequest
from app.modules.posts.service import PostService


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def mock_post():
    return {
        "post_id":    "5b533acd-ace4-4455-b10a-a39817942182",
        "user_id":    "acd75b16-592a-4982-b58e-c70d0619ded2",
        "caption":    "ilk post",
        "image_url":  "https://pixora-media-675715936315.s3.eu-central-1.amazonaws.com/posts/test.jpeg",
        "likes_count": 0,
        "created_at": "2026-05-12T13:15:02.462520+00:00",
    }


@pytest.fixture
def service(mock_repo):
    return PostService(post_repo=mock_repo)


# --- Create ---

class TestCreate:

    def test_success(self, service, mock_repo, mock_post):
        mock_repo.create_post.return_value = mock_post

        result = service.create(
            user_id="acd75b16-592a-4982-b58e-c70d0619ded2",
            body=CreatePostRequest(caption="ilk post", image_url=mock_post["image_url"]),
        )

        assert result.post_id == "5b533acd-ace4-4455-b10a-a39817942182"
        mock_repo.create_post.assert_called_once()


# --- Get Post ---

class TestGetPost:

    def test_success(self, service, mock_repo, mock_post):
        mock_repo.get_post_by_id.return_value = mock_post

        result = service.get_post("5b533acd-ace4-4455-b10a-a39817942182")

        assert result.post_id == "5b533acd-ace4-4455-b10a-a39817942182"
        assert result.user_id == "acd75b16-592a-4982-b58e-c70d0619ded2"
        assert result.caption == "ilk post"
        assert result.image_url == "https://pixora-media-675715936315.s3.eu-central-1.amazonaws.com/posts/test.jpeg"

    def test_not_found(self, service, mock_repo):
        mock_repo.get_post_by_id.return_value = None

        with pytest.raises(HTTPException) as exc:
            service.get_post("nonexistent")

        assert exc.value.status_code == 404


# --- Delete ---

class TestDelete:

    def test_success(self, service, mock_repo, mock_post):
        mock_repo.get_post_by_id.return_value = mock_post

        service.delete("5b533acd-ace4-4455-b10a-a39817942182", "acd75b16-592a-4982-b58e-c70d0619ded2")

        mock_repo.delete_post.assert_called_once()

    def test_not_owner(self, service, mock_repo, mock_post):
        mock_repo.get_post_by_id.return_value = mock_post

        with pytest.raises(HTTPException) as exc:
            service.delete("5b533acd-ace4-4455-b10a-a39817942182", "other-user-id")

        assert exc.value.status_code == 403

    def test_not_found(self, service, mock_repo):
        mock_repo.get_post_by_id.return_value = None

        with pytest.raises(HTTPException) as exc:
            service.delete("nonexistent", "acd75b16-592a-4982-b58e-c70d0619ded2")

        assert exc.value.status_code == 404


# --- Like / Unlike ---

class TestLike:

    def test_like_success(self, service, mock_repo, mock_post):
        mock_repo.get_post_by_id.return_value = mock_post
        mock_repo.is_liked.return_value = False

        service.like("5b533acd-ace4-4455-b10a-a39817942182", "user-1")

        mock_repo.like_post.assert_called_once()

    def test_already_liked(self, service, mock_repo, mock_post):
        mock_repo.get_post_by_id.return_value = mock_post
        mock_repo.is_liked.return_value = True

        with pytest.raises(HTTPException) as exc:
            service.like("5b533acd-ace4-4455-b10a-a39817942182", "user-1")

        assert exc.value.status_code == 409

    def test_unlike_success(self, service, mock_repo, mock_post):
        mock_repo.get_post_by_id.return_value = mock_post
        mock_repo.is_liked.return_value = True

        service.unlike("5b533acd-ace4-4455-b10a-a39817942182", "user-1")

        mock_repo.unlike_post.assert_called_once()

    def test_not_liked_yet(self, service, mock_repo, mock_post):
        mock_repo.get_post_by_id.return_value = mock_post
        mock_repo.is_liked.return_value = False

        with pytest.raises(HTTPException) as exc:
            service.unlike("5b533acd-ace4-4455-b10a-a39817942182", "user-1")

        assert exc.value.status_code == 409
