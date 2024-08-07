import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient().$extends(withAccelerate());

export async function POST(request) {
    try {
        const { id, name, email, position, unit, component, region, logs } = await request.json();
        console.log("DATAS:",{ id, name, email, position, unit, component, region, logs });

        // Fetch the user from the database
        const userz = await prisma.user.findUnique({ where: { email } });
        if (!userz) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Ensure the userName in logs matches the user's name
        if (userz.name !== logs.userName) {
            return NextResponse.json({ success: false, message: "User name in logs does not match" }, { status: 400 });
        }

        // Execute both queries within a transaction
        const result = await prisma.$transaction([
            prisma.user.update({
                where: { id },
                data: {
                    name,
                    email,
                    position,
                    unit,
                    component,
                    region
                },
            }),
        
            // prisma.userLog.create({
            //     data: {
            //         user: {
            //             connectOrCreate: {
            //                 where: { name: logs.userName },
            //                 create: { name: logs.userName }
            //             }
            //         },
            //         action: logs.action,
            //         remarks: logs.remarks,
            //     },
            // })
        ]);

        return NextResponse.json({ success: true, message: "Profile updated and logs recorded successfully", result: result }, { status: 200 });
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
