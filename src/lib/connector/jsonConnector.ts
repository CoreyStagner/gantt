import { promises as fs } from 'fs';

/**
 * Reads JSON data from a file
 * @param filePath Path to the JSON file
 * @returns Parsed JSON data
 */
export async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
    const rawData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(rawData) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error reading JSON file: ${error.message}`);
    } else {
      throw new Error('error is not an instance of Error');
    }
  }
}

/**
 * Writes data to a JSON file
 * @param filePath Path to the JSON file
 * @param data Data to write
 */
export async function writeJsonFile<T>(
  filePath: string,
  data: T
): Promise<void> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, 'utf8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error writing JSON file: ${error.message}`);
    } else {
      throw new Error('error is not an instance of Error');
    }
  }
}
