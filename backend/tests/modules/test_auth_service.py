import pytest
from unittest.mock import patch
from fastapi import HTTPException

from app.modules.auth.schemas import RegisterRequest, LoginRequest
from app.modules.auth import service as auth_service


# --- Fixtures ---

@pytest.fixture
def mock_user():
    """Fake user as it would come from DynamoDB."""
    return {
        "user_id":  "test-id-123",
        "username": "enes",
        "email":    "test@test.com",
        "password": "hashed_password",
        "bio":      "",
        "avatar":   "",
    }


# --- Register ---

class TestRegister:

    @patch("app.modules.auth.service.get_user_by_email", return_value=None)
    @patch("app.modules.auth.service.get_user_by_username", return_value=None)
    @patch("app.modules.auth.service.create_user")
    @patch("app.modules.auth.service.hash_password", return_value="hashed")
    @patch("app.modules.auth.service.create_access_token", return_value="token")
    def test_success(self, _, __, mock_create, ___, ____, mock_user):
        mock_create.return_value = mock_user

        result = auth_service.register(RegisterRequest(
            username="enes",
            email="test@test.com",
            password="Test1234",
        ))

        assert result.user.username == "enes"
        assert result.token.access_token == "token"

    @patch("app.modules.auth.service.get_user_by_email")
    def test_email_taken(self, mock_by_email, mock_user):
        mock_by_email.return_value = mock_user

        with pytest.raises(HTTPException) as exc:
            auth_service.register(RegisterRequest(
                username="enes",
                email="test@test.com",
                password="Test1234",
            ))

        assert exc.value.status_code == 409

    @patch("app.modules.auth.service.get_user_by_email", return_value=None)
    @patch("app.modules.auth.service.get_user_by_username")
    def test_username_taken(self, mock_by_username, _, mock_user):
        mock_by_username.return_value = mock_user

        with pytest.raises(HTTPException) as exc:
            auth_service.register(RegisterRequest(
                username="enes",
                email="test@test.com",
                password="Test1234",
            ))

        assert exc.value.status_code == 409


# --- Login ---

class TestLogin:

    @patch("app.modules.auth.service.get_user_by_email")
    @patch("app.modules.auth.service.verify_password", return_value=True)
    @patch("app.modules.auth.service.create_access_token", return_value="token")
    def test_success(self, _, __, mock_by_email, mock_user):
        mock_by_email.return_value = mock_user

        result = auth_service.login(LoginRequest(
            email="test@test.com",
            password="Test1234",
        ))

        assert result.token.access_token == "token"

    @patch("app.modules.auth.service.get_user_by_email", return_value=None)
    def test_wrong_email(self, _):
        with pytest.raises(HTTPException) as exc:
            auth_service.login(LoginRequest(
                email="wrong@test.com",
                password="Test1234",
            ))

        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid email or password"

    @patch("app.modules.auth.service.get_user_by_email")
    @patch("app.modules.auth.service.verify_password", return_value=False)
    def test_wrong_password(self, _, mock_by_email, mock_user):
        mock_by_email.return_value = mock_user

        with pytest.raises(HTTPException) as exc:
            auth_service.login(LoginRequest(
                email="test@test.com",
                password="WrongPass",
            ))

        assert exc.value.status_code == 401
        assert exc.value.detail == "Invalid email or password"


# --- Get Me ---

class TestGetMe:
    
    @patch("app.modules.auth.service.get_user_by_id")
    def test_success(self, mock_by_id, mock_user):
        mock_by_id.return_value = mock_user

        result = auth_service.get_me("test-id-123")

        assert result.user_id == "test-id-123"
        assert result.username == "enes"
        assert result.email == "test@test.com"
    
