import { ORPCError } from "@orpc/server";

const statusByCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL: 500,
} as const;

type ErrorCode = keyof typeof statusByCode;

export type ErrorEnvelope = {
  error: {
    code: ErrorCode;
    subcode: string;
    message: string;
    details: Record<string, unknown>;
    retryable: boolean;
    requestId: string;
  };
};

function normalizeCode(error: unknown): ErrorCode {
  if (error instanceof ORPCError && error.code in statusByCode) {
    return error.code as ErrorCode;
  }

  return "INTERNAL";
}

function pickAllowedDetails(details: unknown) {
  if (!details || typeof details !== "object") {
    return {};
  }

  const source = details as Record<string, unknown>;
  const allowed: Record<string, unknown> = {};

  for (const key of ["subcode", "field"]) {
    if (key in source) {
      allowed[key] = source[key];
    }
  }

  return allowed;
}

export function mapErrorCodeToStatus(code: ErrorCode) {
  return statusByCode[code];
}

export function mapErrorToEnvelope(error: unknown, requestId: string): ErrorEnvelope {
  const code = normalizeCode(error);
  const details = error instanceof ORPCError ? pickAllowedDetails(error.data) : {};

  return {
    error: {
      code,
      subcode: typeof details.subcode === "string" ? details.subcode : code,
      message: error instanceof Error ? error.message : "Internal server error",
      details,
      retryable: code === "RATE_LIMITED" || code === "INTERNAL",
      requestId,
    },
  };
}
