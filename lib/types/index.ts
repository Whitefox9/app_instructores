export type UserRole = "admin" | "coordinador" | "instructor" | "estudiante";

export type IconName =
  | "layout-dashboard"
  | "building-2"
  | "map-pinned"
  | "users"
  | "shield-check"
  | "graduation-cap"
  | "book-open-text"
  | "folders"
  | "school"
  | "door-open"
  | "git-branch-plus"
  | "scan-search"
  | "sheet"
  | "house"
  | "calendar-days"
  | "clipboard-check"
  | "clipboard-list"
  | "user-round";

export type NavItem = {
  href: string;
  label: string;
  icon: IconName;
  badge?: string;
};

export type RoleProfile = {
  role: UserRole;
  label: string;
  initials: string;
  userName: string;
  userTitle: string;
  team: string;
  summary: string;
  quickAction: string;
  homeHref: string;
};

export type Metric = {
  label: string;
  value: string;
  helper: string;
  trend: string;
};

export type ActivityRow = {
  id: string;
  item: string;
  owner: string;
  status: "Al dia" | "En revision" | "Pendiente";
  updatedAt: string;
};

export type AssignmentItem = {
  id: string;
  title: string;
  location: string;
  time: string;
  status: "Programada" | "Requiere ajuste" | "Confirmada";
};

export type AgendaItem = {
  id: string;
  day: string;
  title: string;
  time: string;
  place: string;
};

export type DashboardData = {
  title: string;
  description: string;
  metrics: Metric[];
  activity: ActivityRow[];
  assignments: AssignmentItem[];
  agenda: AgendaItem[];
};

export type CoordinatorAcademicStatus = "Activo" | "En preparación" | "Requiere atención";
export type CoordinatorAvailability = "Disponible" | "Parcial" | "Completa";
export type CoordinatorAlertSeverity = "alta" | "media" | "baja";

export type CoordinatorMetric = {
  label: string;
  value: string;
  tone: "neutral" | "warning" | "danger";
  helper?: string;
};

export type CoordinatorAlert = {
  id: string;
  title: string;
  detail: string;
  severity: CoordinatorAlertSeverity;
  href: string;
};

export type CoordinatorFaculty = {
  id: string;
  name: string;
  campus: string;
  dean: string;
  programs: number;
  teachers: number;
  students: number;
};

export type CoordinatorTeacher = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  faculty: string;
  department: string;
  specialty: string;
  contractType: string;
  assignedHours: number;
  maximumHours: number;
  groups: number;
  availability: CoordinatorAvailability;
};

export type CoordinatorStudentSummary = {
  id: string;
  documentNumber: string;
  name: string;
  email: string;
  enrollmentStatus: "Matriculado" | "Pendiente";
};

export type CoordinatorAcademicGroup = {
  id: string;
  code: string;
  subject: string;
  program: string;
  faculty: string;
  period: string;
  modality: "Presencial" | "Virtual" | "Híbrida";
  schedule: string;
  teacher: string;
  classroom: string;
  students: number;
  capacity: number;
  status: CoordinatorAcademicStatus;
  roster: CoordinatorStudentSummary[];
};

export type CoordinatorClassroom = {
  id: string;
  code: string;
  name: string;
  campus: string;
  building: string;
  capacity: number;
  equipment: string[];
  status: "Disponible" | "Ocupada" | "Mantenimiento";
  nextAvailable: string;
};

export type CoordinatorScheduleAssignment = {
  id: string;
  groupCode: string;
  subject: string;
  teacher: string;
  classroom: string;
  day: string;
  time: string;
  status: "Confirmada" | "Pendiente" | "Conflicto";
};

export type CoordinatorTeachingLoad = {
  id: string;
  teacher: string;
  faculty: string;
  assignedHours: number;
  maximumHours: number;
  groups: number;
  status: "Equilibrada" | "Disponible" | "Sobrecarga";
};

export type CoordinatorImportBatch = {
  id: string;
  fileName: string;
  category: "Docentes" | "Estudiantes" | "Grupos" | "Aulas";
  records: number;
  validRecords: number;
  issues: number;
  uploadedAt: string;
  status: "Validado" | "Revisión";
};
export type ImportColumnStatus = "Valida" | "Advertencia" | "Invalida";
export type ImportRowStatus = "Valido" | "Con observaciones" | "Con error";
export type ImportIssueSeverity = "alta" | "media" | "baja";

export type ImportColumnReport = {
  key: string;
  label: string;
  mappedTo: string;
  status: ImportColumnStatus;
  coverage: string;
  detail: string;
};

export type ImportPreviewRow = {
  id: string;
  status: ImportRowStatus;
  values: Record<string, string>;
};

export type ImportIssue = {
  id: string;
  severity: ImportIssueSeverity;
  rowRef: string;
  column: string;
  message: string;
  recommendation: string;
};

export type ImportBatchSummary = {
  fileName: string;
  uploadedAt: string;
  sheetName: string;
  detectedEntity: string;
  recordsDetected: number;
  validRecords: number;
  warningRecords: number;
  errorRecords: number;
  processedPercent: number;
};

export type InstructorDependency = "Centro" | "Virtual";
export type InstructorAssignmentState = "Confirmada" | "Programada" | "Requiere ajuste";

export type InstructorAssignmentDetail = {
  id: string;
  group: string;
  programa: string;
  dependencia: InstructorDependency;
  sede: string;
  room: string;
  modalidad: string;
  jornada: string;
  horario: string;
  studentCount: number;
  estado: InstructorAssignmentState;
  novedades: string;
};

export type InstructorAgendaEntry = {
  id: string;
  dateLabel: string;
  dayName: string;
  startTime: string;
  endTime: string;
  title: string;
  group: string;
  programa: string;
  dependencia: InstructorDependency;
  sede: string;
  room: string;
  modalidad: string;
  note: string;
};

export type InstructorAttendanceState =
  | "Lista para registrar"
  | "Registrada"
  | "Pendiente cierre";

export type InstructorAttendanceEntry = {
  id: string;
  ficha: string;
  programa: string;
  dateLabel: string;
  expected: number;
  attended: number;
  pending: number;
  state: InstructorAttendanceState;
};

export type InstructorEvidenceState = "Cargada" | "Pendiente" | "Revisar";

export type InstructorEvidenceEntry = {
  id: string;
  ficha: string;
  programa: string;
  title: string;
  type: string;
  dueLabel: string;
  channel: string;
  state: InstructorEvidenceState;
};

export type InstructorAttendanceMark = "A" | "CE" | "SE" | "T";

export type InstructorAttendanceLearner = {
  id: string;
  apprentice: string;
  document: string;
  status: InstructorAttendanceMark | null;
  observation: string;
};

export type InstructorAttendanceHistoryRecord = {
  id: string;
  date: string;
  blockLabel: string;
  registeredAt: string;
  attendanceRate: number;
  counts: Record<InstructorAttendanceMark, number>;
  notes: string;
};

export type InstructorAttendanceSheet = {
  id: string;
  date: string;
  ficha: string;
  programa: string;
  jornada: string;
  ambiente?: string;
  instructor: string;
  horario: string;
  totalAprendices: number;
  learners: InstructorAttendanceLearner[];
  history: InstructorAttendanceHistoryRecord[];
};

export type InstructorAttendanceLearnerHistoryEntry = {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerDocument: string;
  date: string;
  status: InstructorAttendanceMark;
  observation: string;
  ficha: string;
  jornada: string;
  ambiente?: string;
};
