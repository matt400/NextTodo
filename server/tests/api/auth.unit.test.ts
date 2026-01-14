import { vi, test } from "vitest";
import { loginUser } from "@server/api/auth/service.js";
import { createToken } from "@server/utils/api.js";

test("return user if exists", async () => {
  const prismaMock = {
    user: { findUnique: vi.fn().mockResolvedValue({ id: 1 }) },
  };

  const bcryptMock = {
    compare: vi.fn().mockResolvedValue(true),
    hash: vi.fn().mockResolvedValue("hashed"),
  };

  const user = await loginUser(prismaMock, bcryptMock, "a@b.com", "123123123");
  expect(user.id).toBe(1);
});

test("generates token", () => {
  const jwtMock = { sign: vi.fn().mockReturnValue("TOKEN123") };
  const token = createToken(jwtMock, { email: "a@b.com" });
  expect(token).toBe("TOKEN123");
});
