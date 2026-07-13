const runDuration = 5; // minutes

const { spawn } = require("child_process");

function runMain() {
  console.log("Starting main.js ...");

  const proc = spawn("node", ["main.js"], {
    stdio: "inherit", // show output in terminal
  });

  // Kill after runDuration minutes
  const timer = setTimeout(() => {
    console.log("Stopping main.js ...");
    proc.kill("SIGTERM");
  }, runDuration * 60 * 1000);

  proc.on("exit", (code, signal) => {
    clearTimeout(timer);
    console.log(`main.js exited with code ${code}, signal ${signal}`);
    console.log("Restarting in 1 second ...");
    setTimeout(runMain, 1000); // 1 second restart delay
  });
}

runMain();
