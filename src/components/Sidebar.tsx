import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  ClipboardCheck, 
  Megaphone, 
  FileEdit, 
  User, 
  Settings,
  GraduationCap,
  Building,
  Users,
  Award,
  BookMarked,
  Layers,
  FileUp,
  FolderOpen,
  History,
  Activity,
  LogOut,
  Calendar
} from 'lucide-react';
import { Role } from '../types';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onLogout: () => void;
}

export default function Sidebar({ currentTab, onNavigate, isOpen, onClose, role, onLogout }: SidebarProps) {
  
  // Dynamic links according to roles
  const getMenuItems = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'departments', label: 'Departments', icon: Building },
          { id: 'courses', label: 'Courses', icon: Layers },
          { id: 'subjects', label: 'Subjects', icon: BookMarked },
          { id: 'students', label: 'Students Directory', icon: Users },
          { id: 'teachers', label: 'Teachers Directory', icon: User },
          { id: 'timetable', label: 'Academic Timetable', icon: CalendarDays },
          { id: 'notices', label: 'Notice Board', icon: Megaphone },
          { id: 'results', label: 'Student Results', icon: Award },
          { id: 'notes', label: 'System Notes', icon: FileEdit },
        ];
      case 'TEACHER':
        return [
          { id: 'dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
          { id: 'mark_attendance', label: 'Mark Student Attendance', icon: ClipboardCheck },
          { id: 'own_attendance', label: 'My Attendance Logs', icon: Calendar },
          { id: 'assignments', label: 'Manage Assignments', icon: BookOpen },
          { id: 'upload_notes', label: 'Upload Materials', icon: FileUp },
          { id: 'post_notices', label: 'Post Notices', icon: Megaphone },
          { id: 'students_records', label: 'View Student Records', icon: Users },
          { id: 'internal_marks', label: 'Enter Results/Marks', icon: Award },
          { id: 'timetable', label: 'My Class Schedule', icon: CalendarDays },
        ];
      case 'STUDENT':
        return [
          { id: 'dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'My Attendance Details', icon: ClipboardCheck },
          { id: 'timetable', label: 'My Class Timetable', icon: CalendarDays },
          { id: 'assignments', label: 'My Assignments', icon: BookOpen },
          { id: 'study_materials', label: 'Study Materials', icon: FolderOpen },
          { id: 'results', label: 'My Results', icon: Award },
          { id: 'notices', label: 'Notices Board', icon: Megaphone },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const subItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    ...(role === 'ADMIN' ? [{ id: 'settings', label: 'System Settings', icon: Settings }] : [])
  ];

  const handleNav = (tabId: string) => {
    onNavigate(tabId);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-200"
        ></div>
      )}

      <aside 
        className={`h-full w-64 fixed left-0 top-0 bg-[#334155] text-slate-100 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Area */}
        <div className="px-6 py-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[#6ffbbe]" />
            <h1 className="text-xl font-bold font-sans tracking-tight text-white">EduCore ERP</h1>
          </div>
          <p className="text-xs text-[#bec6e0] font-sans font-semibold uppercase tracking-widest mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {role === 'ADMIN' ? 'Admin Portal' : role === 'TEACHER' ? 'Teacher Portal' : 'Student Portal'}
          </p>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#6ffbbe] text-[#002113] border-l-4 border-[#10b981] shadow-md shadow-emerald-500/10'
                    : 'text-[#bec6e0] hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Separation line & secondary items */}
          <div className="pt-4 mt-4 border-t border-slate-700/50 space-y-1">
            {subItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#6ffbbe] text-[#002113] border-l-4 border-[#10b981]'
                      : 'text-[#bec6e0] hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-300 hover:text-white hover:bg-red-500/10 transition-all cursor-pointer mt-4"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
