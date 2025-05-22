// app/api/kobotoolbox/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://kf.kobotoolbox.org/api/v2/assets/aoseNc9D3LtyyVkwYgsA3i/data/",
    {
      headers: {
        Authorization: "Token fa0b420f4960276495b7a2f936495f36e8e3f629",
        Accept: "application/json",
      },
      cache: "no-store", // disable caching
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
