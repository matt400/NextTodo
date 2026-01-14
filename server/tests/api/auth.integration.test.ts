import { buildApp } from "@server/app.js";

vi.mock("bcrypt", () => ({
  default: {
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue("hashed"),
  },
}));

test("login works", async () => {
  const app = await buildApp();

  app.prisma.user.findUnique = vi.fn().mockResolvedValue({
    email: "example@email.com",
    password: "123123123",
  });

  const res = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email: "example@email.com", password: "123123123" },
  });

  expect(res.statusCode).toBe(200);
});

test("login returns 400 when no password", async () => {
  const app = await buildApp();

  const res = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email: "example@email.com", password: "" },
  });

  expect(res.statusCode).toBe(400);
});

test("login returns 400 when no email", async () => {
  const app = await buildApp();

  const res = await app.inject({
    method: "POST",
    url: "/api/auth/login",
    payload: { email: "", password: "123123123" },
  });

  expect(res.statusCode).toBe(400);
});
