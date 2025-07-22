import { EHRInterface } from '../integrations/ehr/EHRInterface';
import { Patient, Practitioner } from '../models/EHRModels';
import * as jwt from '../utils/jwt';
import * as userModel from '../models/userModel';
import bcrypt from 'bcrypt';


// Login API for username/email & password
export const login = (req: any, res: any) => {
  const { username, password } = req.body;
  
  const user = userModel.findUserByUsernameOrEmail(username);
  // Check if user exists and password matches
  // Use bcrypt to compare the password with the stored hash
  if (!user ||  !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Only include safe payload in token and return it
  const token = jwt.generateToken({ userId: String(user.id) });
  return res.json({ token });
};

// Ehr SSO login callback. We do the following once the callback is triggered after user authorizes the application: 
// 1. Call the SMART Config endpoint to get the authorization and token endpoints (optional)
// 2. After the user authorizes (in frontend), they will be redirected back to the redirect_uri (the callback endpoint) and there we will exchange the authorization code for an access token by calling the token endpoint
// 3. the token endpoint returns access token, refresh token , and the id_token that contains user information
// 4. we decode the JWT id_token to get the practitioner information and create a user by calling the FHIR API endpoint in fhirUser member

export const callback = (ehr: EHRInterface) =>
  async (req: any, res: any) => {

//async (req: any, res: any, ehr: FHIRInterface) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  // Exchange the authorization code for an access token
  try {
    let token_endpoint, redirect_uri, client_id;
    if (process.env.EHR_TYPE === 'HEALTHIT') {
      token_endpoint = process.env.HEALTHIT_FHIR_TOKEN_ENDPOINT;
      redirect_uri = process.env.HEALTHIT_REDIRECT_URI;
      client_id = process.env.HEALTHIT_CLIENT_ID;
    } else if (process.env.EHR_TYPE === 'CERNER') {
      token_endpoint = process.env.CERNER_FHIR_TOKEN_ENDPOINT;
      redirect_uri = process.env.CERNER_REDIRECT_URI;
      client_id = process.env.CERNER_CLIENT_ID;
    }else {
      return res.status(400).json({ message: 'Invalid EHR type' });
    }

    const response = await fetch(`${token_endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: redirect_uri || '',
        client_id: client_id || '',
      }),
    });

    if (!response.ok) {
      console.error('Failed to exchange authorization code:', response.statusText);
      throw new Error('Failed to exchange authorization code for access token');
    }

    const data = await response.json();
    console.log('Token exchange response:', data);
    const ehr_access_token = data.access_token;
    const ehr_refresh_token = data.refresh_token;
    const ehr_id_token = data.id_token;
    // Decode the JWT id_token to get practitioner id
    //const user_info = jwt.verifyToken(id_token);
    const user_payload = jwt.decode(ehr_id_token, { complete: false });
    console.log('Decoded user payload:', user_payload);
    // get user profile from decode user payload json (fhirUser) 
    // Type guard to safely access fhirUser
    let user_profile: string;

    if (user_payload && typeof user_payload === 'object' && 'fhirUser' in user_payload) {
      user_profile = user_payload.fhirUser;
      console.log('Practitioner profile id from id_token:', user_profile);
    } else {
      throw new Error('Invalid token: fhirUser not found');
    }
  

    // set the ehr access token and get practitioner by id
    ehr.set_tokens(ehr_access_token, ehr_refresh_token);
    const practitioner_data: Practitioner = await ehr.get_practitioner_by_id(user_profile);

    // get test patient data 
    const patient_data: Patient = await ehr.get_patient_by_id(process.env.HEALTHIT_TEST_PATIENT_ID || '');

    // get test patient conditions
    const patient_conditions = await ehr.get_patient_conditions_by_id(process.env.HEALTHIT_TEST_PATIENT_ID || '');
    console.log('Patient conditions:', patient_conditions);

    // get patient allergies
    const patient_allergies = await ehr.get_patient_allergies_by_id(process.env.HEALTHIT_TEST_PATIENT_ID || '');
    console.log('Patient allergies:', patient_allergies);

    console.log('Patient data:', patient_data);
    console.log('Practitioner data:', practitioner_data);
    console.log('EHR token is:', ehr_access_token);
    console.log('EHR refresh token is:', ehr_refresh_token);

    // Generate a JWT token for your application (velodoc)
    //const token = jwt.generateToken({ userId: user ? user.id : null });

    res.cookie('ehr_access_token', ehr_access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('ehr_refresh_token', ehr_refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('velodoc_user', JSON.stringify(practitioner_data), {
      httpOnly: true, 
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('velodoc_session_patient', JSON.stringify(patient_data), {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('velodoc_patient_conditions', JSON.stringify(patient_conditions), {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 60 * 60 * 1000,
    });

    // 5. Redirect to frontend (e.g., dashboard landing page)
    res.redirect(`${process.env.FRONTEND_BASE_URL}/sso-loading`);

    //return res.json({access_token, refresh_token, user: user_payload });
  } catch (error) {
    console.error('Error during callback:', error);
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return res.status(500).json({ message: errorMessage });
  }
};

// Get current user profile and token (for SSO ehr)
export const auth_me = async (req: any, res: any) => {

  console.log('Cookies in auth me received: ', req.cookies);
  const user = req.cookies.velodoc_user;
  const ehr_access_token = req.cookies.ehr_access_token;
  const ehr_refresh_token = req.cookies.ehr_refresh_token;
  const session_patient = req.cookies.velodoc_session_patient;
  const patient_conditions = req.cookies.velodoc_patient_conditions;

  if (!user || !ehr_access_token || !ehr_refresh_token || !session_patient || !patient_conditions) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    ehr_access_token,
    ehr_refresh_token,
    velodoc_user: JSON.parse(user),
    velodoc_session_patient: JSON.parse(session_patient),
    velodoc_patient_conditions: JSON.parse(patient_conditions),
  });
};

// Get user profile API
export const get_profile = (req: any, res: any) => {
  const user_id = req.user.userId;
  const user = userModel.findUserById(user_id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Don't return hash of the password
  const { password, ...safe_user } = user;
  return res.json({ user: safe_user }); 
};

