import { NextRequest, NextResponse } from "next/server";

import { getDemoAttendanceStore } from "@/lib/attendance/demo-attendance-store";
import type { SharedAttendanceRecord } from "@/lib/attendance/shared-attendance";

const validStatuses = new Set(["Asistió", "Tardanza", "Inasistencia", "Excusa"]);

function isAttendanceRecord(value: unknown): value is SharedAttendanceRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<SharedAttendanceRecord>;

  return Boolean(
    record.id &&
      record.document &&
      record.studentName &&
      record.group &&
      record.subject &&
      record.date &&
      record.status &&
      validStatuses.has(record.status),
  );
}

export async function GET(request: NextRequest) {
  const document = request.nextUrl.searchParams.get("document")?.replace(/\D/g, "") ?? "";
  const records = [...getDemoAttendanceStore().values()]
    .filter((record) => !document || record.document === document)
    .sort((left, right) => right.date.localeCompare(left.date));

  return NextResponse.json({ records }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    group?: string;
    date?: string;
    records?: unknown[];
  };

  if (!payload.group || !payload.date || !Array.isArray(payload.records)) {
    return NextResponse.json({ error: "Registro de asistencia incompleto." }, { status: 400 });
  }

  const records = payload.records.filter(isAttendanceRecord);
  const store = getDemoAttendanceStore();

  for (const [id, record] of store.entries()) {
    if (record.group === payload.group && record.date === payload.date) store.delete(id);
  }

  records.forEach((record) => store.set(record.id, record));

  return NextResponse.json({ saved: records.length, records });
}
