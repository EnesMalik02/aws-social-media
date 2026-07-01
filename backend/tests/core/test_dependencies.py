# Coverage gap: app/core/dependencies.py has zero tests.
# get_current_user / validate_token gate every protected route — this is the auth guard itself.

import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from app.core.dependencies import get_current_user, validate_token


def _fake_bearer_token(value: str):
    # HTTPBearer injects an HTTPAuthorizationCredentials-like object with a .credentials attr
    token = MagicMock()
    token.credentials = value
    return token


class TestGetCurrentUser:
    def test_valid_token_returns_user_id(self):
        # TODO: patch("app.core.dependencies.decode_token", return_value="user-123")
        # call get_current_user(_fake_bearer_token("whatever")) and assert result == "user-123"
        pass

    def test_invalid_token_raises_401(self):
        # TODO: patch decode_token to return None, assert HTTPException with status_code 401 is raised
        pass


class TestValidateToken:
    def test_valid_token_returns_user_id(self):
        # TODO: same pattern as get_current_user — currently duplicate logic, worth asking
        # "should these two functions actually be the same function?" once tests are written
        pass

    def test_invalid_token_raises_401(self):
        # TODO: patch decode_token to return None, assert 401
        pass
