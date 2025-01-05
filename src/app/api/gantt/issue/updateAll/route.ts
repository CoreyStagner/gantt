import { NextResponse } from 'next/server';
// import localData from '@/src/lib/data/issues.json';
import fs from 'fs';
import path from 'path';

export async function GET() {
  return NextResponse.json({ hello: 'Next.js' });
}

export async function POST(request: Request) {
  const body = await request.json();
  const filePath = path.join(
    process.cwd(),
    'src/app/api/gantt/issue/data/issues.json'
  );
  // Save body to LOCAL JSON file
  const updatedJSON = JSON.stringify(body, null, 2);
  fs.writeFileSync(filePath, updatedJSON);
  return NextResponse.json({ results: updatedJSON });
}
