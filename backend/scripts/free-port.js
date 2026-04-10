import { execSync } from 'child_process';

const port = Number(process.argv[2] || 5000);

const commandExists = (command) => {
  try {
    execSync(`command -v ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

const killPortOnWindows = (targetPort) => {
  const output = execSync(`netstat -ano -p tcp | findstr :${targetPort}`, { encoding: 'utf8' });
  const pids = new Set();

  output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const parts = line.split(/\s+/);
      const state = parts[3];
      const pid = parts[4];

      if (state === 'LISTENING' && pid && pid !== '0') {
        pids.add(pid);
      }
    });

  pids.forEach((pid) => {
    execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    console.log(`Stopped process ${pid} on port ${targetPort}`);
  });
};

const killPortOnUnix = (targetPort) => {
  try {
    let output = '';

    if (commandExists('lsof')) {
      output = execSync(`lsof -ti tcp:${targetPort}`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    } else if (commandExists('fuser')) {
      output = execSync(`fuser -n tcp ${targetPort}`, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    } else {
      // No supported tool available to free a port on this environment.
      return;
    }

    if (!output) return;

    output
      .split(/\r?\n/)
      .flatMap((line) => line.split(/\s+/))
      .map((pid) => pid.trim())
      .filter(Boolean)
      .forEach((pid) => {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        console.log(`Stopped process ${pid} on port ${targetPort}`);
      });
  } catch {
    // Nothing listening on the port or command output is unavailable.
  }
};

try {
  if (process.platform === 'win32') {
    killPortOnWindows(port);
  } else {
    killPortOnUnix(port);
  }
} catch {
  // If we cannot free the port automatically, let nodemon surface the issue.
}