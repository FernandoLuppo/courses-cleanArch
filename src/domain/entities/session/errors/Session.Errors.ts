export const SessionErrors = {
  REFRESH_TOKEN_NOT_FOUND: {
    code: "REFRESH_TOKEN_NOT_FOUND",
    message: "Refresh token not found"
  },
  SESSION_NOT_FOUND: {
    code: "SESSION_NOT_FOUND",
    message: "Session not found"
  },
  SESSION_REVOKED: {
    code: "SESSION_REVOKED",
    message: "Session revoked"
  },
  SESSION_EXPIRED: {
    code: "SESSION_EXPIRED",
    message: "Session expired"
  },
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "User not found"
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "Unauthorized"
  },
  TOO_MANY_ATTEMPTS: {
    code: "TOO_MANY_ATTEMPTS",
    message: "Too many attempts. Try again later."
  },
  DEFAULT: {
    code: "DEFAULT",
    message: "Default error"
  }
} as const

export type SessionError = (typeof SessionErrors)[keyof typeof SessionErrors]
