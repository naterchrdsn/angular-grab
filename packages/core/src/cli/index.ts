import { init } from './commands/init';

const args = process.argv.slice(2);
const command = args[0];

if (command === 'init' || !command) {
  init().catch((err) => {
    console.error('\x1b[31mError:\x1b[0m', err.message);
    process.exit(1);
  });
} else {
  console.error(`Unknown command: ${command}`);
  console.log('\nUsage: npx angular-grab init');
  process.exit(1);
}
