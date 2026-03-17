import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = (request: NextRequest) => {
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    if (authValue) {
      const decoded = Buffer.from(authValue, "base64").toString("utf-8");
      const colonIndex = decoded.indexOf(":");
      if (colonIndex !== -1) {
        const user = decoded.slice(0, colonIndex);
        const password = decoded.slice(colonIndex + 1);

        const validUser = process.env.GATE_USER ?? "admin";
        const validPassword = process.env.GATE_PASSWORD;

        if (validPassword && user === validUser && password === validPassword) {
          return NextResponse.next();
        }
      }
    }
  }

  return new NextResponse("인증이 필요합니다.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area", charset="UTF-8"',
    },
  });
};

export const config = {
  matcher: "/yoonseulhouse-admin-jhj/:path*",
};
