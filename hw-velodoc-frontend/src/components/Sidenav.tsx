// src/components/Sidenav.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Grid2x2, User } from 'lucide-react';

const Sidenav = ({ user, onLogout }: { user: any; onLogout: () => void }) => {
  const navigate = useNavigate();
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  return (
    <div className="fixed top-1/2 -translate-y-1/2 left-4 z-50 flex flex-col items-center bg-white shadow-md rounded-full py-4 px-2 space-y-6">
      {/* Home Icon */}
      <button
        onClick={() => navigate('/dashboard')}
        className="text-blue-600 hover:text-blue-800"
      >
        <Grid2x2 className="w-6 h-6" />
      </button>

      {/* Separator */}
      <div className="w-6 border-t border-gray-200"></div>

      {/* Bell Icon */}
      <button className="text-blue-600 hover:text-blue-800">
        <Bell className="w-6 h-6" />
      </button>

      {/* Profile Picture with Hover Popup */}
      <div
        className="relative"
        onMouseEnter={() => setShowProfilePopup(true)}
        onMouseLeave={() => setShowProfilePopup(false)}
      >
        <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:ring-2 ring-blue-400">
          <User className="w-6 h-6" />
        </button>

        {showProfilePopup && (
          <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-3 min-w-[150px] z-50">
            <div className="text-sm font-semibold text-gray-700 mb-2">{user?.name}</div>
            <button
              onClick={onLogout}
              className="w-full text-left text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidenav;
