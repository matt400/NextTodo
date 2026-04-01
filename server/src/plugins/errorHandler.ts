import i18next from "i18next";
import { AppError } from "@server/utils/errors";

import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const t = request.t || i18next.t.bind(i18next);

  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      success: false,
      error: {
        code: error.statusCode,
        message: t(error.message),
      },
    });
  }

  if (error.code === "FST_ERR_VALIDATION") {
    return reply.code(400).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error.message,
        details: error.validation,
      },
    });
  }

  return reply.code(500).send({
    success: false,
    error: {
      code: "UNKNOWN_ERROR",
      message: t("UNKNOWN_ERROR"),
    },
  });
}
