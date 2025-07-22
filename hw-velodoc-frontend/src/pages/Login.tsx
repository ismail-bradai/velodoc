import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Login = () => {
  const [email_or_username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    setIsFormValid(email_or_username.trim() !== '' && password.trim() !== '');
  }, [email_or_username, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    setError('');
  try {
    // call backend login API
    const res = await fetch(`${BACKEND_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email_or_username, password: password }),
    });
    if (!res.ok) {
      setError('Invalid credentials');
      setIsLoading(false);
      return;
    }
    const { token } = await res.json();
    localStorage.setItem('velodoc_token', token);

    // Fetch user profile
    const user_profile = await fetch(`${BACKEND_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!user_profile.ok) {
      setError('Failed to fetch user profile');
      setIsLoading(false);
      return;
    }
    const { user } = await user_profile.json();
    console.log('User profile:', user);
    localStorage.setItem('velodoc_auth', 'true');
    localStorage.setItem('velodoc_user', JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
        ehrProvider: 'CERNER - Connected'
      }));

    //setIsLoading(false); 

    if (user.role === 'doctor') {
      console.log('Doctor logged in. Redirecting to dashboard...');
      setIsLoading(false);
      navigate('/dashboard');
    } else {
      setError('Access restricted to doctors only in this stage!');
      setIsLoading(false);
    }
  } catch (err) {
    setError('Login failed');
    setIsLoading(false);
  }
};

  const handleEHRLogin = () => {
    // Redirect the user to the authorization endpoint with the client_id, response_type, scope, aud, and redirect_uri to get the authorization code

    const EHR_AUTH_URL = import.meta.env.VITE_EHR_TYPE === 'CERNER'? import.meta.env.VITE_CERNER_FHIR_AUTH_ENDPOINT : import.meta.env.VITE_HEALTHIT_FHIR_AUTH_ENDPOINT;

    const params = new URLSearchParams({
    response_type: 'code', 
    client_id: import.meta.env.VITE_EHR_TYPE === 'CERNER' ? import.meta.env.VITE_CERNER_CLIENT_ID : import.meta.env.VITE_HEALTHIT_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_EHR_TYPE === 'CERNER' ? import.meta.env.VITE_CERNER_REDIRECT_URI : import.meta.env.VITE_HEALTHIT_FHIR_REDIRECT_URI,
    scope: 'openid fhirUser online_access user/*.read user/Patient.read user/Practitioner.read user/Encounter.read', //user/Practitioner.read user/Schedule.read',
    aud: import.meta.env.VITE_EHR_TYPE === 'CERNER' ? import.meta.env.VITE_CERNER_FHIR_BASE_URL : import.meta.env.VITE_HEALTHIT_FHIR_BASE_URL,
    state: crypto.randomUUID(), // optional: for CSRF protection
  })

    const auth_redirect_uri = `${EHR_AUTH_URL}?${params.toString()}`;
    // call the EHR authorization endpoint
    window.location.href = auth_redirect_uri;
    // call and get the response from the callback endpoint including token, refresh token, and user profile
    
    /*
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('velodoc_auth', 'true');
      localStorage.setItem('velodoc_user', JSON.stringify({
        name: 'Dr. Nadia',
        email: 'dr.nadia@velodoc.ai',
        role: 'doctor',
        ehrProvider: 'CERNER - Connected',
      }));
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
    */
  };

  return (
    <div className="flex min-h-screen w-full">
      
      {/* Left side: Centered Branding + Form */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm text-center mb-10">
          {/* Centered Branding */}
          <div className="inline-flex items-center justify-center gap-3 mb-3">
             <img src="/assets/vd_circle.png" alt="Velodoc Logo" className="h-10 w-10" />

            <h1 className="text-xl font-semibold text-gray-900">Velodoc</h1>
          </div>
          <p className="text-gray-600 text-sm">Simplifying admin, Amplifying care.</p>
          <p className="text-gray-600 text-sm">Hello-World-Version! ☺️</p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-sm">
          <Card className="shadow-none border-0">
            <CardHeader className="pb-0">
              <CardTitle className="sr-only">Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="email">Username / Email</Label>
                  <Input
                    id="email_or_username"
                    type="text"
                    placeholder="john.doe@mail.com"
                    value={email_or_username}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-cyan-600 hover:underline">Forgot?</a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                 {/* Add error display */}
                 {error && (
                   <div className="text-red-500 text-sm text-center">{error}</div>
             )}

                <Button 
                  type="submit"
                  className={`w-full h-11 ${
                    isFormValid
                      ? 'bg-cyan-500 hover:bg-cyan-600 text-white'
                      : 'bg-blue-100 text-blue-500 cursor-not-allowed'
                  }`}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? 'Signing in...' : 'SIGN IN'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">OR</span>
                </div>
              </div>

              <Button
                onClick={handleEHRLogin}
                className="w-full h-11 bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={isLoading}
              >
                <Building2 className="w-4 h-4 mr-2" />
                {isLoading ? 'Connecting...' : 'EHR SSO LOG IN'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side: Cyan background */}
      <div className="w-1/2 bg-cyan-500"></div>
    </div>
  );
};

export default Login;


