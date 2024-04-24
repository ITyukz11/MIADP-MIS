import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
const { PrismaClient } = require('@prisma/client')
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
export async function POST(request) {
  try {
    const user = await getCurrentUser();

    const { wfpActivityData, wfpActivityPhysicalMonths, wfpActivityFinancialMonths } = await request.json();

    const createdWFPActivity = await prisma.wFPActivity.create({
        data: {
          activityIdNum: wfpActivityData.activityIdNumber,
          typeOfActivity: wfpActivityData.typeOfActivity,
          operatingUnit: wfpActivityData.operatingUnit,
          componentsUnits: wfpActivityData.componentsUnits,
          budgetYear: wfpActivityData.budgetYear,
          activities: wfpActivityData.activities,
          costTabMajorityActivity: wfpActivityData.costTabMajorActivity,
          costTabSubActivity: wfpActivityData.costTabSubActivity,
          unitMeasures: wfpActivityData.unitOfMeasure,
          physicalTarget: wfpActivityData.physicalTarget,
          financialTotal: wfpActivityData.financialTotal,
          loanProceed: wfpActivityData.loanProceed,
          gopCounterPart: wfpActivityData.gopCounterpart,
          budgetLine: wfpActivityData.budgetLine,
          uacsCode: wfpActivityData.UACSCode,
          userEmail: user?.email,
          timeFramePhysical: {   
            create: {
              january: Number(wfpActivityPhysicalMonths.physicalJan),
              february: Number(wfpActivityPhysicalMonths.physicalFeb),
              march: Number(wfpActivityPhysicalMonths.physicalMar),
              april: Number(wfpActivityPhysicalMonths.physicalApr),
              may: Number(wfpActivityPhysicalMonths.physicalMay),
              june: Number(wfpActivityPhysicalMonths.physicalJun),
              july: Number(wfpActivityPhysicalMonths.physicalJul),
              august: Number(wfpActivityPhysicalMonths.physicalAug),
              september: Number(wfpActivityPhysicalMonths.physicalSep),
              october: Number(wfpActivityPhysicalMonths.physicalOct),
              november: Number(wfpActivityPhysicalMonths.physicalNov),
              december: Number(wfpActivityPhysicalMonths.physicalDec)
            }   
          },
          timeFrameFinancial: {
            create:{
              january: Number(wfpActivityFinancialMonths.financialJan),
              february: Number(wfpActivityFinancialMonths.financialFeb),
              march: Number(wfpActivityFinancialMonths.financialMar),
              april: Number(wfpActivityFinancialMonths.financialApr),
              may: Number(wfpActivityFinancialMonths.financialMay),
              june: Number(wfpActivityFinancialMonths.financialJun),
              july: Number(wfpActivityFinancialMonths.financialJul),
              august: Number(wfpActivityFinancialMonths.financialAug),
              september: Number(wfpActivityFinancialMonths.financialSep),
              october: Number(wfpActivityFinancialMonths.financialOct),
              november: Number(wfpActivityFinancialMonths.financialNov),
              december: Number(wfpActivityFinancialMonths.financialDec)
            }
          }
        }
      });
      
      
    console.log({ userEmail: user?.email, wfpActivityData, wfpActivityPhysicalMonths, wfpActivityFinancialMonths  });
    console.log({createdWFPActivity})
    return NextResponse.json({  wfpActivityData, user });
  } catch (error) {
    console.error('Error uploading wpf datas:', error);
    return NextResponse.json({ error: 'Internal server error' });
  }
}

export async function GET() {
  try {
    const wFPActivityDatas = await prisma.wFPActivity.findMany({  
      include: {
        timeFramePhysical: true,
        timeFrameFinancial: true,
      },
      cacheStrategy: { ttl: 60, swr: 30 },  
    });
    return new Response(JSON.stringify(wFPActivityDatas), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error fetching wFPActivityDatas:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await prisma.$disconnect(); // Don't forget to disconnect from the database
  }
}
