#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
};

const log = {
  info: (msg) => console.log(`${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}→ ${msg}${colors.reset}`),
};

const DIRS = [".", "client", "server"];

function rmDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
  }
  return false;
}

function cleanNodeModules() {
  log.info("\nCleaning node_modules...");
  DIRS.forEach((dir) => {
    const nmPath = path.join(path.resolve(dir), "node_modules");
    rmDir(nmPath)
      ? log.success(`Removed ${dir}/node_modules`)
      : log.warning(`No node_modules in ${dir}`);
  });
}

function cleanLocks() {
  log.info("\nCleaning package-lock.json...");
  DIRS.forEach((dir) => {
    const lockPath = path.join(path.resolve(dir), "package-lock.json");
    if (fs.existsSync(lockPath)) {
      fs.unlinkSync(lockPath);
      log.success(`Removed ${dir}/package-lock.json`);
    } else {
      log.warning(`No package-lock.json in ${dir}`);
    }
  });
}

function install(dir) {
  const dirPath = path.resolve(dir);
  const pkgPath = path.join(dirPath, "package.json");

  if (!fs.existsSync(dirPath)) {
    log.error(`Directory ${dir} not found`);
    return false;
  }

  if (!fs.existsSync(pkgPath)) {
    log.warning(`No package.json in ${dir} - skipping`);
    return true;
  }

  try {
    log.step(`Installing in ${dir}...`);
    execSync("npm install", { cwd: dirPath, stdio: "inherit" });
    log.success(`Installed in ${dir}`);
    return true;
  } catch (error) {
    log.error(`Install failed in ${dir}`);
    return false;
  }
}

function installAll() {
  log.info("\nInstalling dependencies...");
  return DIRS.every(install);
}

function execPrisma(cmd, desc) {
  const serverPath = path.resolve("server");
  const schemaPath = path.join(serverPath, "src", "prisma", "schema.prisma");

  if (!fs.existsSync(schemaPath)) {
    log.error("No src/prisma/schema.prisma in server directory");
    return false;
  }

  try {
    log.step(desc);
    execSync(cmd, { cwd: serverPath, stdio: "inherit" });
    log.success("Done");
    return true;
  } catch (error) {
    log.error("Failed");
    return false;
  }
}

function prismaGenerate() {
  log.info("\nGenerating Prisma Client...");

  // Clean generated folder before generating
  const generatedPath = path.join(path.resolve("server"), "src", "generated");
  if (rmDir(generatedPath)) {
    log.success("Cleaned src/generated");
  }

  return execPrisma("npx prisma generate", "Generating...");
}

function prismaMigrate() {
  log.info("\nRunning migrations...");
  return execPrisma("npx prisma migrate dev", "Migrating...");
}

function prismaSeed() {
  log.info("\nSeeding database...");
  const seedPath = path.join(
    path.resolve("server"),
    "src",
    "prisma",
    "seed.ts",
  );

  if (!fs.existsSync(seedPath)) {
    log.warning("No src/prisma/seed.ts - skipping");
    return true;
  }

  return execPrisma("npx prisma db seed", "Seeding...");
}

function prismaReset() {
  log.info("\nResetting database...");
  return execPrisma("npx prisma migrate reset --force", "Resetting...");
}

function initDb() {
  return prismaMigrate() && prismaGenerate() && prismaSeed();
}

function showHelp() {
  console.log(`
${colors.cyan}Project Setup Script${colors.reset}

${colors.yellow}Usage:${colors.reset}
  node setup.js [command]

${colors.yellow}Commands:${colors.reset}
  ${colors.green}install${colors.reset}           Install npm dependencies
  ${colors.green}clean${colors.reset}             Remove node_modules
  ${colors.green}clean:locks${colors.reset}       Remove package-lock.json
  ${colors.green}clean:all${colors.reset}         Remove node_modules and locks
  ${colors.green}reinstall${colors.reset}         Clean and reinstall all

  ${colors.green}prisma:generate${colors.reset}   Generate Prisma Client
  ${colors.green}prisma:migrate${colors.reset}    Run database migrations
  ${colors.green}prisma:seed${colors.reset}       Seed database with default data
  ${colors.green}prisma:reset${colors.reset}      Reset database (destroys data!)
  ${colors.green}prisma:init${colors.reset}       Full init (migrate + generate + seed)

  ${colors.green}setup${colors.reset}             Full setup (install + prisma:init)
  ${colors.green}help${colors.reset}              Show this help
`);
}

function main() {
  const cmd = process.argv[2] || "help";

  const commands = {
    install: installAll,
    clean: cleanNodeModules,
    "clean:locks": cleanLocks,
    "clean:all": () => {
      cleanNodeModules();
      cleanLocks();
    },
    reinstall: () => {
      cleanNodeModules();
      cleanLocks();
      return installAll();
    },
    "prisma:generate": prismaGenerate,
    "prisma:migrate": prismaMigrate,
    "prisma:seed": prismaSeed,
    "prisma:reset": prismaReset,
    "prisma:init": initDb,
    setup: () => installAll() && initDb(),
    help: () => {
      showHelp();
      return true;
    },
  };

  const fn = commands[cmd] || commands.help;
  const success = fn();

  if (cmd !== "help") {
    console.log();
    success ? log.success("Done!") : (log.error("Failed!"), process.exit(1));
  }
}

main();
