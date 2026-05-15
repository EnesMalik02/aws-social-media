import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from app.modules.follows.schemas import FollowUserResponse, FollowStatusResponse
from app.modules.follows.service import FollowService

@pytest.fixture
def mock_user():
    return {
        "user_id":        "following-id",
        "username":       "ali",
        "email":          "ali@test.com",
        "password":       "hashed",
        "bio":            "",
        "avatar":         "",
        "followers_count": 5,
        "following_count": 3,
    }

@pytest.fixture
def mock_user_repo():
    return MagicMock()

@pytest.fixture
def mock_follow_repo():
    return MagicMock()

@pytest.fixture
def service(mock_user_repo, mock_follow_repo):
    return FollowService(user_repo=mock_user_repo, follow_repo=mock_follow_repo)

class TestFollow:
    def test_success(self, service, mock_user_repo, mock_follow_repo, mock_user):
        # Mock'ları ayarla
        mock_user_repo.get_user_by_id.return_value = mock_user
        mock_follow_repo.follow_user.return_value = None

        # Çalıştır
        result = service.follow("follower-id", "following-id")

        # Assert
        assert result.following == True
        assert result.followers_count == mock_user.get("followers_count", 0)
        
        # follow_user gerçekten çağrıldı mı?
        mock_follow_repo.follow_user.assert_called_once_with("follower-id", "following-id")


#TODO
class TestUnfollow:
    pass

#TODO
class TestFollowStatus:
    pass