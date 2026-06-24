import { createPrivateKey, createSign, randomUUID } from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RsvpPayload = {
  guests?: {
    firstName?: string;
    lastName?: string;
    attending?: string;
  }[];
  attendeeCount?: string;
  message?: string;
};

const requiredEnvVars = [
  "GOOGLE_SHEETS_CLIENT_EMAIL",
  "GOOGLE_SHEETS_PRIVATE_KEY",
  "GOOGLE_SHEETS_SPREADSHEET_ID",
];

function base64UrlEncode(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function getPrivateKey() {
  const rawPrivateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.trim();

  if (!rawPrivateKey) {
    return undefined;
  }

  if (rawPrivateKey.startsWith("{")) {
    try {
      const parsed = JSON.parse(rawPrivateKey) as { private_key?: string };
      if (parsed.private_key) {
        return parsed.private_key.replace(/\\n/g, "\n").trim();
      }
    } catch {
      // Fall through to the raw value below.
    }
  }

  return rawPrivateKey
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .replace(/\\n/g, "\n")
    .trim();
}

function createServiceAccountJwt() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = getPrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google Sheets service account credentials.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  );
  const unsignedToken = `${header}.${payload}`;
  const keyObject = createPrivateKey({ key: privateKey, format: "pem" });
  const signature = createSign("RSA-SHA256").update(unsignedToken).sign(keyObject, "base64url");

  return `${unsignedToken}.${signature}`;
}

async function getAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createServiceAccountJwt(),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Could not authenticate with Google Sheets: ${errorText}`);
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("Google did not return an access token.");
  }

  return data.access_token;
}

function validatePayload(payload: RsvpPayload) {
  const guests = payload.guests
    ?.map((guest) => ({
      firstName: guest.firstName?.trim() || "",
      lastName: guest.lastName?.trim() || "",
      attending: guest.attending === "no" ? "No" : "Yes",
    }))
    .filter((guest) => guest.firstName && guest.lastName);
  const attendeeCount = payload.attendeeCount?.trim();
  const message = payload.message?.trim() || "";

  if (!guests?.length || !attendeeCount) {
    return null;
  }

  return { guests, attendeeCount, message };
}

export async function POST(request: Request) {
  try {
    const missingEnvVar = requiredEnvVars.find((envVar) => !process.env[envVar]);

    if (missingEnvVar) {
      return NextResponse.json(
        { message: `Server is missing ${missingEnvVar}.` },
        { status: 500 }
      );
    }

    const payload = validatePayload((await request.json()) as RsvpPayload);

    if (!payload) {
      return NextResponse.json(
        { message: "Please complete the required RSVP fields." },
        { status: 400 }
      );
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "RSVP";
    const accessToken = await getAccessToken();
    const range = encodeURIComponent(`${sheetName}!A:G`);
    const submittedAt = new Date().toISOString();
    const groupId = randomUUID();
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: payload.guests.map((guest) => [
            submittedAt,
            groupId,
            guest.firstName,
            guest.lastName,
            guest.attending,
            payload.attendeeCount,
            payload.message,
          ]),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Could not save RSVP to Google Sheets.");
    }

    return NextResponse.json({ message: "RSVP saved. Thank you!" });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message.includes("DECODER routines")) {
      return NextResponse.json(
        {
          message:
            "Google private key is not in valid PEM format. Paste the service account private_key value exactly, including BEGIN/END lines, and keep literal \\n line breaks or real new lines.",
        },
        { status: 500 }
      );
    }

    if (error instanceof Error && error.message.startsWith("Could not authenticate with Google Sheets:")) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong while saving your RSVP." },
      { status: 500 }
    );
  }
}
