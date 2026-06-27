import { Department, Notice, Assignment, TimetableSlot, Student, SystemSettings, Note } from '../types';

export const initialDepartments: Department[] = [];
export const initialNotices: Notice[] = [];
export const initialAssignments: Assignment[] = [];
export const initialClassSlots: TimetableSlot[] = [];
export const initialStudentAttendance: Student[] = [];

export const initialSystemSettings: SystemSettings = {
  campusName: 'EduCore College Campus',
  academicYear: '2026-2027',
  maxCapacity: 5000,
  enableNotifications: true,
  backupInterval: 'Daily',
  systemVersion: '2.0.0'
};

export const initialNotes: Note[] = [];
