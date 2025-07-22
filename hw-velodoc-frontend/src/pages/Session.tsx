
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import PatientDataPanel from '@/components/PatientDataPanel';
import SessionHeader from '@/components/SessionHeader';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Session = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('velodoc_auth');
    const userData = localStorage.getItem('velodoc_user');
    
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('velodoc_auth');
    localStorage.removeItem('velodoc_user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SessionHeader user={user} onLogout={handleLogout} />
      
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Chat Interface - Left Panel (1/3 default) */}
          <ResizablePanel defaultSize={33} minSize={20} maxSize={50} className="bg-white">
            <ChatInterface />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />
          
          {/* Patient Data Panel - Right Panel (2/3 default) */}
          <ResizablePanel defaultSize={67} minSize={50} maxSize={80} className="bg-white">
            <PatientDataPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Session;
