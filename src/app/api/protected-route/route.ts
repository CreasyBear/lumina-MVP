import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Your protected API logic here
  return NextResponse.json({ message: 'This is a protected API route' });
}