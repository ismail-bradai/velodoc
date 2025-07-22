
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Calendar, FileText, Activity, Edit, Eye } from 'lucide-react';

const PatientDataPanel = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // get patient data from localStorage
  const patient = JSON.parse(localStorage.getItem('velodoc_session_patient') || '{}');
  // calculate age from dob
  const dob = new Date(patient.dob || '1990-01-01');
  const age = new Date().getFullYear() - dob.getFullYear();
  const patientData = {
    name: patient.name,
    dob: patient.dob || 'PLACEHOLDER - 1994-07-12',
    age: age || 31,
    gender: patient.gender || 'PLACEHOLDER - Female',
    languages: patient.language || 'PLACEHOLDER - English, Arabic',
    contact: patient.phone || 'PLACEHOLDER - +971 50 123 4567',
    email: patient.email || 'PLACEHOLDER - placeholder@email.com',
    mrn: patient.mrn || 'PLACEHOLDER - DNT-010289',
    insurance: patient.insurance || 'PLACEHOLDER - Standard Individual Plan'
  };

  // get the patient conditions from localStorage
  const patient_conditions = JSON.parse(localStorage.getItem('velodoc_patient_conditions') || '[]');
  const medicalAlerts = [
    { type: 'Allergy', content: 'Penicillin - Severe reaction', severity: 'high' },
    { type: 'Condition', content: patient_conditions[0]?.code + ' - ' + patient_conditions[0]?.clinical_status + ' | onset: ' + patient_conditions[0]?.onset_date + ' | abatement: ' + patient_conditions[0]?.abatement_date || 'Unknown', severity: patient_conditions[0]?.clinical_status || 'low' },
  ];

  const reports = [
    { title: 'Lab Results - Complete Blood Count', date: '2024-03-25', status: 'Completed' },
    { title: 'Chest X-Ray Report', date: '2024-03-20', status: 'Pending Review' },
    { title: 'Consultation Note - Cardiology', date: '2024-03-18', status: 'Completed' }
  ];

  const timeline = [
    { time: '9:02', event: 'Session started.' },
    { time: '9:04', event: 'Consultation initial assessment recorded.' },
    { time: '9:09', event: 'Drafted Initial Patient Report, estimated cost, produced suggestions.' },
    { time: '9:14', event: 'Created Patient Report.' },
    { time: '9:21', event: 'Patient provided Consent for treatment.' },
    { time: '9:22', event: 'Post-treatment report provided by Dr. Lina Mahmoud' },
    { time: '9:28', event: 'Post-treatment report generated' },
    { time: '9:33', event: 'Post-treatment report re-generated applying Velodoc\'s suggestions' },
    { time: '9:40', event: 'Insurance Claim Report generated' },
    { time: '9:41', event: 'Post-treatment report provided by Dr. Lina Mahmoud' }
  ];

  return (
    <div className="h-full flex flex-col">  
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{patientData.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-blue-100">
              <span>DOB: {patientData.dob} (Age: {patientData.age})</span>
              <Badge variant="secondary" className="bg-blue-500 text-white">
                {patientData.gender}
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm text-blue-100">
            <div>{patientData.insurance}</div>
            <div className="text-xs mt-1">MRN: {patientData.mrn}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="patient-data" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50 m-0 rounded-none border-b border-blue-200">
          <TabsTrigger value="reports" className="gap-2 text-blue-600 data-[state=active]:bg-blue-100">
            Reports
          </TabsTrigger>
          <TabsTrigger value="patient-data" className="gap-2 text-blue-600 data-[state=active]:bg-blue-100">
            Patient Data
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2 text-blue-600 data-[state=active]:bg-blue-100">
            Timeline
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="reports" className="p-6 space-y-4 m-0">
            <h3 className="text-lg font-semibold text-gray-900">Clinical Reports</h3>
            {reports.map((report, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-500">{report.date}</p>
                    </div>
                    <Badge variant={report.status === 'Completed' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="patient-data" className="p-6 space-y-4 m-0">
            {/* Overview Section */}
            <Card>
              <CardHeader className="pb-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('overview')}
                >
                  <CardTitle className="text-lg">Overview</CardTitle>
                  {expandedSections.overview ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </div>
              </CardHeader>
              {expandedSections.overview && (
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name</span>
                      <p className="font-medium">{patientData.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">DOB</span>
                      <p className="font-medium">{patientData.dob} (Age: {patientData.age})</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender</span>
                      <p className="font-medium">{patientData.gender}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Languages</span>
                      <p className="font-medium">{patientData.languages}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Contact</span>
                      <p className="font-medium">{patientData.contact}</p>
                      <p className="text-blue-600 text-xs">{patientData.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Insurance</span>
                      <p className="font-medium">{patientData.insurance}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Medical Alerts Section */}
            <Card>
              <CardHeader className="pb-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('alerts')}
                >
                  <CardTitle className="text-lg">Medical Alerts</CardTitle>
                  {expandedSections.alerts ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </div>
              </CardHeader>
              {expandedSections.alerts && (
                <CardContent className="space-y-3">
                  {medicalAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.severity !== 'resolved' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{alert.type}</p>
                        <p className="text-sm text-gray-600">{alert.content}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            {/* Report History Section */}
            <Card>
              <CardHeader className="pb-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSection('history')}
                >
                  <CardTitle className="text-lg">Report History</CardTitle>
                  {expandedSections.history ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </div>
              </CardHeader>
              {expandedSections.history && (
                <CardContent>
                  <p className="text-sm text-gray-500">Recent medical reports and documentation history will appear here.</p>
                </CardContent>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="p-0 m-0 bg-blue-50 h-full">
            <div className="p-6 space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-8 bg-blue-300 mt-1" />
                    )}
                  </div>
                  
                  {/* Time */}
                  <div className="text-blue-600 font-medium text-sm min-w-[3rem] mt-0.5">
                    {item.time}
                  </div>
                  
                  {/* Event description */}
                  <div className="flex-1 text-blue-700 text-sm leading-relaxed mt-0.5">
                    {item.event}
                  </div>
                  
                  {/* Action icons */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-blue-100 rounded">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-blue-100 rounded">
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </div>

        {/* Submit Button */}
        <div className="border-t p-4 bg-white">
          <Button className="w-full bg-gray-200 text-white-400 hover:bg-cyan-500">
            Submit to EHR
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default PatientDataPanel;
