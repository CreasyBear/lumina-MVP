import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Your protected API logic here
  res.status(200).json({ message: 'This is a protected API route' });
}