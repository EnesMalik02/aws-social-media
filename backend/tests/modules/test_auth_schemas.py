# Coverage gap: app/modules/auth/schemas.py custom field_validators have zero tests.
# These are pure pydantic validation rules -> fast to test, no mocking needed. Good warm-up file.

import pytest
from pydantic import ValidationError
from app.modules.auth.schemas import RegisterRequest


class TestUsernameValidation:
    def test_valid_username_lowercased(self):
        # TODO: RegisterRequest(username="TestUser", email="a@b.com", password="Test1234").username == "testuser"
        pass

    def test_too_short_rejected(self):
        # TODO: username="ab" (2 chars) -> pytest.raises(ValidationError)
        pass

    def test_too_long_rejected(self):
        # TODO: username of 31 chars -> ValidationError
        pass

    def test_special_characters_rejected(self):
        # TODO: username="test-user!" -> ValidationError (only alnum + underscore allowed)
        pass

    def test_underscore_allowed(self):
        # TODO: username="test_user" -> passes, stays "test_user"
        pass


class TestPasswordValidation:
    def test_too_short_rejected(self):
        # TODO: password="short1" (< 8 chars) -> ValidationError
        pass

    def test_min_length_accepted(self):
        # TODO: exactly 8 chars -> passes
        pass


class TestEmailValidation:
    def test_invalid_email_rejected(self):
        # TODO: email="not-an-email" -> ValidationError (EmailStr type)
        pass
