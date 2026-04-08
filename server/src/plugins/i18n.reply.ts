import fp from "fastify-plugin";

import type { FastifyInstance, FastifyServerOptions } from "fastify";
import type { LookupAllOptions } from "node:dns";

interface OkAPIResponse {
  success: boolean;
  message: string;
  code: string;
  data?: any;
}

interface FailAPIResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    data?: any;
  };
}

async function customDecorators(
  fastify: FastifyInstance,
  options: FastifyServerOptions,
) {
  // i18n decorator - Success
  fastify.decorateReply("ok", function (messageKey = "SUCCESS", data = {}) {
    const t = this.request.t || ((key) => key);
    const message = t(messageKey); // with translation;
    const dataToSend: OkAPIResponse = {
      success: true,
      message: message,
      code: messageKey,
    };
    if (data && Object.keys(data).length > 0) dataToSend["data"] = data;
    return this.code(200).send(dataToSend);
  });

  // i17n decorator - Error
  fastify.decorateReply(
    "fail",
    function (messageKey, statusCode = 400, data = {}) {
      const t = this.request.t || ((key) => key);
      const message = t(messageKey); // with translation
      const dataToSend: FailAPIResponse = {
        success: false,
        error: {
          code: messageKey,
          message: message,
        },
      };
      if (data && Object.keys(data).length > 0) dataToSend.error["data"] = data;
      return this.status(statusCode).send(dataToSend);
    },
  );
}

export default fp(customDecorators);
