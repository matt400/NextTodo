import { describe, it, expect, beforeAll, afterAll } from "vitest";
import authRoutes from "@server/api/auth.js";

describe("Auth routes", () => {
  let fastify;

  beforeAll(async () => {
    fastify = Fastify();

    // Register plugins
    await fastify.register(cookie);
    await fastify.register(fastifyJwt, { secret: "test-secret" });

    // Mock ok() reply decorator
    fastify.decorateReply("ok", function (data, code, meta) {
      this.send({ data, code, meta });
    });

    await fastify.register(authRoutes);
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  it("POST /login should return access_token cookie", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/login",
      payload: {
        email: "test@example.com",
        password: "secret",
      },
    });

    expect(response.statusCode).toBe(200);

    // Check cookie
    const setCookie = response.cookies.find((c) => c.name === "access_token");
    expect(setCookie).toBeDefined();
    expect(setCookie.httpOnly).toBe(true);
    expect(setCookie.path).toBe("/");
    expect(setCookie.maxAge).toBe(3600);

    // Check response body
    const body = response.json();
    expect(body.code).toBe("LOGIN_SUCCESS");
  });

  it("POST /logout should clear access_token cookie", async () => {
    const response = await fastify.inject({
      method: "POST",
      url: "/logout",
    });

    expect(response.statusCode).toBe(200);

    const clearedCookie = response.cookies.find(
      (c) => c.name === "access_token"
    );
    expect(clearedCookie).toBeDefined();
    expect(clearedCookie.value).toBe(""); // cookie cleared

    const body = response.json();
    expect(body.message).toBe("Wylogowano");
  });
});
