import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Megaphone, 
  BookOpen, 
  Check, 
  FileText, 
  Printer, 
  Clipboard, 
  Home, 
  Calendar, 
  CheckSquare, 
  User as UserIcon,
  Search,
  Plus,
  Compass,
  AlertTriangle,
  Lock,
  Mail,
  Smartphone,
  MapPin,
  CalendarDays
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AdminPortal from './components/AdminPortal';
import TeacherPortal from './components/TeacherPortal';
import StudentPortal from './components/StudentPortal';
import LoginView from './components/LoginView';

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
} from './types';

import { getDB, saveDB, DBStore } from './data/dbStore';

export default function App() {
  // DB State Loader
  const [db, setDb] = useState<DBStore>(getDB);

  // Sync back to local storage whenever DB state changes
  useEffect(() => {
    saveDB(db);
  }, [db]);

  // Extract variables
  const users = db.users;
  const students = db.students;
  const teachers = db.teachers;
  const departments = db.departments;
  const courses = db.courses;
  const subjects = db.subjects;
  const timetables = db.timetables || [];
  const attendance = db.attendance || [];
  const teacherAttendance = db.teacher_attendance || [];
  const assignments = db.assignments || [];
  const assignmentSubmissions = db.assignment_submissions || [];
  const studyMaterials = db.study_materials || [];
  const notices = db.notices || [];
  const results = db.results || [];
  const academicSessions = db.academic_sessions || [];
  const notes = db.notes || [];
  const settings = db.settings;
  const currentUser = db.currentUser;

  // Local active states
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<string[]>(['System loaded successfully. Ready for operations.']);

  // Profile Form state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileOffice, setProfileOffice] = useState('');

  // Sync profile editing form when user swaps
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfilePassword('');
    }
  }, [currentUser]);

  // Logging utility
  const logActivity = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setActivityLogs(prev => [`[${time}] ${msg}`, ...prev]);
  };

  // State wrappers for Admin/Teacher/Student child operations
  const setUsers: React.Dispatch<React.SetStateAction<User[]>> = (val) => {
    setDb(prev => {
      const nextUsers = typeof val === 'function' ? val(prev.users) : val;
      return { ...prev, users: nextUsers };
    });
  };

  const setStudents: React.Dispatch<React.SetStateAction<Student[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.students) : val;
      return { ...prev, students: next };
    });
  };

  const setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.teachers) : val;
      return { ...prev, teachers: next };
    });
  };

  const setDepartments: React.Dispatch<React.SetStateAction<Department[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.departments) : val;
      return { ...prev, departments: next };
    });
  };

  const setCourses: React.Dispatch<React.SetStateAction<Course[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.courses) : val;
      return { ...prev, courses: next };
    });
  };

  const setSubjects: React.Dispatch<React.SetStateAction<Subject[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.subjects) : val;
      return { ...prev, subjects: next };
    });
  };

  const setTimetables: React.Dispatch<React.SetStateAction<TimetableSlot[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.timetables || []) : val;
      return { ...prev, timetables: next };
    });
  };

  const setAttendance: React.Dispatch<React.SetStateAction<Attendance[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.attendance || []) : val;
      return { ...prev, attendance: next };
    });
  };

  const setTeacherAttendance: React.Dispatch<React.SetStateAction<TeacherAttendance[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.teacher_attendance || []) : val;
      return { ...prev, teacher_attendance: next };
    });
  };

  const setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.assignments || []) : val;
      return { ...prev, assignments: next };
    });
  };

  const setAssignmentSubmissions: React.Dispatch<React.SetStateAction<AssignmentSubmission[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.assignment_submissions || []) : val;
      return { ...prev, assignment_submissions: next };
    });
  };

  const setStudyMaterials: React.Dispatch<React.SetStateAction<StudyMaterial[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.study_materials || []) : val;
      return { ...prev, study_materials: next };
    });
  };

  const setNotices: React.Dispatch<React.SetStateAction<Notice[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.notices || []) : val;
      return { ...prev, notices: next };
    });
  };

  const setResults: React.Dispatch<React.SetStateAction<Result[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.results || []) : val;
      return { ...prev, results: next };
    });
  };

  const setAcademicSessions: React.Dispatch<React.SetStateAction<AcademicSession[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.academic_sessions || []) : val;
      return { ...prev, academic_sessions: next };
    });
  };

  const setNotes: React.Dispatch<React.SetStateAction<Note[]>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.notes || []) : val;
      return { ...prev, notes: next };
    });
  };

  const setSettings: React.Dispatch<React.SetStateAction<SystemSettings>> = (val) => {
    setDb(prev => {
      const next = typeof val === 'function' ? val(prev.settings) : val;
      return { ...prev, settings: next };
    });
  };


  // ------------------------------------
  // Authentication Handlers
  // ------------------------------------
  const handleLogin = (email: string, passwordHash: string): boolean => {
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      if (!matched.isActive) {
        alert('This account is pending approval or has been suspended.');
        return false;
      }
      if (matched.passwordHash === passwordHash) {
        setDb(prev => ({ ...prev, currentUser: matched, token: 'demo_jwt_token' }));
        logActivity(`${matched.role} ${matched.name} successfully logged in.`);
        setCurrentTab('dashboard');
        return true;
      }
    }
    return false;
  };

  const handleRegister = (name: string, email: string, passwordHash: string, role: any) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email: email.toLowerCase(),
      role,
      passwordHash,
      isActive: role === 'ADMIN' ? true : false,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, newUser]);
    logActivity(`Registered new user account: ${newUser.email} as ${role}`);
  };

  const handleGoogleLogin = (email: string, name?: string, role?: any) => {
    const emailLower = email.toLowerCase();
    let matched = users.find(u => u.email.toLowerCase() === emailLower);

    if (!matched) {
      // First time Google Sign In -> Register account automatically
      const assignedRole = role || 'STUDENT';
      const assignedName = name || emailLower.split('@')[0]
        .replace(/[^a-zA-Z]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

      const newUser: User = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        name: assignedName,
        email: emailLower,
        role: assignedRole,
        passwordHash: 'google_oauth_bypass_secret',
        isActive: assignedRole === 'ADMIN' ? true : false,
        createdAt: new Date().toISOString()
      };

      // Also create corresponding Student or Teacher record if appropriate
      if (assignedRole === 'STUDENT') {
        const freshStudent: Student = {
          id: 'stu-' + newUser.id,
          userId: newUser.id,
          studentId: 'STU-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
          departmentId: 'dept-cs',
          courseId: 'crs-bsc-cs',
          academicSessionId: 'sess-fall',
          createdAt: new Date().toISOString()
        };
        setStudents(prev => [...prev, freshStudent]);
      } else if (assignedRole === 'TEACHER') {
        const freshTeacher: Teacher = {
          id: 'prof-' + newUser.id,
          userId: newUser.id,
          office: 'Block C, Rm ' + Math.floor(101 + Math.random() * 200),
          departmentId: 'dept-cs',
          createdAt: new Date().toISOString()
        };
        setTeachers(prev => [...prev, freshTeacher]);
      }

      setUsers(prev => [...prev, newUser]);
      logActivity(`Registered new user via Google SSO: ${newUser.email} as ${assignedRole}`);
      
      if (!newUser.isActive) {
        alert('Your Google registration has been submitted and is awaiting approval.');
        return false;
      }
      matched = newUser;
    } else {
      if (!matched.isActive) {
        alert('This account is pending approval or has been suspended.');
        return false;
      }
      logActivity(`${matched.role} ${matched.name} successfully logged in via Google SSO.`);
    }

    setDb(prev => ({ ...prev, currentUser: matched, token: 'google_sso_token_active' }));
    setCurrentTab('dashboard');
    return true;
  };

  const handleLogout = () => {
    if (currentUser) {
      logActivity(`User ${currentUser.email} logged out.`);
    }
    setDb(prev => ({ ...prev, currentUser: null, token: null }));
    setCurrentTab('dashboard');
  };

  // Profile update handler
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const next: User = { ...u, name: profileName };
        if (profilePassword) {
          next.passwordHash = profilePassword;
        }
        return next;
      }
      return u;
    }));

    // Update current session user view as well
    setDb(prev => {
      if (prev.currentUser) {
        const updated = { ...prev.currentUser, name: profileName };
        if (profilePassword) {
          updated.passwordHash = profilePassword;
        }
        return { ...prev, currentUser: updated };
      }
      return prev;
    });

    logActivity(`Updated profile details for ${profileName}`);
    alert('Profile credentials saved successfully.');
    setProfilePassword('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("Image size must be less than 500KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setDb(prev => {
        if (!prev.currentUser) return prev;
        const updatedUser = { ...prev.currentUser, avatar: base64 };
        const updatedUsers = prev.users.map(u => u.id === prev.currentUser?.id ? updatedUser : u);
        return {
          ...prev,
          currentUser: updatedUser,
          users: updatedUsers
        };
      });
      logActivity("Updated profile photo.");
      alert("Profile picture updated successfully.");
    };
    reader.readAsDataURL(file);
  };


  // If no user is logged in, show authentication portal
  if (!currentUser) {
    return (
      <LoginView 
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGoogleLogin={handleGoogleLogin}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased flex">
      {/* Dynamic Collapsible Sidebar based on role */}
      <Sidebar 
        currentTab={currentTab} 
        onNavigate={setCurrentTab} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={currentUser.role}
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen relative pb-14 md:pb-0">
        
        {/* Top Header with dynamic profile avatar */}
        <Header 
          profile={currentUser} 
          onNavigate={setCurrentTab} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSearch={setSearchQuery}
        />

        {/* Dynamic View stage router */}
        <main className="p-6 flex-1 max-w-7xl w-full mx-auto pb-12">
          
          {/* 1. ROLE-BASED DASHBOARD ROUTING */}
          {currentTab === 'dashboard' && (
            <DashboardView 
              role={currentUser.role}
              currentUser={currentUser}
              users={users}
              students={students}
              teachers={teachers}
              departments={departments}
              courses={courses}
              subjects={subjects}
              timetables={timetables}
              attendance={attendance}
              assignments={assignments}
              assignmentSubmissions={assignmentSubmissions}
              studyMaterials={studyMaterials}
              notices={notices}
              results={results}
              academicSessions={academicSessions}
              settings={settings}
              onNavigate={setCurrentTab}
              activityLogs={activityLogs}
            />
          )}

          {/* 2. CORE PORTALS INNER FORMS ROUTING */}
          {currentUser.role === 'ADMIN' && (
            <AdminPortal 
              currentTab={currentTab}
              currentUser={currentUser}
              users={users}
              students={students}
              teachers={teachers}
              departments={departments}
              courses={courses}
              subjects={subjects}
              timetables={timetables}
              notices={notices}
              results={results}
              academicSessions={academicSessions}
              notes={notes}
              settings={settings}
              onNavigate={setCurrentTab}
              setUsers={setUsers}
              setStudents={setStudents}
              setTeachers={setTeachers}
              setDepartments={setDepartments}
              setCourses={setCourses}
              setSubjects={setSubjects}
              setTimetables={setTimetables}
              setNotices={setNotices}
              setResults={setResults}
              setAcademicSessions={setAcademicSessions}
              setNotes={setNotes}
              setSettings={setSettings}
              logActivity={logActivity}
            />
          )}

          {currentUser.role === 'TEACHER' && (
            <TeacherPortal 
              currentTab={currentTab}
              currentUser={currentUser}
              users={users}
              students={students}
              teachers={teachers}
              departments={departments}
              courses={courses}
              subjects={subjects}
              timetables={timetables}
              attendance={attendance}
              teacherAttendance={teacherAttendance}
              assignments={assignments}
              assignmentSubmissions={assignmentSubmissions}
              studyMaterials={studyMaterials}
              notices={notices}
              results={results}
              academicSessions={academicSessions}
              onNavigate={setCurrentTab}
              setAttendance={setAttendance}
              setTeacherAttendance={setTeacherAttendance}
              setAssignments={setAssignments}
              setAssignmentSubmissions={setAssignmentSubmissions}
              setStudyMaterials={setStudyMaterials}
              setNotices={setNotices}
              setResults={setResults}
              logActivity={logActivity}
              setUsers={setUsers}
            />
          )}

          {currentUser.role === 'STUDENT' && (
            <StudentPortal 
              currentTab={currentTab}
              currentUser={currentUser}
              users={users}
              students={students}
              teachers={teachers}
              departments={departments}
              courses={courses}
              subjects={subjects}
              timetables={timetables}
              attendance={attendance}
              assignments={assignments}
              assignmentSubmissions={assignmentSubmissions}
              studyMaterials={studyMaterials}
              notices={notices}
              results={results}
              academicSessions={academicSessions}
              onNavigate={setCurrentTab}
              setAssignmentSubmissions={setAssignmentSubmissions}
              logActivity={logActivity}
            />
          )}

          {/* 3. PROFILE DETAILS & CREDENTIAL UPDATE (ALL ROLES) */}
          {currentTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">My Workspace Account</h2>
                <p className="text-xs text-slate-400 mt-1">Review active credential specifications and configure password configurations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm">Account Specification parameters</h3>
                  <div className="space-y-3.5 text-xs text-slate-600 font-semibold leading-relaxed">
                    <p className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">System Role ID:</span> <span>{currentUser.role}</span></p>
                    <p className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Associated Email:</span> <span>{currentUser.email}</span></p>
                    <p className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Campus Status:</span> <span className="text-emerald-700">Active</span></p>
                    {currentUser.role === 'STUDENT' && (
                      <>
                        <p className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Student Roll ID:</span> <span>{students.find(s => s.userId === currentUser.id)?.studentId || 'N/A'}</span></p>
                        <p className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Major Department:</span> <span>{departments.find(d => d.id === students.find(s => s.userId === currentUser.id)?.departmentId)?.name || 'N/A'}</span></p>
                      </>
                    )}
                    {currentUser.role === 'TEACHER' && (
                      <>
                        <p className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Office Room:</span> <span>{teachers.find(t => t.userId === currentUser.id)?.office || 'N/A'}</span></p>
                        <p className="flex justify-between border-b border-slate-100 pb-2"><span className="text-slate-400">Department:</span> <span>{departments.find(d => d.id === teachers.find(t => t.userId === currentUser.id)?.departmentId)?.name || 'N/A'}</span></p>
                      </>
                    )}
                  </div>
                </div>

                {/* Form to change name and password */}
                <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                  <h3 className="font-bold text-slate-850 text-sm">Update Access Credentials</h3>
                  
                  {/* Profile Picture Upload Section */}
                  <div className="flex flex-col items-center pb-4 border-b border-slate-100">
                    <div className="relative group">
                      {currentUser.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt={currentUser.name} 
                          className="w-20 h-20 rounded-full border-2 border-emerald-400 object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full border-2 border-emerald-400 bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xl select-none">
                          {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <label className="inline-block py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-lg text-xs transition-colors cursor-pointer select-none">
                        Upload Profile Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or GIF up to 500KB</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Full Name</label>
                      <input 
                        type="text" required value={profileName} onChange={e => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Update Password</label>
                      <input 
                        type="password" value={profilePassword} onChange={e => setProfilePassword(e.target.value)}
                        placeholder="Leave blank to retain current password"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg focus:outline-none"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-[#334155] text-slate-100 font-bold rounded-lg text-xs hover:bg-slate-700 transition-colors cursor-pointer select-none">
                      Save Account Credentials
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Sticky footer */}
        <footer className="mt-auto px-6 py-4 text-center border-t border-slate-200 bg-slate-100 text-slate-400 text-[11px] font-semibold tracking-wider">
          © {new Date().getFullYear()} {settings.campusName} Unified Academic ERP System.
        </footer>
      </div>

      {/* Bottom Navigation (Mobile Viewports Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 h-14 bg-white border-t border-slate-200 shadow-lg flex justify-around items-center px-4 pb-safe">
        <button 
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button 
          onClick={() => setCurrentTab('timetable')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'timetable' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Schedule</span>
        </button>

        <button 
          onClick={() => setCurrentTab('assignments')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'assignments' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tasks</span>
        </button>

        <button 
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            currentTab === 'profile' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </nav>
    </div>
  );
}
