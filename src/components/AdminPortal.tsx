import React, { useState } from 'react';
import { 
  Building, 
  Layers, 
  BookMarked, 
  Users, 
  User, 
  CalendarDays, 
  Megaphone, 
  Award, 
  FileEdit, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Check, 
  ShieldAlert, 
  ToggleLeft, 
  ToggleRight, 
  Eye, 
  Lock,
  Clock,
  Briefcase
} from 'lucide-react';
import { 
  User as UserType, 
  Student, 
  Teacher, 
  Department, 
  Course, 
  Subject, 
  TimetableSlot, 
  Notice, 
  Result, 
  AcademicSession, 
  Note, 
  SystemSettings 
} from '../types';

interface AdminPortalProps {
  currentTab: string;
  currentUser: UserType | null;
  users: UserType[];
  students: Student[];
  teachers: Teacher[];
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  timetables: TimetableSlot[];
  notices: Notice[];
  results: Result[];
  academicSessions: AcademicSession[];
  notes: Note[];
  settings: SystemSettings;
  onNavigate: (tab: string) => void;
  // State updaters
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  setTimetables: React.Dispatch<React.SetStateAction<TimetableSlot[]>>;
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
  setAcademicSessions: React.Dispatch<React.SetStateAction<AcademicSession[]>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  logActivity: (msg: string) => void;
}

export default function AdminPortal({
  currentTab,
  currentUser,
  users,
  students,
  teachers,
  departments,
  courses,
  subjects,
  timetables,
  notices,
  results,
  academicSessions,
  notes,
  settings,
  onNavigate,
  setUsers,
  setStudents,
  setTeachers,
  setDepartments,
  setCourses,
  setSubjects,
  setTimetables,
  setNotices,
  setResults,
  setAcademicSessions,
  setNotes,
  setSettings,
  logActivity
}: AdminPortalProps) {

  // Search filter query
  const [query, setQuery] = useState('');

  // Editing state variables
  const [editId, setEditId] = useState<string | null>(null);

  // Forms states
  // Department form
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHead, setDeptHead] = useState('');

  // Course form
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDept, setCourseDept] = useState('');

  // Subject form
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subDept, setSubDept] = useState('');
  const [subCourse, setSubCourse] = useState('');
  const [subTeacher, setSubTeacher] = useState('');

  // Student form
  const [stuName, setStuName] = useState('');
  const [stuEmail, setStuEmail] = useState('');
  const [stuPassword, setStuPassword] = useState('student123');
  const [stuId, setStuId] = useState('');
  const [stuDept, setStuDept] = useState('');
  const [stuCourse, setStuCourse] = useState('');
  const [stuSession, setStuSession] = useState('');

  // Teacher form
  const [teaName, setTeaName] = useState('');
  const [teaEmail, setTeaEmail] = useState('');
  const [teaPassword, setTeaPassword] = useState('teacher123');
  const [teaOffice, setTeaOffice] = useState('');
  const [teaDept, setTeaDept] = useState('');

  // Timetable form
  const [timeSub, setTimeSub] = useState('');
  const [timeCourse, setTimeCourse] = useState('');
  const [timeTeacher, setTimeTeacher] = useState('');
  const [timeRoom, setTimeRoom] = useState('');
  const [timeDay, setTimeDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [timeSlot, setTimeSlot] = useState('09:00');
  const [timeDuration, setTimeDuration] = useState(1);

  // Notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCat, setNoticeCat] = useState<'Academic' | 'Event' | 'Urgent' | 'General'>('Academic');
  const [noticePinned, setNoticePinned] = useState(false);

  // Result form
  const [resStu, setResStu] = useState('');
  const [resSub, setResSub] = useState('');
  const [resSession, setResSession] = useState('');
  const [resInternal, setResInternal] = useState(0);
  const [resExternal, setResExternal] = useState(0);

  // Academic Session form
  const [sessName, setSessName] = useState('');
  const [sessStart, setSessStart] = useState('');
  const [sessEnd, setSessEnd] = useState('');

  // System Note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCat, setNoteCat] = useState('General');

  // Password reset helper state
  const [resettingUserEmail, setResettingUserEmail] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');

  // ----------------------------------------------------
  // CRUD ACTIONS
  // ----------------------------------------------------

  // 1. Departments
  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptCode || !deptHead) return;
    const isDuplicate = departments.some(d => d.code.toUpperCase() === deptCode.toUpperCase());
    if (isDuplicate) {
      alert('Department Code already exists!');
      return;
    }
    const newDept = {
      id: Math.random().toString(36).substring(2, 9),
      name: deptName,
      code: deptCode.toUpperCase(),
      head: deptHead,
      createdAt: new Date().toISOString()
    };
    setDepartments(prev => [...prev, newDept]);
    logActivity(`Created Department ${newDept.code} - ${newDept.name}`);
    // Reset Form
    setDeptName('');
    setDeptCode('');
    setDeptHead('');
  };

  const handleDeleteDept = (id: string, code: string) => {
    if (!window.confirm(`Delete department ${code}? All related students and teachers will be affected.`)) return;
    setDepartments(prev => prev.filter(d => d.id !== id));
    logActivity(`Deleted Department ${code}`);
  };

  // 2. Courses
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseName || !courseCode || !courseDept) return;
    const isDuplicate = courses.some(c => c.code.toUpperCase() === courseCode.toUpperCase());
    if (isDuplicate) {
      alert('Course Code already exists!');
      return;
    }
    const newCrs = {
      id: Math.random().toString(36).substring(2, 9),
      name: courseName,
      code: courseCode.toUpperCase(),
      departmentId: courseDept,
      createdAt: new Date().toISOString()
    };
    setCourses(prev => [...prev, newCrs]);
    logActivity(`Created Course ${newCrs.code} in ${departments.find(d => d.id === courseDept)?.code}`);
    setCourseName('');
    setCourseCode('');
  };

  const handleDeleteCourse = (id: string, code: string) => {
    if (!window.confirm(`Delete course ${code}?`)) return;
    setCourses(prev => prev.filter(c => c.id !== id));
    logActivity(`Deleted Course ${code}`);
  };

  // 3. Subjects
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName || !subCode || !subDept || !subCourse) return;
    const isDuplicate = subjects.some(s => s.code.toUpperCase() === subCode.toUpperCase());
    if (isDuplicate) {
      alert('Subject Code already exists!');
      return;
    }
    const newSub = {
      id: Math.random().toString(36).substring(2, 9),
      name: subName,
      code: subCode.toUpperCase(),
      departmentId: subDept,
      courseId: subCourse,
      teacherId: subTeacher || '',
      createdAt: new Date().toISOString()
    };
    setSubjects(prev => [...prev, newSub]);
    logActivity(`Created Subject ${newSub.code} - ${newSub.name}`);
    setSubName('');
    setSubCode('');
  };

  const handleDeleteSubject = (id: string, code: string) => {
    if (!window.confirm(`Delete subject ${code}?`)) return;
    setSubjects(prev => prev.filter(s => s.id !== id));
    logActivity(`Deleted Subject ${code}`);
  };

  // 4. Students
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stuName || !stuEmail || !stuId || !stuDept || !stuCourse || !stuSession) return;
    if (users.some(u => u.email.toLowerCase() === stuEmail.toLowerCase())) {
      alert('Email already registered!');
      return;
    }
    if (students.some(s => s.studentId.toUpperCase() === stuId.toUpperCase())) {
      alert('Student ID already exists!');
      return;
    }

    const userId = Math.random().toString(36).substring(2, 9);
    const studentProfileId = Math.random().toString(36).substring(2, 9);

    const newUser: UserType = {
      id: userId,
      name: stuName,
      email: stuEmail.toLowerCase(),
      role: 'STUDENT',
      passwordHash: stuPassword,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const newStudent: Student = {
      id: studentProfileId,
      userId: userId,
      studentId: stuId.toUpperCase(),
      departmentId: stuDept,
      courseId: stuCourse,
      academicSessionId: stuSession,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setStudents(prev => [...prev, newStudent]);
    logActivity(`Registered Student ${newStudent.studentId} - ${newUser.name}`);

    setStuName('');
    setStuEmail('');
    setStuId('');
  };

  const handleDeleteStudent = (studentId: string, name: string) => {
    if (!window.confirm(`Delete student ${name}? This will remove both account & student profile records.`)) return;
    const student = students.find(s => s.id === studentId);
    if (student) {
      setUsers(prev => prev.filter(u => u.id !== student.userId));
      setStudents(prev => prev.filter(s => s.id !== studentId));
      logActivity(`Deleted Student profile for ${name}`);
    }
  };

  // 5. Teachers
  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teaName || !teaEmail || !teaDept || !teaOffice) return;
    if (users.some(u => u.email.toLowerCase() === teaEmail.toLowerCase())) {
      alert('Email already registered!');
      return;
    }

    const userId = Math.random().toString(36).substring(2, 9);
    const teacherProfileId = Math.random().toString(36).substring(2, 9);

    const newUser: UserType = {
      id: userId,
      name: teaName,
      email: teaEmail.toLowerCase(),
      role: 'TEACHER',
      passwordHash: teaPassword,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const newTeacher: Teacher = {
      id: teacherProfileId,
      userId: userId,
      office: teaOffice,
      departmentId: teaDept,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    setTeachers(prev => [...prev, newTeacher]);
    logActivity(`Registered Teacher Prof. ${newUser.name}`);

    setTeaName('');
    setTeaEmail('');
    setTeaOffice('');
  };

  const handleDeleteTeacher = (teacherId: string, name: string) => {
    if (!window.confirm(`Delete teacher ${name}? This will remove both account & profile records.`)) return;
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      setUsers(prev => prev.filter(u => u.id !== teacher.userId));
      setTeachers(prev => prev.filter(t => t.id !== teacherId));
      // Reset subject teacher associations
      setSubjects(prev => prev.map(s => s.teacherId === teacherId ? { ...s, teacherId: '' } : s));
      logActivity(`Deleted Teacher profile for ${name}`);
    }
  };

  // Toggle user active status
  const handleToggleUserActive = (userId: string, email: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !u.isActive } : u));
    logActivity(`Toggled Account Status for ${email}`);
  };

  // Password reset submit
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUserEmail || !newPasswordVal) return;
    setUsers(prev => prev.map(u => u.email === resettingUserEmail ? { ...u, passwordHash: newPasswordVal } : u));
    logActivity(`Admin reset password coordinates for ${resettingUserEmail}`);
    alert(`Password updated successfully for ${resettingUserEmail}`);
    setResettingUserEmail(null);
    setNewPasswordVal('');
  };

  // 6. Timetable Slot
  const handleAddTimetableSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeSub || !timeCourse || !timeTeacher || !timeRoom || !timeSlot) return;

    const newSlot: TimetableSlot = {
      id: Math.random().toString(36).substring(2, 9),
      subjectId: timeSub,
      courseId: timeCourse,
      teacherId: timeTeacher,
      room: timeRoom,
      day: timeDay,
      time: timeSlot,
      durationHours: Number(timeDuration)
    };

    setTimetables(prev => [...prev, newSlot]);
    logActivity(`Added Timetable Lecture on ${timeDay} at ${timeSlot} for Subject ID: ${timeSub}`);
    setTimeRoom('');
  };

  const handleDeleteTimetableSlot = (id: string) => {
    if (!window.confirm('Remove this class slot?')) return;
    setTimetables(prev => prev.filter(t => t.id !== id));
    logActivity(`Deleted Class Lecture Slot`);
  };

  // 7. Notice Board
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    const newNotice: Notice = {
      id: Math.random().toString(36).substring(2, 9),
      title: noticeTitle,
      content: noticeContent,
      category: noticeCat,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: currentUser?.name || 'Administrator',
      isPinned: noticePinned
    };

    setNotices(prev => [newNotice, ...prev]);
    logActivity(`Published Notice: ${newNotice.title}`);
    setNoticeTitle('');
    setNoticeContent('');
    setNoticePinned(false);
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    logActivity(`Deleted Notice`);
  };

  // 8. Results / Mark sheet
  const handleAddResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resStu || !resSub || !resSession) return;

    const total = Number(resInternal) + Number(resExternal);
    let grade = 'F';
    if (total >= 90) grade = 'A+';
    else if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B';
    else if (total >= 60) grade = 'C';
    else if (total >= 50) grade = 'D';

    const newResult: Result = {
      id: Math.random().toString(36).substring(2, 9),
      studentId: resStu,
      subjectId: resSub,
      academicSessionId: resSession,
      internalMarks: Number(resInternal),
      externalMarks: Number(resExternal),
      totalMarks: total,
      grade
    };

    setResults(prev => [...prev, newResult]);
    logActivity(`Logged Exam Results for Student`);
    setResInternal(0);
    setResExternal(0);
  };

  const handleDeleteResult = (id: string) => {
    setResults(prev => prev.filter(r => r.id !== id));
    logActivity('Deleted Academic Result record');
  };

  // 9. Notes
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    const newNote: Note = {
      id: Math.random().toString(36).substring(2, 9),
      title: noteTitle,
      content: noteContent,
      category: noteCat,
      lastModified: new Date().toLocaleDateString()
    };

    setNotes(prev => [newNote, ...prev]);
    logActivity(`Added Memo Note: ${newNote.title}`);
    setNoteTitle('');
    setNoteContent('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    logActivity('Deleted Admin Note');
  };


  // ----------------------------------------------------
  // RENDER PORTALS CORRESPONDING TABS
  // ----------------------------------------------------

  // 1. DEPARTMENTS TAB
  if (currentTab === 'departments') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Departments Directory</h2>
          <p className="text-xs text-slate-400 mt-1">Configure academic departments, manage codes and assign heads.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Create form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Create Department</span>
            </h3>
            <form onSubmit={handleAddDept} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department Name</label>
                <input 
                  type="text" required value={deptName} onChange={e => setDeptName(e.target.value)}
                  placeholder="Computer Science & Engineering"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Unique Code</label>
                  <input 
                    type="text" required value={deptCode} onChange={e => setDeptCode(e.target.value)}
                    placeholder="CS"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department Head</label>
                  <input 
                    type="text" required value={deptHead} onChange={e => setDeptHead(e.target.value)}
                    placeholder="Dr. Alan Turing"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Submit Records
              </button>
            </form>
          </div>

          {/* List display */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Departments ({departments.length})</span>
            </div>

            {departments.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Add a department record to begin.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {departments.map((dept) => {
                  const studentCount = students.filter(s => s.departmentId === dept.id).length;
                  const facultyCount = teachers.filter(t => t.departmentId === dept.id).length;
                  return (
                    <div key={dept.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{dept.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Code: <span className="font-bold text-slate-600">{dept.code}</span> • HOD: {dept.head}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right text-xs">
                          <p className="text-slate-500 font-semibold">{studentCount} Students</p>
                          <p className="text-[10px] text-slate-400">{facultyCount} Teachers</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteDept(dept.id, dept.code)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. COURSES TAB
  if (currentTab === 'courses') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Courses Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">Manage academic degree courses associated with specific departments.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Create Course</span>
            </h3>
            <form onSubmit={handleAddCourse} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Course Title</label>
                <input 
                  type="text" required value={courseName} onChange={e => setCourseName(e.target.value)}
                  placeholder="B.Sc Computer Science"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Course Code</label>
                  <input 
                    type="text" required value={courseCode} onChange={e => setCourseCode(e.target.value)}
                    placeholder="BSC-CS"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <select 
                    required value={courseDept} onChange={e => setCourseDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.code}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Publish Course
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Courses ({courses.length})</span>
            </div>

            {courses.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Please create a course record.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {courses.map((crs) => {
                  const dept = departments.find(d => d.id === crs.departmentId);
                  const enrolledCount = students.filter(s => s.courseId === crs.id).length;
                  return (
                    <div key={crs.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{crs.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">Code: <span className="font-bold text-slate-600">{crs.code}</span> • Department: {dept ? dept.name : 'Unknown'}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full">{enrolledCount} Registered</span>
                        <button 
                          onClick={() => handleDeleteCourse(crs.id, crs.code)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. SUBJECTS TAB
  if (currentTab === 'subjects') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Academic Subjects</h2>
          <p className="text-xs text-slate-400 mt-1">Manage class subjects, code registry, and assign teaching staff.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Create Subject</span>
            </h3>
            <form onSubmit={handleAddSubject} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject Title</label>
                <input 
                  type="text" required value={subName} onChange={e => setSubName(e.target.value)}
                  placeholder="Advanced Database Systems"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject Code</label>
                  <input 
                    type="text" required value={subCode} onChange={e => setSubCode(e.target.value)}
                    placeholder="CS-101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <select 
                    required value={subDept} onChange={e => setSubDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.code}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Course Code</label>
                  <select 
                    required value={subCourse} onChange={e => setSubCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Faculty Teacher</label>
                  <select 
                    value={subTeacher} onChange={e => setSubTeacher(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">No Teacher Assigned</option>
                    {teachers.map(t => {
                      const u = users.find(usr => usr.id === t.userId);
                      return <option key={t.id} value={t.id}>{u ? u.name : 'TBD'}</option>;
                    })}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Confirm Subject
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Subject Modules ({subjects.length})</span>
            </div>

            {subjects.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Add a subject.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {subjects.map((sub) => {
                  const dept = departments.find(d => d.id === sub.departmentId);
                  const crs = courses.find(c => c.id === sub.courseId);
                  const teach = teachers.find(t => t.id === sub.teacherId);
                  const teachUser = teach ? users.find(u => u.id === teach.userId) : null;
                  return (
                    <div key={sub.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{sub.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Code: <span className="font-bold text-slate-600">{sub.code}</span> • Dept: {dept?.code || 'N/A'} • Course: {crs?.code || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${teachUser ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'}`}>
                          {teachUser ? `Prof. ${teachUser.name}` : 'Staff Unassigned'}
                        </span>
                        <button 
                          onClick={() => handleDeleteSubject(sub.id, sub.code)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. STUDENTS DIRECTORY TAB
  if (currentTab === 'students') {
    const studentUsers = users.filter(u => u.role === 'STUDENT');
    const filteredStuUsers = studentUsers.filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) || 
      u.email.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Students Directory & Credentials</h2>
            <p className="text-xs text-slate-400 mt-1">Enroll students, provision accounts, and reset system passwords.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Enroll Student</span>
            </h3>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student Full Name</label>
                <input 
                  type="text" required value={stuName} onChange={e => setStuName(e.target.value)}
                  placeholder="YOUR NAME"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" required value={stuEmail} onChange={e => setStuEmail(e.target.value)}
                    placeholder="YOUR MAIL"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Default Password</label>
                  <input 
                    type="text" required value={stuPassword} onChange={e => setStuPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Roll / Student ID</label>
                  <input 
                    type="text" required value={stuId} onChange={e => setStuId(e.target.value)}
                    placeholder="STU-2026-001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                  <select 
                    required value={stuDept} onChange={e => setStuDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.code}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Course Program</label>
                  <select 
                    required value={stuCourse} onChange={e => setStuCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Session</label>
                  <select 
                    required value={stuSession} onChange={e => setStuSession(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Session</option>
                    {academicSessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Enroll Roster
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden space-y-4">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" placeholder="Search student name or email..." value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {filteredStuUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Provision student profiles to view lists.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {filteredStuUsers.map((usr) => {
                  const s = students.find(stu => stu.userId === usr.id);
                  const dept = s ? departments.find(d => d.id === s.departmentId) : null;
                  const crs = s ? courses.find(c => c.id === s.courseId) : null;
                  return (
                    <div key={usr.id} className="px-6 py-3.5 flex justify-between items-center hover:bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-2">
                          <span>{usr.name}</span>
                          {!usr.isActive && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[8px] font-bold rounded">Suspended</span>}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          ID: <span className="font-bold text-slate-600">{s?.studentId || 'N/A'}</span> • Email: {usr.email} • Program: {crs?.code || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleUserActive(usr.id, usr.email)}
                          title="Toggle account active/suspended state"
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                          {usr.isActive ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-slate-300" />}
                        </button>
                        <button 
                          onClick={() => setResettingUserEmail(usr.email)}
                          title="Reset user password coordinates"
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => s && handleDeleteStudent(s.id, usr.name)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Password Reset Modal Overlay */}
        {resettingUserEmail && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Force Password Reset</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Update default access credentials for: <span className="font-bold text-slate-700">{resettingUserEmail}</span></p>
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <input 
                  type="password" required value={newPasswordVal} onChange={e => setNewPasswordVal(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setResettingUserEmail(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors">Reset Password</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 5. TEACHERS DIRECTORY TAB
  if (currentTab === 'teachers') {
    const teacherUsers = users.filter(u => u.role === 'TEACHER');
    const filteredTeaUsers = teacherUsers.filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) || 
      u.email.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty Roster</h2>
          <p className="text-xs text-slate-400 mt-1">Manage professorial profiles, office hours and account credentials.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Register Professor</span>
            </h3>
            <form onSubmit={handleAddTeacher} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Teacher Full Name</label>
                <input 
                  type="text" required value={teaName} onChange={e => setTeaName(e.target.value)}
                  placeholder="YOUR NAME"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                  <input 
                    type="email" required value={teaEmail} onChange={e => setTeaEmail(e.target.value)}
                    placeholder="YOUR MAIL"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Default Password</label>
                  <input 
                    type="text" required value={teaPassword} onChange={e => setTeaPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Office Room No.</label>
                  <input 
                    type="text" required value={teaOffice} onChange={e => setTeaOffice(e.target.value)}
                    placeholder="Block C, Rm-202"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Faculty Department</label>
                  <select 
                    required value={teaDept} onChange={e => setTeaDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Dept</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.code}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Confirm Profile
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden space-y-4">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" placeholder="Search teacher name or email..." value={query} onChange={e => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg focus:outline-none"
                />
              </div>
            </div>

            {filteredTeaUsers.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Register professorial profiles to display directory listings.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTeaUsers.map((usr) => {
                  const t = teachers.find(tea => tea.userId === usr.id);
                  const dept = t ? departments.find(d => d.id === t.departmentId) : null;
                  return (
                    <div key={usr.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-2">
                          <span>Prof. {usr.name}</span>
                          {!usr.isActive && <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[8px] font-bold rounded">Suspended</span>}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Email: {usr.email} • Office: {t?.office || 'TBD'} • Dept: {dept?.code || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleUserActive(usr.id, usr.email)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          {usr.isActive ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-slate-300" />}
                        </button>
                        <button 
                          onClick={() => setResettingUserEmail(usr.email)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => t && handleDeleteTeacher(t.id, usr.name)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Force Password Reset Modal re-use */}
        {resettingUserEmail && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Force Password Reset</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Update default access credentials for: <span className="font-bold text-slate-700">{resettingUserEmail}</span></p>
              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <input 
                  type="password" required value={newPasswordVal} onChange={e => setNewPasswordVal(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setResettingUserEmail(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors">Reset Password</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 6. TIMETABLE TAB
  if (currentTab === 'timetable') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Academic Timetable Coordinator</h2>
          <p className="text-xs text-slate-400 mt-1">Configure class schedules, assign professors, rooms and session durations.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Schedule Class Lecture</span>
            </h3>
            <form onSubmit={handleAddTimetableSlot} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject Module</label>
                <select 
                  required value={timeSub} onChange={e => setTimeSub(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Course Program</label>
                  <select 
                    required value={timeCourse} onChange={e => setTimeCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Professor</label>
                  <select 
                    required value={timeTeacher} onChange={e => setTimeTeacher(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Professor</option>
                    {teachers.map(t => {
                      const u = users.find(usr => usr.id === t.userId);
                      return <option key={t.id} value={t.id}>{u ? u.name : 'TBD'}</option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lecture Room</label>
                  <input 
                    type="text" required value={timeRoom} onChange={e => setTimeRoom(e.target.value)}
                    placeholder="Room-102"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Day of Week</label>
                  <select 
                    value={timeDay} onChange={e => setTimeDay(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</label>
                  <input 
                    type="time" required value={timeSlot} onChange={e => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration (Hours)</label>
                  <input 
                    type="number" min={1} max={5} required value={timeDuration} onChange={e => setTimeDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Confirm Slot Lecture
              </button>
            </form>
          </div>

          {/* List timetable slots */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled Lectures ({timetables.length})</span>
            </div>

            {timetables.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Schedule lectures to render timetables.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {timetables.map((slot) => {
                  const sub = subjects.find(s => s.id === slot.subjectId);
                  const teach = teachers.find(t => t.id === slot.teacherId);
                  const teachUser = teach ? users.find(u => u.id === teach.userId) : null;
                  const crs = courses.find(c => c.id === slot.courseId);
                  return (
                    <div key={slot.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">
                          {sub?.name || 'Class Lecture'} ({sub?.code})
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Professor: {teachUser ? teachUser.name : 'TBD'} • Room: {slot.room} • Program: {crs?.code || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right text-xs">
                          <p className="font-bold text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg">{slot.day} {slot.time}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{slot.durationHours} hr session</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteTimetableSlot(slot.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 7. NOTICES TAB
  if (currentTab === 'notices') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Notice Board Manager</h2>
          <p className="text-xs text-slate-400 mt-1">Broadcast news alerts, post academic schedules, and pin important announcements.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Create Announcement</span>
            </h3>
            <form onSubmit={handleAddNotice} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notice Title</label>
                <input 
                  type="text" required value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)}
                  placeholder="Final semester dates released"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                  <select 
                    value={noticeCat} onChange={e => setNoticeCat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                    <option value="Urgent">Urgent</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="flex items-center pt-5 gap-2.5">
                  <input 
                    type="checkbox" id="pinned" checked={noticePinned} onChange={e => setNoticePinned(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4.5 h-4.5"
                  />
                  <label htmlFor="pinned" className="text-xs font-semibold text-slate-500">Pin to Top</label>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notice Content</label>
                <textarea 
                  required rows={4} value={noticeContent} onChange={e => setNoticeContent(e.target.value)}
                  placeholder="Provide complete announcements details here..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Confirm Broadcast Notice
              </button>
            </form>
          </div>

          {/* List notices */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Broadcast Notices ({notices.length})</span>
            </div>

            {notices.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Notices board empty.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {notices.map((notif) => (
                  <div key={notif.id} className="px-6 py-4 flex justify-between items-start gap-4 hover:bg-slate-50/40">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          notif.category === 'Urgent' ? 'bg-red-500/15 text-red-600' :
                          notif.category === 'Academic' ? 'bg-indigo-500/15 text-indigo-600' :
                          notif.category === 'Event' ? 'bg-amber-500/15 text-amber-600' : 'bg-slate-500/15 text-slate-600'
                        }`}>
                          {notif.category}
                        </span>
                        {notif.isPinned && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-[8px] font-bold rounded-sm">Pinned</span>}
                        <span className="text-[10px] text-slate-400 font-medium">{notif.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{notif.title}</h4>
                      <p className="text-slate-500 text-xs whitespace-pre-line leading-relaxed">{notif.content}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">Author: {notif.author}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteNotice(notif.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 8. RESULTS / MARKS TAB
  if (currentTab === 'results') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Results Ledger</h2>
          <p className="text-xs text-slate-400 mt-1">Grade examinations, publish final GPA marks and review student performances.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Log Student Marks</span>
            </h3>
            <form onSubmit={handleAddResult} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Student</label>
                <select 
                  required value={resStu} onChange={e => setResStu(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                >
                  <option value="">Select Student</option>
                  {students.map(s => {
                    const u = users.find(usr => usr.id === s.userId);
                    return <option key={s.id} value={s.id}>{u ? u.name : 'Unknown'} ({s.studentId})</option>;
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject Module</label>
                  <select 
                    required value={resSub} onChange={e => setResSub(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Academic Session</label>
                  <select 
                    required value={resSession} onChange={e => setResSession(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="">Select Session</option>
                    {academicSessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Internal Exam (Max 40)</label>
                  <input 
                    type="number" min={0} max={40} required value={resInternal} onChange={e => setResInternal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">External Exam (Max 60)</label>
                  <input 
                    type="number" min={0} max={60} required value={resExternal} onChange={e => setResExternal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Confirm & Log Marks
              </button>
            </form>
          </div>

          {/* List student marks */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Report Cards ({results.length})</span>
            </div>

            {results.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Grade student modules to render results ledger.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {results.map((res) => {
                  const s = students.find(stu => stu.id === res.studentId);
                  const u = s ? users.find(usr => usr.id === s.userId) : null;
                  const sub = subjects.find(sub => sub.id === res.subjectId);
                  return (
                    <div key={res.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{u ? u.name : 'Unknown Student'}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Subject: {sub?.name || 'N/A'} ({sub?.code}) • Internal: {res.internalMarks} • External: {res.externalMarks}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">Grade {res.grade}</span>
                          <p className="text-[10px] text-slate-400 mt-1">Total: {res.totalMarks}/100</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteResult(res.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 9. SYSTEM NOTES TAB
  if (currentTab === 'notes') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Administrative Memos</h2>
          <p className="text-xs text-slate-400 mt-1">Keep private system records, coordinate staff guidelines, and record personal admin notes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Create Note Memo</span>
            </h3>
            <form onSubmit={handleAddNote} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Title</label>
                <input 
                  type="text" required value={noteTitle} onChange={e => setNoteTitle(e.target.value)}
                  placeholder="Library expansion planning"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <input 
                  type="text" required value={noteCat} onChange={e => setNoteCat(e.target.value)}
                  placeholder="Academic"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Content</label>
                <textarea 
                  required rows={4} value={noteContent} onChange={e => setNoteContent(e.target.value)}
                  placeholder="Record private administrative parameters..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Save Memo Note
              </button>
            </form>
          </div>

          {/* List administrative memos */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Saved Memos ({notes.length})</span>
            </div>

            {notes.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No data available. Create memo notes for secure local persistence.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {notes.map((n) => (
                  <div key={n.id} className="px-6 py-4 flex justify-between items-start gap-4 hover:bg-slate-50/40">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">{n.category}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{n.lastModified}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-line">{n.content}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteNote(n.id)}
                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 10. SYSTEM SETTINGS TAB
  if (currentTab === 'settings') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">System Parameters</h2>
          <p className="text-xs text-slate-400 mt-1">Configure global parameters and manage ERP setup.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">ERP Properties</h3>
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Campus Name</label>
                <input 
                  type="text" value={settings.campusName} onChange={e => setSettings({...settings, campusName: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Academic Year</label>
                  <input 
                    type="text" value={settings.academicYear} onChange={e => setSettings({...settings, academicYear: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Enrolled Cap Capacity</label>
                  <input 
                    type="number" value={settings.maxCapacity} onChange={e => setSettings({...settings, maxCapacity: Number(e.target.value)})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" id="notif-flag" checked={settings.enableNotifications} onChange={e => setSettings({...settings, enableNotifications: e.target.checked})}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="notif-flag" className="text-slate-500">Enable Broadcast Board Notifications</label>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl leading-relaxed text-[11px]">
                Global changes to the ERP parameters take effect immediately across all student and teacher portals in real-time.
              </div>
            </div>
          </div>

          {/* Academic Sessions Setup card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-600" />
              <span>Academic Sessions ({academicSessions.length})</span>
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!sessName || !sessStart || !sessEnd) return;
              const newSess = {
                id: Math.random().toString(36).substring(2, 9),
                name: sessName,
                isActive: academicSessions.length === 0,
                startDate: sessStart,
                endDate: sessEnd
              };
              setAcademicSessions(prev => [...prev, newSess]);
              logActivity(`Created Academic Session: ${sessName}`);
              setSessName('');
              setSessStart('');
              setSessEnd('');
            }} className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Session Name</label>
                <input 
                  type="text" required value={sessName} onChange={e => setSessName(e.target.value)}
                  placeholder="Fall Term 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                  <input 
                    type="date" required value={sessStart} onChange={e => setSessStart(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
                  <input 
                    type="date" required value={sessEnd} onChange={e => setSessEnd(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Add Academic Session
              </button>
            </form>

            <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
              {academicSessions.map(session => (
                <div key={session.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-700">{session.name}</p>
                    <p className="text-[10px] text-slate-400">{session.startDate} to {session.endDate}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${session.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {session.isActive ? 'Active' : 'Archived'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
