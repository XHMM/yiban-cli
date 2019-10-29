import * as path from "path";
import * as fs from "fs";
import { promises } from "fs";

export function createFile(
  fullPath: string,
  content: string
): Promise<void>;
export function createFile(
  dirname: string,
  filename: string,
  content: string
): Promise<void>
export async function createFile(
  dirname: string,
  filename?: string,
  content?: string
): Promise<void> {
  try {
    let fullPath = '';
    if (arguments.length === 2) {
      fullPath = dirname;
      content = filename;
    }
    else if (arguments.length === 3) fullPath = path.resolve(process.cwd(), dirname, filename!)

    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir))
      await promises.mkdir(dir, { recursive: true });
    await promises.writeFile(fullPath, content);
    console.log(`Created file ${fullPath}`);
  } catch (e) {
    console.log(e)
  }

}

export function exists(path: string): boolean {
  return fs.existsSync(path);
}


export function toCamelCase(str: string, separator: string): string {
  return str.replace(new RegExp(`(${separator}([a-zA-Z]))`, 'g'), function(match, $1, $2) {
    return $2.toUpperCase();
  }).replace(/-/g, '');
}
