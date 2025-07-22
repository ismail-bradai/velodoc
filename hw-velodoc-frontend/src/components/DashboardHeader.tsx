
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    ehrProvider?: string;
  };
  onLogout: () => void;
}

const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/vd_circle.png" alt="Velodoc Logo" className="h-10 w-10" />

          <span className="text-2xl font-semibold text-gray-900">Velodoc</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{user.name}</span>
            {user.ehrProvider && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                {user.ehrProvider}
              </span>
            )}
          </div>
          
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-gray-800"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
