// logging_middleware/test.js
import { customLog } from './logger.js';

console.log(" Testing");

customLog({
  stack: 'frontend',
  level: 'info',
  packageName: 'api',
  message: 'Testingf for katakam krupavathi'
});