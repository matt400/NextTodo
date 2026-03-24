import { Prisma } from "@prismagl";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    messageKey: string,
  ) {
    super(messageKey);
    this.name = "AppError";
  }
}

export function handlePrismaError(e: unknown): never {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case "P2002":
        throw new AppError(409, "USER_ALREADY_EXISTS");
      case "P2025":
        throw new AppError(404, "RECORD_NOT_FOUND");
      default:
        throw new AppError(500, `DB error: ${e.code}`);
    }
  }

  if (e instanceof Prisma.PrismaClientValidationError) {
    throw new AppError(400, "INVALID_REQUEST");
  }

  throw new AppError(500, "UKNOWN_ERROR");
}
