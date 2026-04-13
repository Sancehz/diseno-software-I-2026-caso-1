/**
 * Base application error.
 * All typed errors in the system extend this class.
 * The Logs layer captures these via Sentry before re-throwing.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Not authenticated") {
    super(message, "AUTH_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(permission: string) {
    super(`Missing permission: ${permission}`, "FORBIDDEN", 403);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 422);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, detail?: string) {
    super(`External service error: ${service}${detail ? ` — ${detail}` : ""}`, "EXTERNAL_ERROR", 502);
    this.name = "ExternalServiceError";
  }
}
