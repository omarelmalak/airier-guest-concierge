"""Shared exceptions for worker services. Any service can raise these; routes translate to HTTP."""


class ServiceError(Exception):
    """Raised when a service wants to signal an HTTP-style error (4xx)."""

    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(message)
