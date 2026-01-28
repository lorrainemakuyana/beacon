#!/usr/bin/env node

/**
 * Health Check Script for Beacon Platform
 * Verifies that the development environment is properly set up
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors for output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
};

const checks = [];

// Check if required files exist
const requiredFiles = [
  "package.json",
  "shared/package.json",
  "web/package.json",
  "mobile/package.json",
  "firebase/firebase.json",
  "firebase/firestore.rules",
  "shared/src/firebase/config.ts",
  "shared/src/services/client-functions.ts",
];

checks.push({
  name: "Required files exist",
  check: () => {
    const missing = requiredFiles.filter((file) => !fs.existsSync(file));
    if (missing.length > 0) {
      throw new Error(`Missing files: ${missing.join(", ")}`);
    }
    return "All required files present";
  },
});

// Check Node.js version
checks.push({
  name: "Node.js version",
  check: () => {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split(".")[0]);
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ required, found ${version}`);
    }
    return `Node.js ${version} (✓)`;
  },
});

// Check if dependencies are installed
checks.push({
  name: "Dependencies installed",
  check: () => {
    if (!fs.existsSync("node_modules")) {
      throw new Error("node_modules not found. Run: npm install");
    }
    if (
      !fs.existsSync("shared/node_modules") &&
      !fs.existsSync("node_modules/@beacon/shared")
    ) {
      throw new Error("Shared package not installed. Run: npm install");
    }
    return "Dependencies installed";
  },
});

// Check if shared package is built
checks.push({
  name: "Shared package built",
  check: () => {
    if (!fs.existsSync("shared/dist")) {
      throw new Error(
        "Shared package not built. Run: npm run build --workspace=shared",
      );
    }
    return "Shared package built";
  },
});

// Check Firebase CLI
checks.push({
  name: "Firebase CLI",
  check: () => {
    try {
      const version = execSync("firebase --version", {
        encoding: "utf8",
      }).trim();
      return `Firebase CLI ${version} (✓)`;
    } catch (error) {
      throw new Error(
        "Firebase CLI not installed. Run: npm install -g firebase-tools",
      );
    }
  },
});

// Check environment file
checks.push({
  name: "Environment configuration",
  check: () => {
    if (!fs.existsSync("shared/.env")) {
      throw new Error(
        "Environment file missing. Copy shared/.env.example to shared/.env",
      );
    }

    const envContent = fs.readFileSync("shared/.env", "utf8");
    if (
      envContent.includes("your-api-key-here") ||
      envContent.includes("demo-api-key")
    ) {
      log.warning("Environment file contains placeholder values");
      return "Environment file exists (needs configuration)";
    }

    return "Environment file configured";
  },
});

// Check package.json scripts
checks.push({
  name: "Package scripts",
  check: () => {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const requiredScripts = ["firebase:emulators", "dev:web", "dev:mobile"];
    const missing = requiredScripts.filter((script) => !pkg.scripts[script]);

    if (missing.length > 0) {
      throw new Error(`Missing scripts: ${missing.join(", ")}`);
    }

    return "All required scripts present";
  },
});

// Check TypeScript configuration
checks.push({
  name: "TypeScript configuration",
  check: () => {
    const tsConfigs = [
      "shared/tsconfig.json",
      "web/tsconfig.json",
      "mobile/tsconfig.json",
    ];
    const missing = tsConfigs.filter((config) => !fs.existsSync(config));

    if (missing.length > 0) {
      throw new Error(`Missing TypeScript configs: ${missing.join(", ")}`);
    }

    return "TypeScript configurations present";
  },
});

// Run all checks
async function runHealthCheck() {
  console.log(`${colors.blue}🏥 Beacon Platform Health Check${colors.reset}`);
  console.log("================================\n");

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    try {
      const result = check.check();
      log.success(`${check.name}: ${result}`);
      passed++;
    } catch (error) {
      log.error(`${check.name}: ${error.message}`);
      failed++;
    }
  }

  console.log("\n================================");
  console.log(
    `${colors.blue}Summary: ${passed} passed, ${failed} failed${colors.reset}`,
  );

  if (failed === 0) {
    log.success("All checks passed! Your development environment is ready.");
    console.log("\n🚀 Next steps:");
    console.log("1. npm run firebase:emulators  # Start Firebase emulators");
    console.log("2. npm run dev:web            # Start web dashboard");
    console.log("3. npm run dev:mobile         # Start mobile app");
  } else {
    log.error("Some checks failed. Please fix the issues above.");
    process.exit(1);
  }
}

// Run the health check
runHealthCheck().catch((error) => {
  log.error(`Health check failed: ${error.message}`);
  process.exit(1);
});
