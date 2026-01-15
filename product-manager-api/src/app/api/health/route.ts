import { db } from "@/lib/db";
import fs from "fs";

const LOG_PATH = "/home/henkkako/productmanager/runtime.log";

function log(line: string) {
  try {
    fs.appendFileSync(LOG_PATH, line + "\n");
  } catch {}
}

function withTimeout<T>(p: Promise<T>, ms: number) {
  return Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error(`timeout ${ms}ms`)), ms)
    ),
  ]);
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  log("HEALTH_CHECK_START " + new Date().toISOString());

  try {
    log("HEALTH_CHECK_DB_PING");
    await withTimeout(
      db.selectFrom("Product").select("id").limit(1).execute(),
      1500
    );
    log("HEALTH_CHECK_DB_OK");

    return Response.json({
      ok: true,
      hasDb: true,
      hasSessionSecret: !!process.env.SESSION_SECRET,
      nodeEnv: process.env.NODE_ENV ?? null,
    });
  } catch (e: any) {
    log("HEALTH_CHECK_ERROR");
    log(e?.stack ?? String(e));

    return Response.json(
      { ok: false, hasDb: false, error: String(e?.message ?? e) },
      { status: 500 }
    );
  }
}
