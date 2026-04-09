import { InstructorAttendanceSheet } from "@/lib/types";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function downloadInstructorAttendanceExcel(sheet: InstructorAttendanceSheet) {
  if (typeof window === "undefined") {
    return;
  }

  const rows = [
    ["Programa", sheet.programa],
    ["Ficha", sheet.ficha],
    ["Fecha", sheet.date],
    ["Jornada", sheet.jornada],
    ["Horario", sheet.horario],
    ["Ambiente", sheet.ambiente ?? "No aplica"],
    ["Instructor", sheet.instructor],
    ["Total aprendices", String(sheet.totalAprendices)],
    [],
    ["Aprendiz", "Documento", "Estado", "Observacion"],
    ...sheet.learners.map((learner) => [
      learner.apprentice,
      learner.document,
      learner.status ?? "Sin marcar",
      learner.observation || "",
    ]),
  ];

  const xmlRows = rows
    .map((row) => {
      const cells = row.length
        ? row
            .map(
              (cell) =>
                `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`,
            )
            .join("")
        : `<Cell><Data ss:Type="String"></Data></Cell>`;

      return `<Row>${cells}</Row>`;
    })
    .join("");

  const workbook = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Asistencia">
  <Table>${xmlRows}</Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([workbook], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(blob);

  link.href = url;
  link.download = `asistencia-${sheet.ficha}-${sheet.date}.xml`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
