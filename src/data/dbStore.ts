import {
  User,
  Student,
  Teacher,
  Department,
  Course,
  Subject,
  TimetableSlot,
  Attendance,
  TeacherAttendance,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  Notice,
  Result,
  AcademicSession,
  Note,
  SystemSettings
} from '../types';

// Simple UUID generator
export const uuid = () => Math.random().toString(36).substring(2, 11);

// Standard Database Store Interface
export interface DBStore {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  timetables: TimetableSlot[];
  attendance: Attendance[];
  teacher_attendance: TeacherAttendance[];
  assignments: Assignment[];
  assignment_submissions: AssignmentSubmission[];
  study_materials: StudyMaterial[];
  notices: Notice[];
  results: Result[];
  academic_sessions: AcademicSession[];
  notes: Note[];
  settings: SystemSettings;
  currentUser: User | null;
  token: string | null;
}

const DEFAULT_SETTINGS: SystemSettings = {
  campusName: 'Smart Campus University',
  academicYear: '2026-2027',
  maxCapacity: 5000,
  enableNotifications: true,
  backupInterval: 'Daily',
  systemVersion: '2.0.0'
};

const STORAGE_KEY = 'educore_erp_db';

// Pre-populated high-quality seed data
const seedUsers: User[] = [
  { id: 'usr-admin', name: 'Dr. Jane Admin', email: 'admin@college.edu', role: 'ADMIN', passwordHash: 'admin123', isActive: true, createdAt: new Date().toISOString() }
];

const seedDepts: Department[] = [
  { id: 'dept-cs', name: 'Computer Science & Engineering', code: 'CS', head: 'Prof. Alan Turing', createdAt: new Date().toISOString() },
  { id: 'dept-phys', name: 'Physics & Quantum Mechanics', code: 'PHYS', head: 'Prof. Richard Feynman', createdAt: new Date().toISOString() }
];

const seedCourses: Course[] = [
  { id: 'crs-bsc-cs', name: 'B.Sc Computer Science', code: 'BSC-CS', departmentId: 'dept-cs', createdAt: new Date().toISOString() },
  { id: 'crs-msc-qm', name: 'M.Sc Quantum Mechanics', code: 'MSC-QM', departmentId: 'dept-phys', createdAt: new Date().toISOString() }
];

const seedTeachers: Teacher[] = [];

const seedStudents: Student[] = [];

const seedSubjects: Subject[] = [
  { id: 'sub-db', name: 'Advanced Databases', code: 'CS-102', departmentId: 'dept-cs', courseId: 'crs-bsc-cs', teacherId: '', createdAt: new Date().toISOString() },
  { id: 'sub-quantum', name: 'Quantum Electrodynamics', code: 'PHYS-205', departmentId: 'dept-phys', courseId: 'crs-msc-qm', teacherId: '', createdAt: new Date().toISOString() }
];

const seedTimetables: TimetableSlot[] = [
  { id: 'slot-1', subjectId: 'sub-db', courseId: 'crs-bsc-cs', teacherId: '', room: 'Lab-1', day: 'Monday', time: '09:00', durationHours: 2 },
  { id: 'slot-2', subjectId: 'sub-quantum', courseId: 'crs-msc-qm', teacherId: '', room: 'Hall B', day: 'Wednesday', time: '11:00', durationHours: 1 }
];

const seedNotices: Notice[] = [
  { id: 'not-1', title: 'Midterm schedule published', content: 'Mid-term theory evaluations are slated to begin starting October 5th. Review timetables under the schedule tab.', category: 'Academic', date: new Date().toLocaleDateString(), author: 'Office of Super Admin', isPinned: true }
];

const seedSessions: AcademicSession[] = [
  { id: 'sess-fall', name: 'Fall Term 2026', isActive: true, startDate: '2026-09-01', endDate: '2026-12-20' }
];

export function getDB(): DBStore {
  let db: DBStore;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    db = {
      users: seedUsers,
      students: seedStudents,
      teachers: seedTeachers,
      departments: seedDepts,
      courses: seedCourses,
      subjects: seedSubjects,
      timetables: seedTimetables,
      attendance: [],
      teacher_attendance: [],
      assignments: [],
      assignment_submissions: [],
      study_materials: [],
      notices: seedNotices,
      results: [],
      academic_sessions: seedSessions,
      notes: [],
      settings: DEFAULT_SETTINGS,
      currentUser: null,
      token: null
    };
    saveDB(db);
  } else {
    try {
      db = JSON.parse(data);
    } catch (e) {
      db = {
        users: seedUsers,
        students: seedStudents,
        teachers: seedTeachers,
        departments: seedDepts,
        courses: seedCourses,
        subjects: seedSubjects,
        timetables: seedTimetables,
        attendance: [],
        teacher_attendance: [],
        assignments: [],
        assignment_submissions: [],
        study_materials: [],
        notices: seedNotices,
        results: [],
        academic_sessions: seedSessions,
        notes: [],
        settings: DEFAULT_SETTINGS,
        currentUser: null,
        token: null
      };
      saveDB(db);
    }
  }

  // Intercept and merge token/user credentials set by backend login route
  if (typeof window !== "undefined") {
    const directToken = localStorage.getItem("token");
    const directUserStr = localStorage.getItem("user");
    if (directToken && directUserStr) {
      try {
        const directUser = JSON.parse(directUserStr);
        db.token = directToken;
        db.currentUser = directUser;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      } catch (err) {
        console.error("Failed to parse direct user session:", err);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }

  return db;
}

export function saveDB(db: DBStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

  // Asynchronously sync local updates with MySQL database
  if (typeof window !== "undefined") {
    fetch("https://week2-readynest.onrender.com/api/db/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(db),
    }).catch((err) => {
      console.error("Failed to sync DB changes with server:", err);
    });
  }
}

export function clearDB() {
  localStorage.removeItem(STORAGE_KEY);
  return getDB();
}

// Startup Sync: Handshake local cache with MySQL backend state
if (typeof window !== "undefined") {
  let isSyncing = false;
  const initialSync = async () => {
    if (isSyncing) return;
    isSyncing = true;
    try {
      const res = await fetch("https://week2-readynest.onrender.com/api/db");
      if (res.ok) {
        const serverDb = await res.json();
        const localDataStr = localStorage.getItem(STORAGE_KEY);
        let localDb: DBStore | null = null;
        if (localDataStr) {
          try {
            localDb = JSON.parse(localDataStr);
          } catch (e) { }
        }

        const mergedDb: DBStore = {
          ...serverDb,
          currentUser: localDb ? localDb.currentUser : null,
          token: localDb ? localDb.token : null,
        };

        const mergedDbStr = JSON.stringify(mergedDb);
        if (localDataStr !== mergedDbStr) {
          localStorage.setItem(STORAGE_KEY, mergedDbStr);
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Initial database handshake failed:", err);
    } finally {
      isSyncing = false;
    }
  };

  setTimeout(initialSync, 100);
}
