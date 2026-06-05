


import { customLog } from './logger.js';
import { getTopNotifications } from './sortingLogic.js';

const mockData = [
  { ID: "1", Type: "Event", Message: "Annual Meet", Timestamp: "2026-06-05 09:00:00" },
  { ID: "2", Type: "Placement", Message: "Google Drive", Timestamp: "2026-06-05 08:30:00" },
  { ID: "3", Type: "Result", Message: "Exam Results", Timestamp: "2026-06-05 09:15:00" },
  { ID: "4", Type: "Placement", Message: "Amazon Drive", Timestamp: "2026-06-05 09:45:00" }
];

async function verifyStageOne() {
  console.log("Evaluating Stage 1 Multi-Key Sorting Engine");

  const sorted = getTopNotifications(mockData, 10);

  console.log("\n Order Verification:");
  sorted.forEach((item, idx) => {
    console.log(`${idx + 1}. [${item.Type}] ${item.Message} (${item.Timestamp})`);
  });

  await customLog({
    stack: 'frontend',
    level: 'info',
    packageName: 'utils',
    message: 'Stage 1 custom sorting algorithm verification'
  });
}

verifyStageOne().catch(console.error);