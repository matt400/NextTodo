import fp from "fastify-plugin";

import type { FastifyInstance, FastifyServerOptions } from "fastify";

async function customDecorators(
  fastify: FastifyInstance,
  options: FastifyServerOptions,
) {
  // i18n decorator - Success
  fastify.decorateReply("ok", function (messageKey = "SUCCESS") {
    const t = this.request.t || ((key) => key);
    const message = t(messageKey); // with translation;
    return this.code(200).send({
      success: true,
      message,
      code: messageKey,
    });
  });

  // i17n decorator - Error
  fastify.decorateReply(
    "fail",
    function (messageKey, statusCode = 400, data = {}) {
      const t = this.request.t || ((key) => key);
      const message = t(messageKey); // with translation
      return this.status(statusCode).send({
        success: false,
        error: {
          code: messageKey,
          message: message,
          data: data,
        },
      });
    },
  );
}

export default fp(customDecorators);
