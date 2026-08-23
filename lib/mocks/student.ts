export const studentProfile = {
  id: "student-001",
  name: "Daniel Felipe Rojas Gómez",
  shortName: "Daniel Rojas",
  initials: "DR",
  document: "TI 1023456789",
  email: "daniel.rojas@correo.edu.co",
  phone: "300 456 7890",
  recordNumber: "2876543",
  status: "Estudiante activo",
  campus: "Campus Salamanca",
};

export const studentProgram = {
  name: "Análisis y Desarrollo de Software",
  progress: 68,
  schedule: "Diurna",
  modality: "Presencial",
  leadProfessor: "Laura Romero",
  period: "Febrero 2026 – Noviembre 2027",
};

export const studentSchedule = [
  {
    id: "session-001",
    day: "Lun",
    date: "24 Ago",
    time: "8:00–11:00",
    subject: "Diseño de interfaces web",
    professor: "Laura Romero",
    room: "Aula 301",
    status: "Confirmada",
  },
  {
    id: "session-002",
    day: "Lun",
    date: "24 Ago",
    time: "13:00–16:00",
    subject: "Bases de datos",
    professor: "Carlos Mendoza",
    room: "Aula 204",
    status: "Confirmada",
  },
  {
    id: "session-003",
    day: "Mar",
    date: "25 Ago",
    time: "8:00–11:00",
    subject: "Proyecto formativo",
    professor: "Laura Romero",
    room: "Biblioteca",
    status: "Cambio reciente",
  },
];

export const studentAttendance = {
  percentage: 88,
  records: [
    { id: "attendance-001", date: "21 Ago", subject: "Diseño de interfaces web", status: "Asistió" },
    { id: "attendance-002", date: "20 Ago", subject: "Bases de datos", status: "Tardanza" },
    { id: "attendance-003", date: "18 Ago", subject: "Proyecto formativo", status: "Inasistencia" },
  ],
} as const;

export const studentNotifications = [
  { id: "notification-001", label: "Cambio de aula en Proyecto formativo", unread: true },
  { id: "notification-002", label: "Asistencia del 21 de agosto registrada", unread: false },
];
