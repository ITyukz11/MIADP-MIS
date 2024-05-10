// pages/api/getUser.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });

    if (!session?.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = {
        name: session.user.name,
        // Include other user properties as needed
    };

    return res.status(200).json({ user });
}
