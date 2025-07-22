import { Patient, Practitioner, Encounter, Allergy, Condition } from '../../models/EHRModels';

export type TokenUpdateCallback = (tokens: {
  ehr_access_token: string;
  ehr_refresh_token: string;
  //ehr_id_token: string;
}) => void;

export abstract class EHRInterface {
  protected on_token_update?: TokenUpdateCallback;
  protected access_token: string;
  protected refresh_token: string;
  protected base_url: string;
  protected token_auth_url: string;
  protected client_id: string;

  constructor(
    base_url: string,
    token_auth_url: string,
    access_token: string,
    refresh_token: string,
    client_id: string,
    on_token_update?: TokenUpdateCallback
  ) {
    this.base_url = base_url;
    this.token_auth_url = token_auth_url;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.client_id = client_id;
    this.on_token_update = on_token_update;
  }

  protected async get(url: string): Promise<any> {
    // check if base_url already in url
    let full_url = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      full_url = `${this.base_url}/${url}`;
    }

    const response = await fetch(full_url, {
       method: 'GET',
      headers: {
        Authorization: `Bearer ${this.access_token}`,
        Accept: 'application/fhir+json',
      },
    });
    
    // check if response is 401 and refresh token if needed
    if (response.status === 401 && this.refresh_token) {
      await this.refresh_auth_token();
      return this.get(url); // Retry once with the new token
    }

    // check if response is ok
    if (!response.ok) {
      throw new Error(`FHIR API error: ${response.statusText}`);
    }

    return response.json();
  } 

  private async refresh_auth_token(): Promise<void> {

    const response = await fetch(`${this.token_auth_url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refresh_token,
        client_id: this.client_id,
        //client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) throw new Error("Token refresh failed!");

    const data = await response.json();

    this.access_token = data.access_token;
    this.refresh_token = data.refresh_token;
    //this.id_token = data.id_token;

    if (this.on_token_update) {
      this.on_token_update({
        ehr_access_token: this.access_token,
        ehr_refresh_token: this.refresh_token,
        //ehr_id_token: this.id_token,
      });
    }
  }
  // tokens setter
  public set_tokens(access_token: string, refresh_token: string) {
        console.log('Setting EHR tokens in EHRInterface.');
        this.access_token = access_token;
        this.refresh_token = refresh_token;
  }

  abstract get_practitioner_by_id(practitioner_id: string): Promise<Practitioner>;
  abstract get_all_patients(): Promise<Patient[]>;
  abstract get_patient_by_id(patient_id: string): Promise<Patient>;
  abstract get_patient_conditions_by_id(patient_id: string): Promise<Condition[]>;
  abstract get_patient_allergies_by_id(patient_id: string): Promise<Allergy[]>;
  abstract get_practitioner_encounters(practitioner_id: string): Promise<Encounter[]>;
  abstract get_encounter_by_id(encounter_id: string): Promise<Encounter>;
}
