/**
 * Windows Ninja/CMake encodes the full source path into object filenames.
 * Building from a subst drive keeps those names under the 260-character limit.
 */
const { spawn, spawnSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const SHORT_DRIVE = 'R:';

function windowsBuildRoot() {
  spawnSync('cmd.exe', ['/c', 'subst', SHORT_DRIVE, '/d'], {
    stdio: 'ignore',
  });

  const mapped = spawnSync('cmd.exe', ['/c', 'subst', SHORT_DRIVE, projectRoot], {
    encoding: 'utf8',
  });

  if (mapped.status !== 0) {
    console.warn(
      `Could not map ${SHORT_DRIVE} to the project folder. Building from:\n  ${projectRoot}\n${mapped.stderr || mapped.stdout || ''}`,
    );
    return projectRoot;
  }

  return `${SHORT_DRIVE}\\`;
}

function isMetroRunning() {
  const result = spawnSync(
    'cmd.exe',
    ['/c', 'netstat -ano | findstr :8081 | findstr LISTENING'],
    { encoding: 'utf8' },
  );
  return result.status === 0 && Boolean(result.stdout && result.stdout.trim());
}

const cwd = process.platform === 'win32' ? windowsBuildRoot() : projectRoot;
console.log(`Installing Android app from ${cwd}`);

const args = ['react-native', 'run-android'];
if (isMetroRunning()) {
  console.log('Metro is already on 8081; installing without starting another packager.');
  args.push('--no-packager');
}

const child = spawn('npx', args, {
  cwd,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, CI: '1' },
});

child.on('exit', code => {
  process.exit(code ?? 1);
});
