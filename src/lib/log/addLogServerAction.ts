'use server';
import fs from 'fs';

// TODO: update the file save to database.

// Path to local Log File.
const logFilePath = process.cwd() + '/data/log/log.json';

const Log = async (
  {
    level,
    uuid,
    message,
    data,
  }: {
    level: string;
    uuid?: string;
    message: string;
    data?: object | string;
  },
  displayInConsole: boolean = true,
  displayInBrowser: boolean = false
) => {
  // Create a log data object.
  const logDataObject = {
    level,
    uuid,
    message,
    data: JSON.stringify(data) || null,
    timestamp: new Date().toISOString(),
  };
  // Read the log file data.
  const logFileData = fs.readFileSync(logFilePath, 'utf8');
  // create and JSON object
  const logFileDataJSON = JSON.parse(logFileData);
  // Add new log data to the log file data.
  logFileDataJSON.push(logDataObject);
  // Write the updated log file data to the log file.
  fs.writeFileSync(logFilePath, JSON.stringify(logFileDataJSON));

  // Additional Logic for logs
  // Log to console if displayInConsole is true
  if (displayInConsole) {
    console.log(logDataObject);
  }
  // Log to the browser console if displayInBrowser is true
  if (displayInBrowser) {
    console.log(logDataObject);
  }
};

export { Log };
