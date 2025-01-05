import { NextResponse } from 'next/server';
import localData from '@/src/app/api/gantt/issue/data/issues.json';

export async function GET() {
  const jsonData = localData;
  return NextResponse.json(jsonData);
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  return NextResponse.json({ hello: 'Next.js' });
}
