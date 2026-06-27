export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  isActive: boolean;
  createdAt: string;
  avatar?: string;
}

export interface Student {
  id: string;
  userId: string;
  studentId: string; // e.g., STU-2026-001
  departmentId: string;
  courseId: string;
  academicSessionId: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  office: string;
  departmentId: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string; // e.g., CS, EE
  head: string;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string; // e.g., BSC-CS, BTECH-EE
  departmentId: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string; // e.g., CS-101
  departmentId: string;
  courseId: string;
  teacherId: string; // ID of Teacher profile
  createdAt: string;
}

export interface TimetableSlot {
  id: string;
  subjectId: string;
  courseId: string;
  teacherId: string;
  room: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string; // e.g., "09:00"
  durationHours: number;
}

export interface Attendance {
  id: string;
  studentId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Excused' | 'Late';
  markedBy: string; // User ID
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'On Leave';
  markedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  instructions: string;
  subjectId: string;
  dueDate: string;
  departmentId: string;
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate: string;
  fileUrl: string;
  fileName: string;
  status: 'Submitted' | 'Graded';
  grade?: string; // e.g., "A", "95"
  feedback?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  fileType: 'PDF' | 'PPT' | 'Doc' | 'Link';
  fileUrl: string;
  fileName: string;
  subjectId: string;
  uploadedBy: string; // Teacher ID
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Academic' | 'Event' | 'Urgent' | 'General';
  date: string;
  author: string;
  isPinned: boolean;
}

export interface Result {
  id: string;
  studentId: string;
  subjectId: string;
  academicSessionId: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
}

export interface AcademicSession {
  id: string;
  name: string; // e.g., "Fall 2026", "Spring 2026"
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  lastModified: string;
}

export interface SystemSettings {
  campusName: string;
  academicYear: string;
  maxCapacity: number;
  enableNotifications: boolean;
  backupInterval: string;
  systemVersion: string;
}
