import { demoAcademicSystem } from "@/lib/demo/academic-system";
import { NavItem, RoleProfile, UserRole } from "@/lib/types";

const { instructor } = demoAcademicSystem;

export const roleProfiles: Record<UserRole, RoleProfile> = {
  admin: {
    role: "admin",
    label: "Administrador",
    initials: "AD",
    userName: "Paula Mendoza",
    userTitle: "Directora de Operaciones",
    team: "Gobierno de datos institucional",
    summary: "Control institucional, usuarios, sedes y auditoria de la plataforma.",
    quickAction: "Revisar auditoria semanal",
    homeHref: "/admin/dashboard",
  },
  coordinador: {
    role: "coordinador",
    label: "Coordinador",
    initials: "CO",
    userName: "Andres Cifuentes",
    userTitle: "Coordinador academico",
    team: "Operacion academica",
    summary: "Consola para docentes, grupos, aulas, horarios y planeacion academica.",
    quickAction: "Revisar asignaciones activas",
    homeHref: "/coordinador/dashboard",
  },
  instructor: {
    role: "instructor",
    label: "Docente",
    initials: instructor.initials,
    userName: instructor.name,
    userTitle: instructor.title,
    team: "Docencia universitaria",
    summary: "Consulta de agenda, grupos, detalle academico y asistencia.",
    quickAction: "Registrar asistencia",
    homeHref: "/instructor/inicio",
  },
  estudiante: {
    role: "estudiante",
    label: "Estudiante",
    initials: "DR",
    userName: "Daniel Rojas",
    userTitle: "Estudiante activo",
    team: "Programa academico",
    summary: "Consulta de horario, programa, asistencia y datos personales.",
    quickAction: "Ver proxima sesion",
    homeHref: "/estudiante/inicio",
  },
};

export const navigationByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { href: "/admin/centros", label: "Centros", icon: "building-2" },
    { href: "/admin/sedes", label: "Sedes", icon: "map-pinned" },
    { href: "/admin/usuarios", label: "Usuarios", icon: "users" },
    { href: "/admin/auditoria", label: "Auditoria", icon: "shield-check", badge: "24" },
  ],
  coordinador: [
    { href: "/coordinador/dashboard", label: "Resumen", icon: "layout-dashboard" },
    { href: "/coordinador/docentes", label: "Docentes", icon: "graduation-cap" },
    { href: "/coordinador/grupos", label: "Grupos", icon: "folders" },
    { href: "/coordinador/aulas", label: "Aulas", icon: "door-open" },
    { href: "/coordinador/programacion", label: "Programacion", icon: "calendar-days" },
    { href: "/coordinador/carga-docente", label: "Carga docente", icon: "clipboard-list" },
    { href: "/coordinador/importaciones", label: "Importaciones", icon: "sheet", badge: "Beta" },
    { href: "/coordinador/seguimiento", label: "Seguimiento", icon: "shield-check" },
  ],
  instructor: [
    { href: "/instructor/inicio", label: "Inicio", icon: "house" },
    { href: "/instructor/asistencia", label: "Asistencia", icon: "clipboard-check" },
    { href: "/instructor/mis-asignaciones", label: "Mis asignaciones", icon: "clipboard-list" },
    { href: "/instructor/agenda", label: "Agenda", icon: "calendar-days" },
  ],
  estudiante: [
    { href: "/estudiante/inicio", label: "Inicio", icon: "house" },
    { href: "/estudiante/horario", label: "Horario", icon: "calendar-days" },
    { href: "/estudiante/programa", label: "Programa", icon: "book-open-text" },
    { href: "/estudiante/asistencia", label: "Asistencia", icon: "clipboard-list" },
    { href: "/estudiante/perfil", label: "Perfil", icon: "user-round" },
  ],
};
