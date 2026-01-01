import { spawn } from 'child_process';

console.log('Starting server.js with explicit log capture...');

const child = spawn('node', ['server.js'], {
    env: process.env,
    shell: true
});

child.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`);
});

child.stderr.on('data', (data) => {
    console.error(`STDERR: ${data}`);
});

child.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code);
});

child.on('error', (err) => {
    console.error('Failed to start child process:', err);
});
