// app.js
const { execSync } = require("child_process");
const path = require("path");

// Ensure dependencies are installed
try {
  console.log("Checking dependencies...");
  execSync("npm install --omit=dev", { stdio: "inherit" });
} catch (err) {
  console.error("Failed to install dependencies:", err);
}

// Start Next.js
const next = require("next");
const http = require("http");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, dir: path.resolve(__dirname) });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => handle(req, res))
    .listen(port, () => {
      console.log(`🚀 Next.js app running on port ${port}`);
    });
});
