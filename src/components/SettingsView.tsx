import React, { useState } from 'react';
import { Settings, Shield, HardDrive, Bell, RefreshCw, Download, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  onResetDatabase: () => void;
  onExportJsonBackup: () => void;
}

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetDatabase,
  onExportJsonBackup
}: SettingsViewProps) {
  const [campusName, setCampusName] = useState(settings.campusName);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [maxCapacity, setMaxCapacity] = useState(settings.maxCapacity);
  const [enableNotifications, setEnableNotifications] = useState(settings.enableNotifications);
  const [backupInterval, setBackupInterval] = useState(settings.backupInterval);

  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      campusName,
      academicYear,
      maxCapacity: Number(maxCapacity),
      enableNotifications,
      backupInterval,
      systemVersion: settings.systemVersion
    });

    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">System Configuration</h2>
        <p className="text-sm text-slate-500 mt-1">Calibrate system-wide parameters, set alerts, and manage database snapshots.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-bold text-slate-800 text-sm">Campus Global Configurations</h4>
              {showSavedToast && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Settings Saved</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Campus Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Official Campus Entity</label>
                  <input 
                    type="text" 
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>

                {/* Academic Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Current Academic Year</label>
                  <input 
                    type="text" 
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>

                {/* Backup intervals */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Database Snapshot Frequency</label>
                  <select 
                    value={backupInterval}
                    onChange={(e) => setBackupInterval(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium cursor-pointer"
                  >
                    <option value="Daily">Daily Automated Sync</option>
                    <option value="Weekly">Weekly Scheduled Dump</option>
                    <option value="Monthly">Monthly Cold Storage Archive</option>
                  </select>
                </div>

                {/* Student limits slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-slate-500 uppercase tracking-wider">Campus Capacity Limit</label>
                    <span className="font-bold text-slate-700">{maxCapacity.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5000" 
                    max="20000" 
                    step="500"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Notification toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100/80">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-700">Push Notification Alerts</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Send immediate alerts regarding notices or timetable overrides.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={enableNotifications}
                    onChange={(e) => setEnableNotifications(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <button 
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs self-end"
              >
                <Settings className="w-4 h-4" />
                <span>Save Configurations</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Database Operation & Guides */}
        <div className="lg:col-span-1 space-y-6">
          {/* DB Snapshots Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-slate-800 text-sm">Database & Storage Operations</h4>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Export high-fidelity JSON files containing current rolls, class schedules, assignments, and campus memos.
            </p>

            <div className="space-y-2.5">
              <button 
                onClick={onExportJsonBackup}
                className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Backup JSON Dataset</span>
              </button>

              {showResetWarning ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2.5 animate-fade-in">
                  <div className="flex gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-[11px] font-bold leading-snug">This will delete all custom additions and reset baseline stats!</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { onResetDatabase(); setShowResetWarning(false); }}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-md text-[10px] font-bold cursor-pointer hover:bg-red-700"
                    >
                      Confirm Reset
                    </button>
                    <button 
                      onClick={() => setShowResetWarning(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-md text-[10px] font-semibold cursor-pointer hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowResetWarning(true)}
                  className="w-full py-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Factory Reset Database</span>
                </button>
              )}
            </div>
          </div>

          {/* Guidelines / Policies Memo */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2.5 text-slate-600">
              <FileText className="w-5 h-5" />
              <h4 className="font-bold text-slate-700 text-xs">Administrative Standards</h4>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Maintain academic directory consistency. Always log student attendance parameters at the end of each weekly course lecture block. Notice declarations must avoid redundant publishing.
            </p>
            <div className="text-[10px] text-slate-500 font-semibold space-y-1 pt-2 border-t border-slate-200/60">
              <div className="flex justify-between">
                <span>System License:</span>
                <span>EduCore-v{settings.systemVersion}</span>
              </div>
              <div className="flex justify-between">
                <span>Database Engine:</span>
                <span>SQLite (InMemory Client)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
