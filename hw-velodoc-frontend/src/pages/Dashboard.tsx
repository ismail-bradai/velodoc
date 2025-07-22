
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Grid2x2, List, Calendar } from 'lucide-react';
import SessionCard from '@/components/SessionCard';
import DashboardHeader from '@/components/DashboardHeader';

import CalendarView from '@/components/CalendarView';
import Sidenav from '@/components/Sidenav';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('velodoc_auth');
    const user_data = localStorage.getItem('velodoc_user');
    console.log('User data from localStorage:', user_data);
    
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (user_data) {
      setUser(JSON.parse(user_data));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('velodoc_auth');
    localStorage.removeItem('velodoc_user');
    localStorage.removeItem('velodoc_ehr_token');
    localStorage.removeItem('velodoc_ehr_refresh_token');
    localStorage.removeItem('velodoc_session_patient');
    setUser(null);
    navigate('/');
  };

  const handleStartNewSession = () => {
    navigate('/session');
  };

  // Mock session data based on the design
  const sessions = [
    {
      id: 1,
      patientName: 'James Smith',
      age: 21,
      summary: 'Follow-up: mild decay, preventive care advised.',
      status: 'Treatment released',
      date: '2025-03-01',
      time: '9:00',
      dentId: 'DNT-2025-8425'
    },
    {
      id: 2,
      patientName: 'Aisha Al Qasimi',
      age: 48,
      summary: 'Cracked tooth, crown prep discussed.',
      status: 'Report shared',
      date: '2025-03-01',
      time: '9:30',
      dentId: 'DNT-2025-1382'
    },
    {
      id: 3,
      patientName: 'Maha Al Mehairi',
      age: 33,
      summary: 'Patient in pain, extraction planned.',
      status: 'Treatment released',
      date: '2025-03-01',
      time: '10:00',
      dentId: 'DNT-2025-8058'
    },
    {
      id: 4,
      patientName: 'Khalid Al Nuaimi',
      age: 25,
      summary: 'Mild decay, preventive care advised.',
      status: 'Treatment released',
      date: '2025-03-01',
      time: '10:30',
      dentId: 'DNT-2025-7142'
    },
    {
      id: 5,
      patientName: 'Noora Al Mazrouei',
      age: 21,
      summary: 'Crown required after fracture observed.',
      status: 'Treatment released',
      date: '2025-03-01',
      time: '11:00',
      dentId: 'DNT-2025-4315'
    },
    {
      id: 6,
      patientName: 'Anna Petrova',
      age: 27,
      summary: 'X-ray shows retained root fragment.',
      status: 'Consign approved',
      date: '2025-03-01',
      time: '12:30',
      dentId: 'DNT-2025-3556'
    },
    {
      id: 7,
      patientName: 'Saeed Al Marri',
      age: 16,
      summary: 'Wisdom tooth impaction confirmed.',
      status: 'Report shared',
      date: '2025-03-01',
      time: '13:00',
      dentId: 'DNT-2025-7023'
    },
    {
      id: 8,
      patientName: 'Maria Lopez',
      age: 65,
      summary: 'X-ray clear, no treatment needed.',
      status: 'Treatment released',
      date: '2025-03-01',
      time: '13:30',
      dentId: 'DNT-2025-4070'
    },
    {
      id: 9,
      patientName: 'Ayesha Khan',
      age: 77,
      summary: 'Follow-up: routine cleaning completed successfully.',
      status: 'Consign approved',
      date: '2025-03-01',
      time: '14:00',
      dentId: 'DNT-2025-1549'
    },
    {
      id: 10,
      patientName: 'Hassan Al Remeithi',
      age: 26,
      summary: 'Wisdom tooth impaction confirmed.',
      status: 'Report shared',
      date: '2025-03-01',
      time: '14:30',
      dentId: 'DNT-2025-7318'
    },
    {
      id: 11,
      patientName: 'Imran Siddiqui',
      age: 56,
      summary: 'Deep cavity found, needs root canal.',
      status: 'Treatment released',
      date: '2025-03-01',
      time: '15:00',
      dentId: 'DNT-2025-9268'
    },
    {
      id: 12,
      patientName: 'Mohammed Al Falasi',
      age: 19,
      summary: 'Tooth mobility noted, possible bone loss.',
      status: 'Consign approved',
      date: '2025-03-01',
      time: '15:30',
      dentId: 'DNT-2025-1725'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} onLogout={handleLogout} />
      <div className="px-6 py-6">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={handleStartNewSession}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Start new session
          </Button>
          
          <div className="flex items-center gap-4">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option>Most recent</option>
              <option>Oldest first</option>
              <option>By patient name</option>
            </select>
            
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid2x2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 text-center text-gray-500">
              List view - Coming soon
            </div>
          </div>
        )}

{viewMode === 'calendar' && (
  <div className="rounded-lg border border-blue-500 overflow-hidden">
    <CalendarView />
  </div>
)}
      </div>
    </div>
  );
};

export default Dashboard;
