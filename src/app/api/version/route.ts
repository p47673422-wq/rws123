import { NextResponse } from 'next/server';
import pkg from '../../../../package.json';

export async function GET() {
  const version = process.env.VERCEL_GIT_COMMIT_SHA || pkg.version || '0.0.0';
  return NextResponse.json({ version });
}