import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from app.modules.auth.schemas import RegisterRequest, LoginRequest
from app.modules.auth.service import AuthService


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def mock_user():
    return {
        "user_id":  "test-id-123",
        "username": "enes",
        "email":    "test@test.com",
        "password": "hashed_password",
        "bio":      "",
        "avatar":   "",
    }


@pytest.fixture
def service(mock_repo):
    return AuthService(user_repo=mock_repo)


# --- Register ---

class TestRegister:

    def test_success(self, service, mock_repo, mock_user):
        mock_repo.get_user_by_email.return_value = None
        mock_repo.get_user_by_username.return_value = None
        mock_repo.create_user.return_value = mock_user

        with patch("app.modules.auth.service.hash_password", return_value="hashed"), \
             patch("app.modules.auth.service.create_access_token", return_value="access"), \
             patch("app.modules.auth.service.create_refresh_token", return_value="refresh"):

            result = service.register(RegisterRequest(
                username="enes",
                email="test@test.com",
                password="Test1234",
            ))

        assert result.user.username == "enes"
        assert result.token.access_token == "access"

    def test_email_taken(self, service, mock_repo, mock_user):
        mock_repo.get_user_by_email.return_value = mock_user

        with pytest.raises(HTTPException) as exc:
            service.register(RegisterRequest(
                username="enes",
                email="test@test.com",
                password="Test1234",
            ))

        assert exc.value.status_code == 409
        assert exc.value.detail == "Email already registered"

    def test_username_taken(self, service, mock_repo, mock_user):
        mock_repo.get_user_by_email.return_value = None
        mock_repo.get_user_by_username.return_value = mock_user

        with pytest.raises(HTTPException) as exc:
            service.register(RegisterRequest(
                username="enes",
                email="test@test.com",
                password="Test1234",
            ))

        assert exc.value.status_code == 409
        assert exc.value.detail == "Username already taken"


# --- Login ---

class TestLogin:

    def test_success(self, service, mock_repo, mock_user):
        mock_repo.get_user_by_email.return_value = mock_user

        with patch("app.modules.auth.service.verify_password", return_value=True), \
             patch("app.modules.auth.service.create_access_token", return_value="access"), \
             patch("app.modules.auth.service.create_refresh_token", return_value="refresh"):

            result = service.login(LoginRequest(
                email="test@test.com",
                password="Test1234",
            ))

        assert result.token.access_token == "access"

    def test_wrong_email(self, service, mock_repo):
        mock_repo.get_user_by_email.return_value = None

        with pytest.raises(HTTPException) as exc:
            service.login(LoginRequest(
                email="wrong@test.com",
                password="Test1234",
            ))

        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid email or password"

    def test_wrong_password(self, service, mock_repo, mock_user):
        mock_repo.get_user_by_email.return_value = mock_user

        with patch("app.modules.auth.service.verify_password", return_value=False):
            with pytest.raises(HTTPException) as exc:
                service.login(LoginRequest(
                    email="test@test.com",
                    password="WrongPass",
                ))

        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid email or password"


# --- Get Me ---

class TestGetMe:

    def test_success(self, service, mock_repo, mock_user):
        mock_repo.get_user_by_id.return_value = mock_user

        result = service.get_me("test-id-123")

        assert result.user_id == "test-id-123"
        assert result.username == "enes"
        assert result.email == "test@test.com"

    def test_not_found(self, service, mock_repo):
        mock_repo.get_user_by_id.return_value = None

        with pytest.raises(HTTPException) as exc:
            service.get_me("nonexistent-id")

        assert exc.value.status_code == 404


# TODO: TestRefreshToken
