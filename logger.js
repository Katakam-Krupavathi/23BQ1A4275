

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWE0Mjc1QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjM1NjIzLCJpYXQiOjE3ODA2MzQ3MjMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxNTNiZGZkOC02Zjk1LTQ3NjItODY3YS1kNDhmZWQ1YzQyOTUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYXRha2FtIGtydXBhdmF0aGkiLCJzdWIiOiI0MDMzN2ZmNC0xYzE0LTQ0NGItOTM3Yi0zOTc2ZTc4NmUxZTUifSwiZW1haWwiOiIyM2JxMWE0Mjc1QHZ2aXQubmV0IiwibmFtZSI6ImthdGFrYW0ga3J1cGF2YXRoaSIsInJvbGxObyI6IjIzYnExYTQyNzUiLCJhY2Nlc3NDb2RlIjoiUVFkRVl5IiwiY2xpZW50SUQiOiI0MDMzN2ZmNC0xYzE0LTQ0NGItOTM3Yi0zOTc2ZTc4NmUxZTUiLCJjbGllbnRTZWNyZXQiOiJ1cFloenlaUmZubkpQd3BGIn0.5hxXA9XV2aMscVxscQ_5SS18FFzXswTlu3wMHYpZIEA";
const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";



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