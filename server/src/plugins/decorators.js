import fp from 'fastify-plugin'

async function customDecorators(fastify, options) {
    // i18n decorator - Success
    fastify.decorateReply('ok', function (data = null, messageKey = 'SUCCESS') {
        const message = this.request.t(messageKey); // with translation
        return this.status(200).send({
            success: true,
            data,
            message,
            code: messageKey
        });
    });

    // i18n decorator - Error 
    fastify.decorateReply('fail', function (messageKey, statusCode = 400) {
        const message = this.request.t(messageKey); // with translation
        return this.status(statusCode).send({
            success: false,
            error: {
                code: messageKey,
                message: message
            }
        });
    });
}

export default fp(customDecorators)