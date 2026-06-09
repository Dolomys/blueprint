import { ORPCError } from "@orpc/server";

export function notFound(message = "Resource not found") {
  return new ORPCError("NOT_FOUND", { message });
}

export function forbidden(message = "Forbidden") {
  return new ORPCError("FORBIDDEN", { message });
}

export function badRequest(message = "Bad request") {
  return new ORPCError("BAD_REQUEST", { message });
}
