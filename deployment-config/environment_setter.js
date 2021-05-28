const fs = require("fs").promises;
const ENV_VARS = [
  "API_SECRET",
  "SMTP_USERNAME",
  "SMTP_PASSWORD",
  "PORT",
  "NODE_ENV",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_DIALECT",
  "DB_OPERATOR_ALIASES",
];

let content = "";
for (const varName of ENV_VARS) {
  if (!process.env[varName]) {
    continue;
  }

  content += `${varName}=${process.env[varName]}\n`;
}

(async () => {
  await fs.writeFile("./.env", content, "utf8");
})();
