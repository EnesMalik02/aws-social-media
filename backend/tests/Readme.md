# Testing Guide

## Philosophy

We test the **service layer** — the business logic. Not the database, not HTTP, not AWS.

Each test follows this pattern:
1. **Mock** external dependencies (database, AWS)
2. **Call** the service function
3. **Assert** the result

```
Test → Service → (mocked) Repository
                    ↓
              Real DynamoDB never called
```

---

## Structure

```
tests/
├── __init__.py
└── modules/
    ├── __init__.py
    ├── test_auth_service.py
    └── test_post_service.py
```

Tests live in `tests/modules/` mirroring `app/modules/`.

---

## How Tests Are Written

### Fixtures

Reusable test data and objects defined with `@pytest.fixture`:

```python
@pytest.fixture
def mock_repo():
    return MagicMock()          # fake repository, no real DB

@pytest.fixture
def mock_user():
    return {"user_id": "123", "username": "enes", ...}

@pytest.fixture
def service(mock_repo):
    return AuthService(user_repo=mock_repo)  # inject mock
```

### Test Classes

Group related tests under a class:

```python
class TestRegister:
    def test_success(self, service, mock_repo, mock_user): ...
    def test_email_taken(self, service, mock_repo, mock_user): ...
    def test_username_taken(self, service, mock_repo, mock_user): ...
```

### Mocking

We use two mocking approaches:

**MagicMock** — for repository methods (DynamoDB calls):
```python
mock_repo.get_user_by_email.return_value = None     # simulate no user found
mock_repo.create_user.return_value = mock_user      # simulate successful create
```

**patch** — for utility functions (hashing, token generation):
```python
with patch("app.modules.auth.service.hash_password", return_value="hashed"):
    result = service.register(...)
```

### Asserting Errors

Use `pytest.raises` for expected exceptions:
```python
with pytest.raises(HTTPException) as exc:
    service.register(body_with_taken_email)

assert exc.value.status_code == 409
assert exc.value.detail == "Email already registered"
```

---

## Running Tests

### Basic

```bash
uv run pytest
```

### Verbose — see each test name

```bash
uv run pytest -v
```

### With print output

By default pytest captures stdout. Use `-s` to see prints:

```bash
uv run pytest -s
```

### Verbose + prints

```bash
uv run pytest -v -s
```

### Run a specific file

```bash
uv run pytest tests/modules/test_auth_service.py
```

### Run a specific class

```bash
uv run pytest tests/modules/test_auth_service.py::TestRegister
```

### Run a specific test

```bash
uv run pytest tests/modules/test_auth_service.py::TestRegister::test_success
```

### Stop on first failure

```bash
uv run pytest -x
```

### Show last failed tests only

```bash
uv run pytest --lf
```

---

## What to Test Per Module

Each service function should have at minimum:

| Case | Description |
|------|-------------|
| `test_success` | Happy path — everything works |
| `test_not_found` | Resource doesn't exist → 404 |
| `test_unauthorized` | No token or wrong user → 401/403 |
| `test_conflict` | Duplicate resource → 409 |

---

## What We Don't Test Here

- DynamoDB queries (tested separately as integration tests)
- HTTP layer / endpoints (tested with FastAPI `TestClient`)
- AWS services (mocked at repository level)