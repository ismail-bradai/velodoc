
import { Card, CardContent } from '@/components/ui/card';

interface SessionCardProps {
  session: {
    id: number;
    patientName: string;
    age: number;
    summary: string;
    status: string;
    date: string;
    time: string;
    dentId: string;
  };
}

const SessionCard = ({ session }: SessionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Treatment released':
        return 'bg-blue-500 text-white';
      case 'Report shared':
        return 'bg-blue-500 text-white';
      case 'Consign approved':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{session.patientName}</h3>
            <span className="text-cyan-500 text-sm font-medium">{session.age}</span>
          </div>
          <span className="text-cyan-500 text-sm font-medium">{session.age}</span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 leading-relaxed">
          {session.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
            {session.status}
          </span>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-gray-500 text-xs">
            {session.date} · {session.time}
          </span>
          <span className="text-gray-500 text-xs">
            {session.dentId}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
