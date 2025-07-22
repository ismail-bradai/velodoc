import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SsoLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSSOSession = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          credentials: 'include', // important to include cookies
        });

        if (!res.ok){
          // log error if not ok
          console.error('SSO session fetch error:', res.statusText);
          throw new Error('Session fetch failed');
        } 
  

        const { velodoc_user, velodoc_session_patient, velodoc_patient_conditions, ehr_token, ehr_refresh_token } = await res.json();
        console.log('SSO session:', velodoc_user, ehr_token, ehr_refresh_token, velodoc_patient_conditions);

        // Store in localStorage
        localStorage.setItem('velodoc_auth', 'true');
        localStorage.setItem('velodoc_user', JSON.stringify(velodoc_user));
        localStorage.setItem('velodoc_ehr_token', ehr_token);
        localStorage.setItem('velodoc_ehr_refresh_token', ehr_refresh_token);
        localStorage.setItem('velodoc_session_patient', JSON.stringify(velodoc_session_patient));
        localStorage.setItem('velodoc_patient_conditions', JSON.stringify(velodoc_patient_conditions));

        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('SSO session failed:', err); 
        navigate('/login');
      }
    };

    fetchSSOSession();
  }, []);

  return <div>Loading your EHR session...</div>;
}
