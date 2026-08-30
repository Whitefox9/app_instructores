import { demoAcademicSystem } from "@/lib/demo/academic-system";

const { flagshipGroup, flagshipSession, instructor, period, student } = demoAcademicSystem;

export const studentProfile = {
  id: student.id,
  name: student.name,
  shortName: student.shortName,
  initials: student.initials,
  document: `TI ${student.document}`,
  email: student.email,
  phone: student.phone,
  recordNumber: student.recordNumber,
  status: "Estudiante activo",
  campus: flagshipGroup.campus,
};

export const studentProgram = {
  group: flagshipGroup.number,
  name: flagshipGroup.program,
  progress: 68,
  schedule: flagshipGroup.shiftLabel,
  modality: flagshipGroup.modality,
  leadProfessor: instructor.name,
  period: period.studentRange,
};

export const studentSchedule = [
  {
    id: "session-001",
    group: flagshipGroup.number,
    day: "Lun",
    date: "24 Ago",
    time: `${flagshipSession.startTime}–${flagshipSession.endTime}`,
    subject: flagshipSession.title,
    professor: instructor.name,
    room: flagshipGroup.room,
    status: "Cambio reciente",
  },
  {
    id: "session-002",
    group: flagshipGroup.number,
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
    group: flagshipGroup.number,
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
  baselineSessions: 25,
  baselineEffective: 22,
  records: [
    { id: "attendance-001", date: "21 Ago", subject: "Diseño de interfaces web", status: "Asistió" },
    { id: "attendance-002", date: "20 Ago", subject: "Bases de datos", status: "Tardanza" },
    { id: "attendance-003", date: "18 Ago", subject: "Proyecto formativo", status: "Inasistencia" },
  ],
} as const;

export const studentNotifications = [
  { id: "notification-001", label: `Cambio de aula al ${flagshipGroup.room}`, unread: true },
  { id: "notification-002", label: "Asistencia del 21 de agosto registrada", unread: false },
];
