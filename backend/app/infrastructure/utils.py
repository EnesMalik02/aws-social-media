# DynamoDB uses PK/SK/GSI keys for indexing internally.
# These keys are meaningless outside the infrastructure layer,
# so we strip them before returning data to services or GraphQL.
_INTERNAL_KEYS = {"PK", "SK", "GSI1PK", "GSI1SK", "GSI2PK", "GSI2SK"}


def clean(item: dict | None) -> dict | None:
    """Remove DynamoDB-specific keys from an item."""
    if item is None:
        return None
    return {k: v for k, v in item.items() if k not in _INTERNAL_KEYS}