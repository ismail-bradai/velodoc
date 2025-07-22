// ehr wrapper to return the right EHR instance based on the environment
import { HEALTHITehr } from './HEALTHITehr';
import { EHRInterface } from './EHRInterface';

export const create_ehr_instance = ( config: any): EHRInterface => {
  const type = process.env.EHR_TYPE || '';
  switch (type) {
    case 'HEALTHIT':
      return new HEALTHITehr(process.env.HEALTHIT_FHIR_BASE_URL || '',
        process.env.HEALTHIT_FHIR_TOKEN_ENDPOINT || '',
        config.ehr_access_token || '',
        config.ehr_refresh_token || '',
        process.env.HEALTHIT_CLIENT_ID || '',
        config.on_token_update);
    case 'CERNER':
    return new HEALTHITehr(process.env.CERNER_FHIR_BASE_URL || '',
        process.env.CERNER_FHIR_TOKEN_ENDPOINT || '',
        config.ehr_access_token || '',
        config.ehr_refresh_token || '',
        process.env.CERNER_CLIENT_ID || '',
        config.on_token_update);
    default:
      throw new Error(`Unknown EHR type: ${type}`);
  }
};
