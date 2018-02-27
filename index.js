const readline = require('readline')
const path = require('path')
const { spawn } = require('child_process')

const PROMPT = '$ '
let cwd = process.env.HOME || '/'
let status

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const shsh_loop = () => {
  rl.question(PROMPT, line => {
    const args = line.split(/[\s]+/)
    const cmd = args.shift()
    switch(cmd) {
      case 'cd':
        chdir(args[0])
        shsh_loop()
        break;
      case 'exit':
        process.stdin.end()
        break;
      default:
        const child = spawn(cmd, args, {
          cwd
        })
        child.stdout.pipe(process.stdout)
        process.stdin.pipe(child.stdin)
        // child.stderr.pipe(process.stderr)
        child.on('close', code => {
          status = code
          process.stdin.unpipe(child.stdin)
          process.stdin.resume()
          shsh_loop()
        })
        break;
    }
  })
}

const chdir = (dir) => {
  cwd = path.resolve(cwd, dir)
}

// Start the shell
shsh_loop()