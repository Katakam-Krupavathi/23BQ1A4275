

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const LOG_API_URL = process.env.LOG_API_URL;



export async function customLog({ stack, level, packageName, message }) {
  try {
    const response = await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        stack,         
        level,         
        package: packageName, 
        message
      })
    });

    const data = await response.json();
    console.log("Server Sync Response:", data);
  } catch (error) {
    console.error("Log failed :", error);
  }
}