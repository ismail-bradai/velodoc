import express from 'express';
import { login, callback, auth_me, get_profile } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { HEALTHITehr } from '../integrations/ehr/HEALTHITehr';
import { on } from 'events';
import {create_ehr_instance} from '../integrations/ehr/ehr_wrapper';

const router = express.Router();



// Public Routes - login API
router.post('/login', login);        // login API for username/email & password
router.get('/callback', (req: any, res) => {
    const ehr  = create_ehr_instance({
  ehr_access_token: '',
  ehr_refresh_token: '',
  on_token_update: (access_token: string, refresh_token: string) => {
     // This is the on_token_update callback
      req.session.ehr_tokens = {
        ehr_access_token: access_token,
        ehr_refresh_token: refresh_token,
      };
      console.log('EHR tokens updated in session:', req.session.ehr_tokens);
  }
});

callback(ehr)(req, res); // Pass the ehr instance to the callback
});  // callback for EHR login
router.get('/auth/me', auth_me); // Get current user profile (for SSO ehr)

// Protected Routes
// get user profile API
router.get('/profile', authenticate, get_profile);


export default router;
