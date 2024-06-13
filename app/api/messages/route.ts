import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const messages = await prisma.message.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } else if (req.method === 'POST') {
    const { content } = req.body;
    const userId = session.user?.id as string; // Ensure userId is treated as string

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found' });
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        userId
      },
      include: { user: true }
    });
    res.json(newMessage);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
