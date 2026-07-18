# Coverage gap: app/api/v1/routes/auth.py has zero tests.
# Unlike test_auth_service.py (unit tests the service logic), these are integration
# tests: real HTTP requests through FastAPI's TestClient, service layer mocked out
# via app.dependency_overrides so no real DynamoDB/JWT call happens.
#
# Pattern: override get_auth_service to return a MagicMock, then assert on
# status codes + response bodies + that the mock was called with the right args.

import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from fastapi import HTTPException

from app.main import app
from app.modules.auth.dependencies import get_auth_service
from app.modules.auth.schemas import LoginResponse, RegisterResponse, UserResponse, TokenResponse


@pytest.fixture
def mock_service():
    return MagicMock()


@pytest.fixture
def client(mock_service):
    app.dependency_overrides[get_auth_service] = lambda: mock_service
    yield TestClient(app)
    app.dependency_overrides.clear()


class TestRegisterRoute:
    def test_valid_body_returns_201(self, client, mock_service):
        mock_service.register.return_value = RegisterResponse(
            user=UserResponse(user_id="u1", username="enes", email="test@test.com"),
            token=TokenResponse(access_token="access", refresh_token="refresh"),
        )

        response = client.post("/v1/auth/register", json={
            "username": "enes",
            "email": "test@test.com",
            "password": "Test1234",
        })

        assert response.status_code == 201
        assert response.json()["user"]["username"] == "enes"
        mock_service.register.assert_called_once()

    def test_invalid_body_returns_422(self, client):
        response = client.post("/v1/auth/register", json={
            "username": "enes",
            "password": "Test1234",
        })

        assert response.status_code == 422


class TestLoginRoute:
    def test_valid_credentials_returns_200(self, client, mock_service):
        mock_service.login.return_value = LoginResponse(
            user=UserResponse(user_id="u1", username="enes", email="test@test.com"),
            token=TokenResponse(access_token="access", refresh_token="refresh"),
        )

        response = client.post("/v1/auth/login", json={
            "email": "test@test.com",
            "password": "Test1234",
        })

        assert response.status_code == 200
        assert response.json()["user"]["username"] == "enes"
        mock_service.login.assert_called_once()

    def test_service_raises_401_propagates(self, client, mock_service):
        mock_service.login.side_effect = HTTPException(status_code=401, detail="Invalid email or password")
        
        response = client.post("/v1/auth/login", json={
            "email": "test@test.co",
            "password": "Test1234",
        })

        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid email or password"


class TestMeRoute:
    def test_requires_bearer_token(self, client):
        # TODO: GET /v1/auth/me with no Authorization header -> 401/403 (HTTPBearer rejects it)
        pass

    def test_valid_token_returns_user(self, client, mock_service):
        # TODO: also override get_current_user (imported in app.core.dependencies) to bypass
        # real JWT decoding, then assert mock_service.get_me was called with that user id
        pass


class TestRefreshRoute:
    def test_valid_token_returns_new_tokens(self, client, mock_service):
        pass
