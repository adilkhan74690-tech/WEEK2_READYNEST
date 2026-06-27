import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  BookOpen, 
  FileUp, 
  Megaphone, 
  Award, 
  User, 
  Lock, 
  Download, 
  ArrowRight, 
  CheckCircle, 
  ExternalLink,
  Info
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
  Assignment, 
  AssignmentSubmission, 
  StudyMaterial, 
  Notice, 
  Result, 
  AcademicSession 
} from '../types';

interface StudentPortalProps {
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
  assignments: Assignment[];
  assignmentSubmissions: AssignmentSubmission[];
  studyMaterials: StudyMaterial[];
  notices: Notice[];
  results: Result[];
  academicSessions: AcademicSession[];
  onNavigate: (tab: string) => void;
  // State updaters
  setAssignmentSubmissions: React.Dispatch<React.SetStateAction<AssignmentSubmission[]>>;
  logActivity: (msg: string) => void;
}

export default function StudentPortal({
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
  assignments,
  assignmentSubmissions,
  studyMaterials,
  notices,
  results,
  academicSessions,
  onNavigate,
  setAssignmentSubmissions,
  logActivity
}: StudentPortalProps) {

  const studentProfile = students.find(s => s.userId === currentUser?.id);
  const myDept = studentProfile ? departments.find(d => d.id === studentProfile.departmentId) : null;
  const myCourse = studentProfile ? courses.find(c => c.id === studentProfile.courseId) : null;

  // Filter study materials, assignments, timetables belonging to student's course
  const myCourseSubjects = studentProfile ? subjects.filter(s => s.courseId === studentProfile.courseId) : [];
  const myCourseSubjectIds = myCourseSubjects.map(s => s.id);

  const studentAssignments = studentProfile 
    ? assignments.filter(a => myCourseSubjectIds.includes(a.subjectId))
    : [];

  const studentTimetables = studentProfile
    ? timetables.filter(t => t.courseId === studentProfile.courseId)
    : [];

  const studentMaterials = studentProfile
    ? studyMaterials.filter(m => myCourseSubjectIds.includes(m.subjectId))
    : [];

  const studentAttendance = studentProfile
    ? attendance.filter(a => a.studentId === studentProfile.id)
    : [];

  const studentResults = studentProfile
    ? results.filter(r => r.studentId === studentProfile.id)
    : [];

  // Form states for submitting assignment
  const [activeSubmitAss, setActiveSubmitAss] = useState<Assignment | null>(null);
  const [submissionFileName, setSubmissionFileName] = useState('');

  // Submit assignment
  const handleSubmitAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitAss || !submissionFileName || !studentProfile) return;

    // Check if submission already exists
    const existingIdx = assignmentSubmissions.findIndex(s => 
      s.assignmentId === activeSubmitAss.id && 
      s.studentId === studentProfile.id
    );

    if (existingIdx > -1) {
      alert('You have already submitted this assignment. Resubmissions are managed by faculty staff.');
      return;
    }

    const fresh: AssignmentSubmission = {
      id: Math.random().toString(36).substring(2, 9),
      assignmentId: activeSubmitAss.id,
      studentId: studentProfile.id,
      submissionDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      status: 'Submitted',
      fileName: submissionFileName,
      fileUrl: '#'
    };

    setAssignmentSubmissions(prev => [...prev, fresh]);
    logActivity(`Student submitted assignment homework file: ${submissionFileName}`);
    alert('Assignment submitted successfully!');

    setActiveSubmitAss(null);
    setSubmissionFileName('');
  };


  // ----------------------------------------------------
  // SUB-TABS ROUTING
  // ----------------------------------------------------

  // 1. ATTENDANCE REPORT CARD
  if (currentTab === 'attendance') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Attendance Board</h2>
          <p className="text-xs text-slate-400 mt-1">Review live attendance analytics, subject-wise statistics, and lecture history logs.</p>
        </div>

        {myCourseSubjects.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold bg-white rounded-2xl border border-slate-200">
            No subjects registered for your program yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject-Wise Percentage Ledger</span>
              </div>
              <div className="divide-y divide-slate-100">
                {myCourseSubjects.map(sub => {
                  const subLogs = studentAttendance.filter(a => a.subjectId === sub.id);
                  const total = subLogs.length;
                  const present = subLogs.filter(a => a.status === 'Present' || a.status === 'Late').length;
                  const percent = total > 0 ? Math.round((present / total) * 100) : 0;

                  return (
                    <div key={sub.id} className="px-6 py-4 flex justify-between items-center text-xs font-semibold text-slate-700 hover:bg-slate-50/40">
                      <div>
                        <p className="font-bold text-slate-800">{sub.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Code: {sub.code} • Logs: {present}/{total} present</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${percent >= 75 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {percent}% Att.
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Attendance Logs History */}
            <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Marked Logs ({studentAttendance.length})</span>
              </div>

              {studentAttendance.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                  No attendance logged yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {studentAttendance.map(log => {
                    const sub = subjects.find(s => s.id === log.subjectId);
                    return (
                      <div key={log.id} className="px-6 py-3 flex justify-between items-center text-xs font-semibold text-slate-700">
                        <div>
                          <p className="font-bold text-slate-800">{sub?.name || 'Lecture Session'}</p>
                          <p className="text-[10px] text-slate-400 mt-1">Log Date: {log.date}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          log.status === 'Present' ? 'bg-emerald-50 text-emerald-700' :
                          log.status === 'Absent' ? 'bg-red-50 text-red-700' :
                          log.status === 'Late' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. TIMETABLE
  if (currentTab === 'timetable') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Class Timetable</h2>
          <p className="text-xs text-slate-400 mt-1">Track class schedules, assigned lecturers, and lecture hall coordinates.</p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Schedule Grid ({studentTimetables.length} slots)</span>
          </div>

          {studentTimetables.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
              No classes scheduled for your academic program program yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {studentTimetables.map(slot => {
                const sub = subjects.find(s => s.id === slot.subjectId);
                const teacher = teachers.find(t => t.id === slot.teacherId);
                const profUser = teacher ? users.find(u => u.id === teacher.userId) : null;
                return (
                  <div key={slot.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40 text-xs font-semibold text-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{sub?.name} ({sub?.code})</p>
                      <p className="text-slate-400 mt-1">Professor: {profUser ? `Prof. ${profUser.name}` : 'Staff Unassigned'} • Session: {slot.durationHours} hr</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded font-mono font-bold">{slot.day} {slot.time}</span>
                      <p className="text-slate-400 mt-1">Class Room: {slot.room}</p>
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

  // 3. ASSIGNMENTS HOMEWORK
  if (currentTab === 'assignments') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Course Assessments</h2>
          <p className="text-xs text-slate-400 mt-1">Manage coursework assignments, upload project files, and review grade feedback.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Assessments ({studentAssignments.length})</span>
            </div>

            {studentAssignments.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
                No active assignments published. Good job!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {studentAssignments.map(ass => {
                  const sub = subjects.find(s => s.id === ass.subjectId);
                  const submission = studentProfile 
                    ? assignmentSubmissions.find(s => s.assignmentId === ass.id && s.studentId === studentProfile.id)
                    : null;

                  return (
                    <div key={ass.id} className="px-6 py-4 space-y-2 hover:bg-slate-50/40">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight">{ass.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-1">Subject Module: {sub?.name} • Due Date: {ass.dueDate}</p>
                        </div>
                        {submission ? (
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${submission.status === 'Graded' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'}`}>
                            {submission.status === 'Graded' ? `Score: ${submission.grade}` : 'Submitted'}
                          </span>
                        ) : (
                          <button 
                            onClick={() => setActiveSubmitAss(ass)}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Upload Submission
                          </button>
                        )}
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-line">{ass.instructions}</p>

                      {submission && submission.feedback && (
                        <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] border border-slate-100 text-slate-600 mt-2">
                          <span className="font-bold text-slate-700">Professor Feedback:</span> "{submission.feedback}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest text-slate-400">Submission Board Guidelines</h3>
            <div className="text-xs text-slate-500 leading-relaxed space-y-2 font-medium">
              <p>1. Please upload homework file names precisely containing study context (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">student_lab1.pdf</code>).</p>
              <p>2. Double-check deadline logs. Delayed assignments will require office authorization parameters to unlock.</p>
            </div>
          </div>
        </div>

        {/* Upload Homework Submission Modal overlay */}
        {activeSubmitAss && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Submit Coursework Homework</h3>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                <p className="font-bold text-slate-700">{activeSubmitAss.title}</p>
                <p className="text-[10px] text-slate-400 mt-1">Due Date limit coordinates: {activeSubmitAss.dueDate}</p>
              </div>

              <form onSubmit={handleSubmitAssignmentSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Homework File Name / URL Link</label>
                  <input 
                    type="text" required value={submissionFileName} onChange={e => setSubmissionFileName(e.target.value)}
                    placeholder="my_database_homework_submission.pdf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setActiveSubmitAss(null)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-colors">Submit homework</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. STUDY MATERIAL FILES TAB
  if (currentTab === 'study_materials') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Study Guides & Resources</h2>
          <p className="text-xs text-slate-400 mt-1">Download syllabi slides, PPT handouts, and reference readings shared by academic faculties.</p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shared Lecture Guides ({studentMaterials.length})</span>
          </div>

          {studentMaterials.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
              No lecture slide guides uploaded by professors yet. Check back later!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {studentMaterials.map(mat => {
                const sub = subjects.find(s => s.id === mat.subjectId);
                return (
                  <div key={mat.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50/40 text-xs font-semibold text-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-tight">{mat.title}</p>
                      <p className="text-slate-400 mt-1.5 font-medium">Subject Module: {sub?.name} ({sub?.code}) • Notes description: {mat.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-bold uppercase">{mat.fileType}</span>
                      <button 
                        onClick={() => alert(`Simulating file download: ${mat.fileName}`)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
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

  // 5. RESULTS GRADE SHEET TAB
  if (currentTab === 'results') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">My Academic Results Grade Sheet</h2>
          <p className="text-xs text-slate-400 mt-1">Review finalized internal/external course exam scores, totals, and letter grade classifications.</p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Academic Report Card ({studentResults.length} modules)</span>
          </div>

          {studentResults.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
              No exam results published for your session registration yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {studentResults.map(res => {
                const sub = subjects.find(s => s.id === res.subjectId);
                return (
                  <div key={res.id} className="px-6 py-4.5 flex justify-between items-center text-xs font-semibold text-slate-700">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{sub?.name} ({sub?.code})</p>
                      <p className="text-slate-400 mt-1.5 font-medium">Internal assessment score: {res.internalMarks}/40 • External theory score: {res.externalMarks}/60</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-extrabold rounded-lg">Grade {res.grade}</span>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-bold">Total Marks: {res.totalMarks}/100</p>
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

  // 6. GENERAL NOTICES TAB
  if (currentTab === 'notices') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Campus Notices Board</h2>
          <p className="text-xs text-slate-400 mt-1">View official campus circulars, urgent administrative warnings, and college events feeds.</p>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notice Bulletins Board ({notices.length} active notices)</span>
          </div>

          {notices.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold italic">
              No bulletins published on the board yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notices.map(notice => (
                <div key={notice.id} className="px-6 py-4 space-y-2 hover:bg-slate-50/40">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      notice.category === 'Urgent' ? 'bg-red-500/15 text-red-600' :
                      notice.category === 'Academic' ? 'bg-indigo-500/15 text-indigo-600' :
                      notice.category === 'Event' ? 'bg-amber-500/15 text-amber-600' : 'bg-slate-500/15 text-slate-600'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{notice.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{notice.title}</h4>
                  <p className="text-slate-500 text-xs whitespace-pre-line leading-relaxed">{notice.content}</p>
                  <span className="text-[10px] text-slate-400 block pt-1 font-semibold text-slate-500">Author: {notice.author}</span>
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
