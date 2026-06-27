import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  BookOpen, 
  FileUp, 
  Megaphone, 
  Users, 
  Award, 
  CalendarDays, 
  User, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Info, 
  ExternalLink,
  Search
} from 'lucide-react';
import { 
  User as UserType, 
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
  AcademicSession 
} from '../types';

interface TeacherPortalProps {
  currentTab: string;
  currentUser: UserType | null;
  users: UserType[];
  students: Student[];
  teachers: Teacher[];
  departments: Department[];
  courses: Course[];
  subjects: Subject[];
  timetables: TimetableSlot[];
  attendance: Attendance[];
  teacherAttendance: TeacherAttendance[];
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  studyMaterials: StudyMaterial[];
  notices: Notice[];
  results: Result[];
  academicSessions: AcademicSession[];
  onNavigate: (tab: string) => void;
  // State updaters
  setAttendance: React.Dispatch<React.SetStateAction<Attendance[]>>;
  setTeacherAttendance: React.Dispatch<React.SetStateAction<TeacherAttendance[]>>;
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  setAssignmentSubmissions: React.Dispatch<React.SetStateAction<AssignmentSubmission[]>>;
  setStudyMaterials: React.Dispatch<React.SetStateAction<StudyMaterial[]>>;
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
  logActivity: (msg: string) => void;
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
}

export default function TeacherPortal({
  currentTab,
  currentUser,
  users,
  students,
  teachers,
  departments,
  courses,
  subjects,
  timetables,
  attendance,
  teacherAttendance,
  assignments,
  assignmentSubmissions,
  studyMaterials,
  notices,
  results,
  academicSessions,
  onNavigate,
  setAttendance,
  setTeacherAttendance,
  setAssignments,
  setAssignmentSubmissions,
  setStudyMaterials,
  setNotices,
  setResults,
  logActivity,
  setUsers
}: TeacherPortalProps) {

  const teacherProfile = teachers.find(t => t.userId === currentUser?.id);
  const mySubjects = teacherProfile ? subjects.filter(s => s.teacherId === teacherProfile.id) : [];
  const mySubjectIds = mySubjects.map(s => s.id);

  // States for marking student attendance
  const [attSubject, setAttSubject] = useState('');
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);

  // States for creating assignment
  const [assTitle, setAssTitle] = useState('');
  const [assSub, setAssSub] = useState('');
  const [assDue, setAssDue] = useState('');
  const [assInst, setAssInst] = useState('');

  // Grading state
  const [selectedSub, setSelectedSub] = useState<AssignmentSubmission | null>(null);
  const [gradingScore, setGradingScore] = useState('');
  const [gradingFeedback, setGradingFeedback] = useState('');

  // Study material form
  const [matTitle, setMatTitle] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [matSub, setMatSub] = useState('');
  const [matType, setMatType] = useState<'PDF' | 'PPT' | 'Doc' | 'Link'>('PDF');
  const [matFileName, setMatFileName] = useState('');

  // Notice form
  const [notTitle, setNotTitle] = useState('');
  const [notContent, setNotContent] = useState('');
  const [notCat, setNotCat] = useState<'Academic' | 'Event' | 'Urgent' | 'General'>('Academic');

  // Internal marks entry
  const [marksStu, setMarksStu] = useState('');
  const [marksSub, setMarksSub] = useState('');
  const [marksInternal, setMarksInternal] = useState('');
  const [marksExternal, setMarksExternal] = useState('');

  // Search query
  const [query, setQuery] = useState('');

  // 1. Submit student attendance
  const handleToggleAttendance = (studentId: string, status: 'Present' | 'Absent' | 'Excused' | 'Late') => {
    if (!attSubject || !attDate) {
      alert('Please select a subject module first.');
      return;
    }

    const existingIdx = attendance.findIndex(a => 
      a.studentId === studentId && 
      a.subjectId === attSubject && 
      a.date === attDate
    );

    if (existingIdx > -1) {
      setAttendance(prev => prev.map((a, idx) => idx === existingIdx ? { ...a, status } : a));
    } else {
      const fresh: Attendance = {
        id: Math.random().toString(36).substring(2, 9),
        studentId,
        subjectId: attSubject,
        date: attDate,
        status,
        markedBy: currentUser?.id || ''
      };
      setAttendance(prev => [...prev, fresh]);
    }
    logActivity(`Recorded Attendance for Student Profile ID: ${studentId}`);
  };

  // 2. Mark teacher's own attendance
  const handleMarkOwnAttendance = (status: 'Present' | 'Absent' | 'On Leave') => {
    if (!teacherProfile) return;
    const today = new Date().toISOString().split('T')[0];

    if (teacherAttendance.some(t => t.teacherId === teacherProfile.id && t.date === today)) {
      alert('You have already logged your attendance for today!');
      return;
    }

    const fresh: TeacherAttendance = {
      id: Math.random().toString(36).substring(2, 9),
      teacherId: teacherProfile.id,
      date: today,
      status,
      markedAt: new Date().toLocaleTimeString()
    };

    setTeacherAttendance(prev => [...prev, fresh]);
    logActivity(`Prof. ${currentUser?.name} marked own attendance: ${status}`);
    alert(`Attendance logged successfully: ${status}`);
  };

  // 3. Create assignments
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assTitle || !assSub || !assDue) return;

    const sub = subjects.find(s => s.id === assSub);
    const fresh: Assignment = {
      id: Math.random().toString(36).substring(2, 9),
      title: assTitle,
      instructions: assInst,
      subjectId: assSub,
      dueDate: assDue,
      departmentId: sub?.departmentId || '',
      createdAt: new Date().toISOString()
    };

    setAssignments(prev => [...prev, fresh]);
    logActivity(`Faculty created assignment: ${assTitle}`);
    alert(`Assignment "${assTitle}" published successfully!`);

    setAssTitle('');
    setAssInst('');
    setAssDue('');
  };

  // 4. Grade submission
  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    setAssignmentSubmissions(prev => prev.map(sub => 
      sub.id === selectedSub.id 
        ? { ...sub, grade: gradingScore, feedback: gradingFeedback, status: 'Graded' } 
        : sub
    ));

    logActivity(`Graded assignment submission for ${selectedSub.id}`);
    alert('Grade and feedback submitted successfully!');
    setSelectedSub(null);
    setGradingScore('');
    setGradingFeedback('');
  };

  // 5. Upload Notes study materials
  const handleUploadNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle || !matSub || !matFileName) return;

    const fresh: StudyMaterial = {
      id: Math.random().toString(36).substring(2, 9),
      title: matTitle,
      description: matDesc,
      fileType: matType,
      fileName: matFileName,
      fileUrl: '#',
      subjectId: matSub,
      uploadedBy: teacherProfile?.id || '',
      createdAt: new Date().toLocaleDateString()
    };

    setStudyMaterials(prev => [...prev, fresh]);
    logActivity(`Uploaded Study Material: ${matTitle}`);
    alert(`Study material resource "${matTitle}" uploaded successfully!`);

    setMatTitle('');
    setMatDesc('');
    setMatFileName('');
  };

  // 6. Post notice
  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notTitle || !notContent) return;

    const fresh: Notice = {
      id: Math.random().toString(36).substring(2, 9),
      title: notTitle,
      content: notContent,
      category: notCat,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: currentUser?.name || 'Faculty Member',
      isPinned: false
    };

    setNotices(prev => [fresh, ...prev]);
    logActivity(`Faculty posted Announcement: ${notTitle}`);
    alert(`Announcement posted: ${notTitle}`);

    setNotTitle('');
    setNotContent('');
  };

  // 7. Log internal marks
  const handleSaveInternalMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marksStu || !marksSub) return;

    const total = Number(marksInternal || 0) + Number(marksExternal || 0);
    let grade = 'F';
    if (total >= 90) grade = 'A+';
    else if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B';
    else if (total >= 60) grade = 'C';
    else if (total >= 50) grade = 'D';

    const session = academicSessions.find(s => s.isActive);

    const fresh: Result = {
      id: Math.random().toString(36).substring(2, 9),
      studentId: marksStu,
      subjectId: marksSub,
      academicSessionId: session?.id || 'session-1',
      internalMarks: Number(marksInternal || 0),
      externalMarks: Number(marksExternal || 0),
      totalMarks: total,
      grade
    };

    setResults(prev => [...prev, fresh]);
    logActivity(`Faculty logged academic grades for Student ID: ${marksStu}`);
    alert('Marks registered successfully!');

    setMarksInternal('');
    setMarksExternal('');
  };


  // ----------------------------------------------------
  // SUB-TABS ROUTING
  // ----------------------------------------------------

  // 1. MARK STUDENT ATTENDANCE
  if (currentTab === 'mark_attendance') {
    // Filter students belonging to teacher's department
    const deptStudents = teacherProfile 
      ? students.filter(s => s.departmentId === teacherProfile.departmentId)
      : [];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Roll Call Registry</h2>
          <p className="text-xs text-slate-400 mt-1">Select class parameters, record present/absent student coordinates in real-time.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Subject Module</label>
              <select 
                value={attSubject} onChange={e => setAttSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
              >
                <option value="">Select subject taught</option>
                {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Roll Call Date</label>
              <input 
                type="date" value={attDate} onChange={e => setAttDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none font-mono"
              />
            </div>
            <div className="flex items-end">
              <span className="text-[10px] text-slate-400 font-medium italic pb-2">Record updates immediately persist to cloud ledgers</span>
            </div>
          </div>

          {!attSubject ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl border border-dashed border-slate-200">
              Please choose a subject module above to display student roster.
            </div>
          ) : deptStudents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-semibold bg-slate-50 rounded-xl">
              No students found enrolled in your department program.
            </div>
          ) : (
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div className="px-5 py-3 bg-slate-50/60 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Student Name</span>
                <span>Roll Call Actions</span>
              </div>
              {deptStudents.map(student => {
                const u = users.find(usr => usr.id === student.userId);
                // Locate existing attendance status
                const record = attendance.find(a => 
                  a.studentId === student.id && 
                  a.subjectId === attSubject && 
                  a.date === attDate
                );
                const activeStatus = record ? record.status : null;

                return (
                  <div key={student.id} className="px-5 py-3.5 flex justify-between items-center hover:bg-slate-50/40">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{u ? u.name : 'Unknown'}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Roll ID: {student.studentId}</p>
                    </div>

                    <div className="flex gap-1">
                      {(['Present', 'Absent', 'Excused', 'Late'] as any).map((status: any) => (
                        <button
                          key={status}
                          onClick={() => handleToggleAttendance(student.id, status)}
                          className={`px-2.5 py-1 text-[9px] font-extrabold rounded ${
                            activeStatus === status 
                              ? status === 'Present' ? 'bg-emerald-500 text-slate-950 font-bold' :
                                status === 'Absent' ? 'bg-red-500 text-white font-bold' :
                                status === 'Late' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-indigo-500 text-white font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/60'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. OWN ATTENDANCE LOGS
  if (currentTab === 'own_attendance') {
    const myLogs = teacherProfile 
      ? teacherAttendance.filter(t => t.teacherId === teacherProfile.id)
      : [];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty Attendance Coordinates</h2>
          <p className="text-xs text-slate-400 mt-1">Perform daily check-ins to record presence coordinates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Check-In Registry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Log your work credentials for today.</p>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => handleMarkOwnAttendance('Present')} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Present Check-In</span>
              </button>
              <button onClick={() => handleMarkOwnAttendance('On Leave')} className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Apply On Leave</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Login Logs ({myLogs.length})</span>
            </div>

            {myLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No logs registered for this month.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myLogs.map(log => (
                  <div key={log.id} className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span className="font-mono">{log.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-400">Logged at {log.markedAt}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${log.status === 'Present' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. ASSIGNMENTS & GRADING
  if (currentTab === 'assignments') {
    // Filter submissions for assignments belonging to teacher's subjects
    const teacherAssignments = assignments.filter(a => mySubjectIds.includes(a.subjectId));
    const teacherSubmissions = assignmentSubmissions.filter(s => {
      const ass = assignments.find(a => a.id === s.assignmentId);
      return ass && mySubjectIds.includes(ass.subjectId);
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Academic Assessments Manager</h2>
          <p className="text-xs text-slate-400 mt-1">Configure class homework assignments, view submitted study logs, and score papers.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Create form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Create Assignment</span>
            </h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Subject Module</label>
                <select 
                  required value={assSub} onChange={e => setAssSub(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                >
                  <option value="">Select subject taught</option>
                  {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Assignment Title</label>
                <input 
                  type="text" required value={assTitle} onChange={e => setAssTitle(e.target.value)}
                  placeholder="Programming Lab Project 1"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Due Date</label>
                <input 
                  type="date" required value={assDue} onChange={e => setAssDue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Instructions / Description</label>
                <textarea 
                  rows={3} value={assInst} onChange={e => setAssInst(e.target.value)}
                  placeholder="Provide parameters and instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Publish Assessment
              </button>
            </form>
          </div>

          {/* List submissions & Active assignments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Assessments ({teacherAssignments.length})</span>
              </div>

              {teacherAssignments.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold italic">
                  No homework assignments published yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {teacherAssignments.map(ass => {
                    const sub = subjects.find(s => s.id === ass.subjectId);
                    const subCount = assignmentSubmissions.filter(s => s.assignmentId === ass.id).length;
                    return (
                      <div key={ass.id} className="px-6 py-3.5 flex justify-between items-center text-xs font-semibold text-slate-700">
                        <div>
                          <p className="font-bold text-slate-800">{ass.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1">Subject: {sub?.code} • Due: {ass.dueDate}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full">
                          {subCount} Submissions
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted Homework Files ({teacherSubmissions.length})</span>
              </div>

              {teacherSubmissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold italic">
                  No submissions received yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {teacherSubmissions.map(sub => {
                    const ass = assignments.find(a => a.id === sub.assignmentId);
                    const stu = students.find(s => s.id === sub.studentId);
                    const u = stu ? users.find(usr => usr.id === stu.userId) : null;
                    return (
                      <div key={sub.id} className="px-6 py-3.5 flex justify-between items-center text-xs font-semibold text-slate-700">
                        <div>
                          <p className="font-bold text-slate-800">{u?.name || 'Student'} ({stu?.studentId})</p>
                          <p className="text-[10px] text-slate-400 mt-1">Assignment: {ass?.title} • File: {sub.fileName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${sub.status === 'Graded' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {sub.status === 'Graded' ? `Graded: ${sub.grade}` : 'Pending'}
                          </span>
                          <button 
                            onClick={() => setSelectedSub(sub)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Grade Card
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

        {/* Grading Modal dialog */}
        {selectedSub && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Grade Homework Paper</h3>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                <p><span className="text-slate-400 font-medium">Student Name:</span> <span className="font-bold text-slate-700">{(students.find(s => s.id === selectedSub.studentId) ? users.find(u => u.id === students.find(s => s.id === selectedSub.studentId)?.userId)?.name : '')}</span></p>
                <p><span className="text-slate-400 font-medium">Assignment:</span> <span className="font-bold text-slate-700">{assignments.find(a => a.id === selectedSub.assignmentId)?.title}</span></p>
                <p><span className="text-slate-400 font-medium">Submitted File:</span> <span className="font-bold text-indigo-600 underline cursor-pointer">{selectedSub.fileName}</span></p>
              </div>

              <form onSubmit={handleSaveGrade} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Score / Grade Card (e.g., A, 95)</label>
                  <input 
                    type="text" required value={gradingScore} onChange={e => setGradingScore(e.target.value)}
                    placeholder="95"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Faculty Feedback</label>
                  <textarea 
                    rows={3} value={gradingFeedback} onChange={e => setGradingFeedback(e.target.value)}
                    placeholder="Well-organized thesis..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setSelectedSub(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors">Submit Grade</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. UPLOAD notes study materials
  if (currentTab === 'upload_notes') {
    const teacherMaterials = studyMaterials.filter(m => m.uploadedBy === teacherProfile?.id);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Study Materials Repository</h2>
          <p className="text-xs text-slate-400 mt-1">Distribute academic PDF syllabi, lecture PPTs and reading resources directly to student portal feeds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Publish Lecture Study Material</span>
            </h3>
            <form onSubmit={handleUploadNotes} className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Subject Module</label>
                <select 
                  required value={matSub} onChange={e => setMySub(e)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                >
                  <option value="">Select subject taught</option>
                  {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Resource Title</label>
                <input 
                  type="text" required value={matTitle} onChange={e => setMatTitle(e.target.value)}
                  placeholder="Introductory Lecture Notes Slide"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">File Type</label>
                  <select 
                    value={matType} onChange={e => setMatType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  >
                    <option value="PDF">PDF File</option>
                    <option value="PPT">PPT Slides</option>
                    <option value="Doc">Word Document</option>
                    <option value="Link">External Link</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">File / Name URL</label>
                  <input 
                    type="text" required value={matFileName} onChange={e => setMatFileName(e.target.value)}
                    placeholder="database_lectures.pdf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Brief Description</label>
                <textarea 
                  rows={3} value={matDesc} onChange={e => setMatDesc(e.target.value)}
                  placeholder="Slide details, syllabus guidelines..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Confirm Distribution
              </button>
            </form>
          </div>

          {/* List study materials uploaded */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Shared Materials ({teacherMaterials.length})</span>
            </div>

            {teacherMaterials.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No materials registered yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {teacherMaterials.map(mat => {
                  const sub = subjects.find(s => s.id === mat.subjectId);
                  return (
                    <div key={mat.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{mat.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Module: {sub?.name} ({sub?.code}) • Type: <span className="font-bold text-indigo-600">{mat.fileType}</span> • File: {mat.fileName}
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setStudyMaterials(prev => prev.filter(m => m.id !== mat.id));
                          logActivity(`Deleted Study Material: ${mat.title}`);
                        }}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

  const setMySub = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMatSub(e.target.value);
  };

  // 5. POST NOTICES TAB
  if (currentTab === 'post_notices') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty Broadcast Bulletins</h2>
          <p className="text-xs text-slate-400 mt-1">Post class notices and updates directly to notice boards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm">Post Class Notice</h3>
            <form onSubmit={handlePostNotice} className="space-y-3.5">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Notice Title</label>
                <input 
                  type="text" required value={notTitle} onChange={e => setNotTitle(e.target.value)}
                  placeholder="Extra lecture scheduled"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Category</label>
                <select 
                  value={notCat} onChange={e => setNotCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                >
                  <option value="Academic">Academic</option>
                  <option value="Event">Event</option>
                  <option value="Urgent">Urgent</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Announcement Body</label>
                <textarea 
                  required rows={4} value={notContent} onChange={e => setNotContent(e.target.value)}
                  placeholder="Provide detail logs here..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Publish Bulletin Notice
              </button>
            </form>
          </div>

          <div className="md:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Board Bulletins ({notices.length} active)</span>
            </div>

            {notices.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                Notice board empty.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notices.map(notice => (
                  <div key={notice.id} className="px-6 py-4 flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase rounded">{notice.category}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{notice.date}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs mt-2">{notice.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed mt-1 whitespace-pre-line">{notice.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 6. STUDENT RECORDS TAB
  if (currentTab === 'students_records') {
    const deptStudents = teacherProfile 
      ? students.filter(s => s.departmentId === teacherProfile.departmentId)
      : [];

    const filtered = deptStudents.filter(s => {
      const u = users.find(usr => usr.id === s.userId);
      return u?.name.toLowerCase().includes(query.toLowerCase()) || s.studentId.toLowerCase().includes(query.toLowerCase());
    });

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty Student Records</h2>
          <p className="text-xs text-slate-400 mt-1">Audit students belonging to your department programs and evaluate attendance rates.</p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden space-y-4">
          <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" placeholder="Search student name or ID..." value={query} onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
              No students found in department roster.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map(student => {
                const u = users.find(usr => usr.id === student.userId);
                const sCourse = courses.find(c => c.id === student.courseId);
                // Compute attendance percentage
                const myAtt = attendance.filter(a => a.studentId === student.id);
                const totalRolls = myAtt.length;
                const presentRolls = myAtt.filter(a => a.status === 'Present' || a.status === 'Late').length;
                const percentage = totalRolls > 0 ? Math.round((presentRolls / totalRolls) * 100) : 0;

                return (
                  <div key={student.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{u ? u.name : 'Student'}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">ID: {student.studentId} • Course: {sCourse?.name || 'N/A'}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      {!u?.isActive && (
                        <button
                          onClick={() => {
                            if (u) {
                              setUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, isActive: true } : usr));
                              logActivity(`Teacher approved student account: ${u.email}`);
                              alert(`Student ${u.name} approved successfully!`);
                            }
                          }}
                          className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-[10px] cursor-pointer transition-colors"
                        >
                          Approve Student
                        </button>
                      )}
                      
                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${percentage >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {percentage}% Attendance
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{totalRolls} classes recorded</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 7. INTERNAL EXAM MARKS ENTRY
  if (currentTab === 'internal_marks') {
    const deptStudents = teacherProfile 
      ? students.filter(s => s.departmentId === teacherProfile.departmentId)
      : [];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gradebook Exam Entrance</h2>
          <p className="text-xs text-slate-400 mt-1">Log internal exams, midterm test marks, and publish grades.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Form */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>Log Student Marks</span>
            </h3>
            <form onSubmit={handleSaveInternalMarks} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject Module</label>
                <select 
                  required value={marksSub} onChange={e => setMarksSub(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                >
                  <option value="">Select subject</option>
                  {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student Profile</label>
                <select 
                  required value={marksStu} onChange={e => setMarksStu(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                >
                  <option value="">Select student</option>
                  {deptStudents.map(s => {
                    const u = users.find(usr => usr.id === s.userId);
                    return <option key={s.id} value={s.id}>{u ? u.name : 'Student'} ({s.studentId})</option>;
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Internal (Max 40)</label>
                  <input 
                    type="number" min={0} max={40} required value={marksInternal} onChange={e => setMarksInternal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">External (Max 60)</label>
                  <input 
                    type="number" min={0} max={60} required value={marksExternal} onChange={e => setMarksExternal(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer">
                Grade Assessment
              </button>
            </form>
          </div>

          {/* List grades mapped to teacher's subjects */}
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Marks Logs ({results.filter(r => mySubjectIds.includes(r.subjectId)).length})</span>
            </div>

            {results.filter(r => mySubjectIds.includes(r.subjectId)).length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No marks logged for your subjects yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {results.filter(r => mySubjectIds.includes(r.subjectId)).map(res => {
                  const s = students.find(stu => stu.id === res.studentId);
                  const u = s ? users.find(usr => usr.id === s.userId) : null;
                  const sub = subjects.find(sub => sub.id === res.subjectId);
                  return (
                    <div key={res.id} className="px-6 py-3.5 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm leading-tight">{u ? u.name : 'Student'}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Module: {sub?.name} • Internal: {res.internalMarks} • External: {res.externalMarks}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">Grade {res.grade}</span>
                        <p className="text-[10px] text-slate-400 mt-1">Total Score: {res.totalMarks}/100</p>
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

  // 8. TIMETABLE VIEW
  if (currentTab === 'timetable') {
    const mySlots = teacherProfile 
      ? timetables.filter(t => t.teacherId === teacherProfile.id)
      : [];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Lecture Schedule</h2>
          <p className="text-xs text-slate-400 mt-1">Review scheduled weekly lecture times and rooms coordinates.</p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Timetable ({mySlots.length} hours assigned)</span>
          </div>

          {mySlots.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
              No lecture schedules configured by administration blocks yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {mySlots.map(slot => {
                const sub = subjects.find(s => s.id === slot.subjectId);
                const crs = courses.find(c => c.id === slot.courseId);
                return (
                  <div key={slot.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40 text-xs font-semibold text-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{sub?.name} ({sub?.code})</p>
                      <p className="text-slate-400 mt-1">Course: {crs?.name} • Duration: {slot.durationHours} hr session</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded font-mono font-bold">{slot.day} at {slot.time}</span>
                      <p className="text-slate-400 mt-1">Lecture Room: {slot.room}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
