# Coverage gap: app/infrastructure/utils.py has zero tests.
# clean() is pure and trivial -> good first test to write yourself end-to-end.

from app.infrastructure.utils import clean


class TestClean:
    def test_removes_internal_keys(self):
        # TODO: build a dict containing PK, SK, GSI1PK, GSI1SK, GSI2PK, GSI2SK plus a real field
        # (e.g. "user_id": "abc") and assert clean() strips only the internal keys
        pass

    def test_none_returns_none(self):
        # TODO: clean(None) -> None
        pass

    def test_item_with_no_internal_keys_unchanged(self):
        # TODO: clean({"user_id": "abc"}) -> {"user_id": "abc"} (nothing to strip)
        pass
