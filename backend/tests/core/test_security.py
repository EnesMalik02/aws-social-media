# Coverage gap: app/core/security.py has zero tests.
# Password hashing + JWT create/decode are the security backbone — bugs here are silent auth bypasses.

import pytest
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


class TestHashPassword:
    def test_hash_is_not_plaintext(self):
        # TODO: hash_password("secret") should not equal "secret", and should not be empty
        pass

    def test_same_password_different_hash(self):
        # TODO: bcrypt salts each hash — hash_password("secret") called twice must give two different strings
        pass


class TestVerifyPassword:
    def test_correct_password_returns_true(self):
        # TODO: hash a password, then verify_password(plain, hash) -> True
        pass

    def test_wrong_password_returns_false(self):
        # TODO: verify_password("wrong", hash_of("right")) -> False
        pass


class TestAccessToken:
    def test_create_and_decode_roundtrip(self):
        # TODO: create_access_token("user-123") then decode_token(token) should return "user-123"
        pass

    def test_decode_invalid_token_returns_none(self):
        # TODO: decode_token("not-a-real-jwt") should return None (see except JWTError branch)
        pass

    def test_decode_expired_token_returns_none(self):
        # TODO: freeze/mock settings.JWT_EXPIRE_MINUTES negative, or manually craft an expired jwt.encode()
        # payload with exp in the past, assert decode_token returns None
        pass


class TestRefreshToken:
    def test_has_unique_jti(self):
        # TODO: create_refresh_token("user-123") twice, decode both with jose.jwt.decode directly
        # (bypassing decode_token, since it only returns "sub") and assert the two "jti" values differ
        pass
