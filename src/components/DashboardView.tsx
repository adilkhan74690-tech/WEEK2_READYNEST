import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Building, 
  BookOpen, 
  Megaphone, 
  Clock, 
  ClipboardCheck, 
  Layers, 
  Award, 
  BookMarked, 
  FolderOpen, 
  FileUp, 
  Activity, 
  TrendingUp, 
  Plus, 
  Folder, 
  ExternalLink 
} from 'lucide-react';
import { 
  Role, 
  User, 
  Student, 
  Teacher, 
  Department, 
  Course, 
  Subject, 
  TimetableSlot, 
  Attendance, 
  Assignment, 
  AssignmentSubmission, 
  StudyMaterial, 
  Notice, 
  Result, 
  AcademicSession, 
  Note, 
  SystemSettings 
} from '../types';

interface DashboardViewProps {
  role: Role;
  currentUser: User | null;
  users: User[];
  students: Student[];
  teachers: Teacher[];
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  timetables: TimetableSlot[];
  attendance: Attendance[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  studyMaterials: StudyMaterial[];
  notices: Notice[];
  results: Result[];
  academicSessions: AcademicSession[];
  settings: SystemSettings;
  onNavigate: (tab: string) => void;
  activityLogs: string[];
}

export default function DashboardView({
  role,
  currentUser,
  users,
  students,
  teachers,
  departments,
  courses,
  subjects,
  timetables,
  attendance,
  assignments,
  assignmentSubmissions,
  studyMaterials,
  notices,
  results,
  academicSessions,
  settings,
  onNavigate,
  activityLogs = []
}: DashboardViewProps) {

  // Current day string helper
  const getTodayDay = (): 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const current = days[new Date().getDay()];
    if (current === 'Sunday' || current === 'Saturday') return 'Monday';
    return current as any;
  };
  const todayDay = getTodayDay();

  // Compute stats for Admin
  const totalStudentsCount = students.length;
  const totalTeachersCount = teachers.length;
  const totalDepartmentsCount = departments.length;
  const totalCoursesCount = courses.length;

  // Render Admin Dashboard
  if (role === 'ADMIN') {
    // Attendance Analytics calculation
    const totalAttendanceRecords = attendance.length;
    const presentCount = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const attendancePercentage = totalAttendanceRecords > 0 
      ? Math.round((presentCount / totalAttendanceRecords) * 100) 
      : 0;

    // Assignment Analytics calculation
    const totalAssCount = assignments.length;
    const totalSubCount = assignmentSubmissions.length;
    const submissionRate = totalAssCount > 0 && totalStudentsCount > 0 
      ? Math.round((totalSubCount / (totalAssCount * totalStudentsCount)) * 100) 
      : 0;

    return (
      <div className="space-y-6">
        {/* Title area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Control Center</h2>
            <p className="text-slate-500 text-sm mt-1">Hello, {currentUser?.name || 'Administrator'} • Running Academic Year {settings.academicYear}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onNavigate('settings')}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              System Settings
            </button>
            <button 
              onClick={() => onNavigate('notices')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Students */}
          <div 
            onClick={() => onNavigate('students')}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-xs border-l-4 border-l-indigo-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-indigo-600 font-bold text-[10px] bg-indigo-50 px-2 py-0.5 rounded-md">Students</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Students</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalStudentsCount}</h3>
            </div>
          </div>

          {/* Total Teachers */}
          <div 
            onClick={() => onNavigate('teachers')}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-xs border-l-4 border-l-emerald-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md">Teachers</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Teachers</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalTeachersCount}</h3>
            </div>
          </div>

          {/* Total Departments */}
          <div 
            onClick={() => onNavigate('departments')}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-xs border-l-4 border-l-amber-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
                <Building className="w-6 h-6" />
              </div>
              <span className="text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-md">Departments</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Departments</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalDepartmentsCount}</h3>
            </div>
          </div>

          {/* Total Courses */}
          <div 
            onClick={() => onNavigate('courses')}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between shadow-xs border-l-4 border-l-teal-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-teal-50 rounded-xl text-teal-700">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-teal-600 font-bold text-[10px] bg-teal-50 px-2 py-0.5 rounded-md">Courses</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Courses</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalCoursesCount}</h3>
            </div>
          </div>
        </div>

        {/* Analytics and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance & Assignment Analytics Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 lg:col-span-2 space-y-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Real-Time College Analytics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Attendance Analytics */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
                  <h4 className="text-4xl font-extrabold text-slate-800 mt-1">{attendancePercentage}%</h4>
                </div>
                {totalAttendanceRecords === 0 ? (
                  <p className="text-xs text-slate-400 mt-4 font-medium italic">No data available (Attendance ledger empty)</p>
                ) : (
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${attendancePercentage}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-2">Calculated from {totalAttendanceRecords} live daily roll-calls</span>
                  </div>
                )}
              </div>

              {/* Assignment Completion Analytics */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Submission Rate</span>
                  <h4 className="text-4xl font-extrabold text-slate-800 mt-1">{submissionRate}%</h4>
                </div>
                {totalAssCount === 0 || totalStudentsCount === 0 ? (
                  <p className="text-xs text-slate-400 mt-4 font-medium italic">No data available (No active assignments)</p>
                ) : (
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${submissionRate}%` }}></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-2">{totalSubCount} total uploads across {totalAssCount} assignments</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Summary State */}
            {totalStudentsCount === 0 && totalTeachersCount === 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
                College ledger is currently empty. Use the Student and Teacher directories to create new records.
              </div>
            )}
          </div>

          {/* Activity Logs & Notice Block */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-6">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>System Logs</span>
            </h3>

            {activityLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs text-center border border-dashed border-slate-200 rounded-2xl">
                <span>No data available</span>
                <span className="text-[10px] text-slate-300 mt-1">Actions you perform will be logged here</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {activityLogs.slice(0, 10).map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2.5">
                    <span className="text-[9px] text-indigo-500 font-mono mt-0.5">[{idx+1}]</span>
                    <span className="leading-relaxed font-semibold">{log}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Recent Broadcast notices */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-teal-600" />
              <span>Recent Notices</span>
            </h3>
            <button onClick={() => onNavigate('notices')} className="text-xs text-indigo-600 font-bold hover:underline">View All Board</button>
          </div>

          {notices.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
              No notices published on the central board.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.slice(0, 4).map((notif) => (
                <div key={notif.id} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                      notif.category === 'Urgent' ? 'bg-red-500/10 text-red-600' :
                      notif.category === 'Academic' ? 'bg-indigo-500/10 text-indigo-600' :
                      notif.category === 'Event' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-500/10 text-slate-600'
                    }`}>
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{notif.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-700 text-xs mt-2.5">{notif.title}</h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mt-1 leading-relaxed">{notif.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Teacher Dashboard
  if (role === 'TEACHER') {
    // Teacher Profile Identification
    const teacherProfile = teachers.find(t => t.userId === currentUser?.id);
    const assignedSubjects = teacherProfile ? subjects.filter(s => s.teacherId === teacherProfile.id) : [];
    const assignedSubjectIds = assignedSubjects.map(s => s.id);

    // Filter slots for today and teacher
    const todayClasses = teacherProfile 
      ? timetables.filter(t => t.teacherId === teacherProfile.id && t.day === todayDay) 
      : [];

    // Assignments submitted
    const submissionsCount = assignmentSubmissions.filter(s => 
      assignedSubjectIds.includes(assignments.find(a => a.id === s.assignmentId)?.subjectId || '')
    ).length;

    // Notice board
    const relevantNotices = notices.slice(0, 4);

    return (
      <div className="space-y-6">
        {/* Portal Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Faculty Dashboard</h2>
            <p className="text-slate-500 text-sm mt-1">Hello, Prof. {currentUser?.name} • Room Office: {teacherProfile?.office || 'N/A'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNavigate('mark_attendance')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer">
              <ClipboardCheck className="w-4 h-4" />
              <span>Mark Roll Call</span>
            </button>
            <button onClick={() => onNavigate('assignments')} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          </div>
        </div>

        {/* Teacher Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Enrolled Students */}
          <div onClick={() => onNavigate('students_records')} className="glass-card p-6 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-indigo-500">
            <div className="flex justify-between">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-indigo-600 font-bold text-[10px] bg-indigo-50 px-2 rounded-md">Students</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">My Total Students</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {students.filter(s => {
                  const dept = departments.find(d => d.id === s.departmentId);
                  return teacherProfile && dept && dept.id === teacherProfile.departmentId;
                }).length}
              </h3>
            </div>
          </div>

          {/* Assignments Uploaded */}
          <div onClick={() => onNavigate('assignments')} className="glass-card p-6 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-amber-500">
            <div className="flex justify-between">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-amber-600 font-bold text-[10px] bg-amber-50 px-2 rounded-md">Assessments</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Assignments</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {assignments.filter(a => assignedSubjectIds.includes(a.subjectId)).length}
              </h3>
            </div>
          </div>

          {/* Assignment Submissions received */}
          <div onClick={() => onNavigate('assignments')} className="glass-card p-6 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-emerald-500">
            <div className="flex justify-between">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                <FileUp className="w-5 h-5" />
              </div>
              <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 rounded-md">Submissions</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Submissions</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{submissionsCount}</h3>
            </div>
          </div>

          {/* Today classes count */}
          <div onClick={() => onNavigate('timetable')} className="glass-card p-6 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-teal-500">
            <div className="flex justify-between">
              <div className="p-3 bg-teal-50 rounded-xl text-teal-700">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-teal-600 font-bold text-[10px] bg-teal-50 px-2 rounded-md">Timetable</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Classes Today ({todayDay})</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{todayClasses.length}</h3>
            </div>
          </div>
        </div>

        {/* Dashboard Grid layouts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Classes List */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span>Today's Academic Classes ({todayDay})</span>
            </h3>

            {todayClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs text-center border border-dashed border-slate-200 rounded-2xl">
                <span>No classes scheduled for today</span>
                <span className="text-[10px] text-slate-300 mt-1">Schedules are dynamically synced with Admin parameters</span>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls) => {
                  const sub = subjects.find(s => s.id === cls.subjectId);
                  const crs = courses.find(c => c.id === cls.courseId);
                  return (
                    <div key={cls.id} className="p-4 bg-slate-50 border border-slate-200 hover:border-emerald-300 rounded-xl flex justify-between items-center transition-all">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{sub ? sub.name : 'Unknown Subject'} ({sub?.code})</p>
                        <p className="text-slate-400 text-xs mt-1">Course: {crs ? crs.name : 'N/A'} • Duration: {cls.durationHours} hrs</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-mono text-xs font-bold">{cls.time}</span>
                        <p className="text-slate-400 text-[10px] mt-1">Room: {cls.room}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-400">Quick Faculty Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => onNavigate('mark_attendance')} className="w-full p-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 rounded-xl flex items-center gap-3 transition-all text-xs font-bold text-slate-700 text-left">
                <ClipboardCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p>Register Roll Call</p>
                  <span className="text-[10px] text-slate-400 font-normal">Record present/absent student coordinates</span>
                </div>
              </button>

              <button onClick={() => onNavigate('upload_notes')} className="w-full p-4 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center gap-3 transition-all text-xs font-bold text-slate-700 text-left">
                <FileUp className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <p>Upload PPT / Lecture Note</p>
                  <span className="text-[10px] text-slate-400 font-normal">Share resources and PDFs with class students</span>
                </div>
              </button>

              <button onClick={() => onNavigate('post_notices')} className="w-full p-4 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-xl flex items-center gap-3 transition-all text-xs font-bold text-slate-700 text-left">
                <Megaphone className="w-5 h-5 text-teal-500 shrink-0" />
                <div>
                  <p>Post News / Urgent Notice</p>
                  <span className="text-[10px] text-slate-400 font-normal">Broadcast alerts to notice board listings</span>
                </div>
              </button>

              <button onClick={() => onNavigate('internal_marks')} className="w-full p-4 bg-slate-50 hover:bg-amber-50 hover:text-amber-800 border border-slate-200 hover:border-amber-300 rounded-xl flex items-center gap-3 transition-all text-xs font-bold text-slate-700 text-left">
                <Award className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p>Grade Exams / Publish Marks</p>
                  <span className="text-[10px] text-slate-400 font-normal">Update marks for internal/external logs</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Notices */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-teal-600" />
            <span>Campus Announcements</span>
          </h3>

          {relevantNotices.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
              No central notice logs registered yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantNotices.map((notif) => (
                <div key={notif.id} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[9px] font-bold uppercase tracking-wider">
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{notif.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-700 text-xs mt-2.5">{notif.title}</h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mt-1 leading-relaxed">{notif.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Student Dashboard
  if (role === 'STUDENT') {
    // Locate student profile
    const studentProfile = students.find(s => s.userId === currentUser?.id);
    const studentDept = studentProfile ? departments.find(d => d.id === studentProfile.departmentId) : null;
    const studentCourse = studentProfile ? courses.find(c => c.id === studentProfile.courseId) : null;

    // Filter subjects matching student course
    const enrolledSubjects = studentProfile ? subjects.filter(s => s.courseId === studentProfile.courseId) : [];
    const enrolledSubjectIds = enrolledSubjects.map(s => s.id);

    // Dynamic Attendance Percentage
    const myAttendance = studentProfile ? attendance.filter(a => a.studentId === studentProfile.id) : [];
    const totalRolls = myAttendance.length;
    const presentRolls = myAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const studentAttendancePct = totalRolls > 0 ? Math.round((presentRolls / totalRolls) * 100) : 0;

    // Filter classes today matching student's course
    const todayClasses = studentProfile 
      ? timetables.filter(t => t.courseId === studentProfile.courseId && t.day === todayDay)
      : [];

    // Filter pending assignments for enrolled subjects
    const myAssignments = assignments.filter(a => enrolledSubjectIds.includes(a.subjectId));
    const pendingAssignments = myAssignments.filter(a => {
      const subStatus = assignmentSubmissions.find(s => s.assignmentId === a.id && s.studentId === studentProfile?.id);
      return !subStatus;
    });

    // Recent study materials
    const recentMaterials = studyMaterials.filter(m => enrolledSubjectIds.includes(m.subjectId)).slice(0, 3);

    // Latest notices
    const latestNotices = notices.slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Student Portal Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Student Workspace</h2>
            <p className="text-slate-500 text-sm mt-1">
              Welcome back, {currentUser?.name} • ID: {studentProfile?.studentId || 'N/A'} • Course: {studentCourse ? studentCourse.name : 'N/A'}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('assignments')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer">
              <BookOpen className="w-4 h-4" />
              <span>Pending Tasks ({pendingAssignments.length})</span>
            </button>
            <button onClick={() => onNavigate('results')} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer">
              View Grades
            </button>
          </div>
        </div>

        {/* Metric Cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Attendance Indicator */}
          <div onClick={() => onNavigate('attendance')} className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${studentAttendancePct >= 75 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {studentAttendancePct >= 75 ? 'Eligible' : 'Low'}
              </span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Attendance Rate</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{studentAttendancePct}%</h3>
            </div>
          </div>

          {/* Pending Tasks */}
          <div onClick={() => onNavigate('assignments')} className="glass-card p-6 rounded-2xl border-l-4 border-l-indigo-500 shadow-xs hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-indigo-600 font-bold text-[10px] bg-indigo-50 px-2 rounded-md">Tasks</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Assignments</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{pendingAssignments.length}</h3>
            </div>
          </div>

          {/* Enrolled Subjects count */}
          <div className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 shadow-xs">
            <div className="flex justify-between">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
                <BookMarked className="w-5 h-5" />
              </div>
              <span className="text-amber-600 font-bold text-[10px] bg-amber-50 px-2 rounded-md">Active</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Registered Subjects</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{enrolledSubjects.length}</h3>
            </div>
          </div>

          {/* Today scheduled classes */}
          <div onClick={() => onNavigate('timetable')} className="glass-card p-6 rounded-2xl border-l-4 border-l-teal-500 shadow-xs hover:shadow-md transition-all cursor-pointer">
            <div className="flex justify-between">
              <div className="p-3 bg-teal-50 rounded-xl text-teal-700">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-teal-600 font-bold text-[10px] bg-teal-50 px-2 rounded-md">Classes</span>
            </div>
            <div className="mt-5">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">My Classes Today</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{todayClasses.length}</h3>
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Card Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Schedule */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              <span>My Today's Class Lectures ({todayDay})</span>
            </h3>

            {todayClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs text-center border border-dashed border-slate-200 rounded-2xl">
                <span>No scheduled lectures for today</span>
                <span className="text-[10px] text-slate-300 mt-1">Please confirm active timetable assignments with admin</span>
              </div>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((cls) => {
                  const sub = subjects.find(s => s.id === cls.subjectId);
                  const teach = teachers.find(t => t.id === cls.teacherId);
                  const teachUser = teach ? users.find(u => u.id === teach.userId) : null;
                  return (
                    <div key={cls.id} className="p-4 bg-slate-50 border border-slate-200 hover:border-emerald-300 rounded-xl flex justify-between items-center transition-all">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{sub ? sub.name : 'Lecture'} ({sub?.code})</p>
                        <p className="text-slate-400 text-xs mt-1">Professor: {teachUser ? teachUser.name : 'TBD'} • Office: {teach?.office || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-mono text-xs font-bold">{cls.time}</span>
                        <p className="text-slate-400 text-[10px] mt-1">Room: {cls.room}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Study Materials Card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-500" />
              <span>Recent Materials</span>
            </h3>

            {recentMaterials.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs text-center border border-dashed border-slate-200 rounded-2xl">
                <span>No resources uploaded yet</span>
                <span className="text-[10px] text-slate-300 mt-1">Teacher uploads will instantly stream here</span>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMaterials.map((mat) => {
                  const sub = subjects.find(s => s.id === mat.subjectId);
                  return (
                    <div key={mat.id} className="p-3 bg-slate-50 hover:bg-indigo-50/20 border border-slate-100 rounded-xl flex justify-between items-center transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold shrink-0">
                          {mat.fileType}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700 line-clamp-1">{mat.title}</p>
                          <span className="text-[10px] text-slate-400 block">{sub ? sub.code : 'Material'}</span>
                        </div>
                      </div>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert(`Downloading: ${mat.fileName || mat.title}`); }} 
                        className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Notice announcements */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-teal-600" />
            <span>Campus Board Updates</span>
          </h3>

          {latestNotices.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl">
              Notice board is empty.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestNotices.map((notif) => (
                <div key={notif.id} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-200 transition-colors">
                  <div className="flex justify-between items-start gap-3">
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[9px] font-bold uppercase tracking-wider">
                      {notif.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{notif.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-700 text-xs mt-2.5">{notif.title}</h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2 mt-1 leading-relaxed">{notif.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
