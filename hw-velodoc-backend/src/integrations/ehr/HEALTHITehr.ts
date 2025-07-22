import { TokenUpdateCallback, EHRInterface } from './EHRInterface';
import { Patient, Practitioner, Encounter, Allergy, Condition } from '../../models/EHRModels';
import { start } from 'repl';

export class HEALTHITehr extends EHRInterface {

  constructor(base_url: string, 
        token_auth_url: string,
        access_token: string,
        refresh_token: string,
        client_id: string,
        on_token_update?: TokenUpdateCallback
        ) {
        super(base_url,
            token_auth_url,
            access_token,
            refresh_token,
            client_id,
            on_token_update
        );
    }

  async get_practitioner_by_id(practitioner_id: string): Promise<Practitioner> {
    // check if "Practtioner" in practitioner_id
    //if (!practitioner_id.startsWith('Practitioner/')) {
    //    practitioner_id = `Practitioner/${practitioner_id}`;
    //}

    console.log('Fetching practitioner by ID:', practitioner_id);

    const data = await this.get(practitioner_id);
    console.log('Fetched practitioner data:', data);

    // get the name from data (name prefix + given + family)
    const fullname = data.name?.[0]?.prefix?.join(' ') + ' ' + data.name?.[0]?.given?.join(' ') + ' ' + data.name?.[0]?.family || '';
    // Map to model
    const practitioner: Practitioner = {
      id: data.id,
      name: fullname,
      gender: data.gender || '',
      email: data.telecom?.find((t: any) => t.system === 'email')?.value || '',
      phone: data.telecom?.find((t: any) => t.system === 'phone')?.value || '',
      specialty: data.specialty?.[0]?.text || '',
      role: data.qualification?.[0]?.code?.text || '',
      identifier: data.identifier?.find((i: any) => i.system === 'http://hl7.org/fhir/sid/us-npi')?.value || '',
      active: data.active || false,
    };
    console.log('Fetched practitioner:', practitioner);
    return practitioner
  }

  async get_all_patients(): Promise<Patient[]> {
    const bundle = await this.get('/Patient');
    return bundle.entry?.map((entry: any) => {
      const p = entry.resource;
      return {
        id: p.id,
        name: p.name?.[0]?.text || '',
        address: p.address?.[0]?.text,
        email: p.telecom?.find((t: any) => t.system === 'email')?.value,
        birthDate: p.birthDate,
        gender: p.gender,
        identifier: p.identifier?.[0]?.value,
        language: p.communication?.[0]?.language?.text,
      };
    }) || [];
  }

  async get_patient_by_id(id: string): Promise<Patient> {
    const p = await this.get(`Patient/${id}`);

    // get the fullname from data (name prefix + given + family). first thing we need to pick the index where use==official
    const idx = p.name?.findIndex((n: any) => n.use === 'official') || 0;
    const fullname = p.name?.[idx]?.prefix?.join(' ') + ' ' + p.name?.[idx]?.given?.join(' ') + ' ' + p.name?.[idx]?.family || '';
    
    return {
      id: p.id,
      name: fullname,
      address: p.address?.[0]?.text,
      email: p.telecom?.find((t: any) => t.system === 'email')?.value,
      dob: p.birthDate,
      language: p.communication?.[0]?.language?.text,
      gender: p.gender,
      ssn: p.identifier?.find((i: any) =>i.type?.coding?.some((c: any) => c.code === 'SS'))?.value,
      mrn: p.identifier?.find((i: any) =>i.type?.coding?.some((c: any) => c.code === 'MR'))?.value,
      phone: p.telecom?.find((t: any) => t.system === 'phone')?.value,
    };
  }

  async get_practitioner_encounters(): Promise<Encounter[]> {
    const bundle = await this.get('/Encounter');
    return bundle.entry?.map((entry: any) => {
      const e = entry.resource;
      return {
        id: e.id,
        status: e.status,
        type: e.type?.[0]?.text,
        period: e.period,
        subjectId: e.subject?.reference,
      };
    }) || [];
  }

  async get_encounter_by_id(id: string): Promise<Encounter> {
    const e = await this.get(`/Encounter/${id}`);
    return {
      id: e.id,
      status: e.status,
      type: e.type?.[0]?.text,
      start: e.period?.start,
      end: e.period?.end,
      patient_id: e.subject?.reference,
      practitioner_id: e.participant?.[0]?.individual?.reference,
      location: e.location?.[0]?.location?.reference,
      reason: e.reasonCode?.[0]?.text,
    };
  }

  async get_patient_allergies_by_id(patient_id: string): Promise<Allergy[]> {

    const bundle = await this.get(`AllergyIntolerance?patient=${patient_id}`);

    // check if bundle has entry
    if (!bundle.entry || bundle.entry.length === 0) {
      console.log('No allergies found for patient:', patient_id);
      return [];
    }

    const allergies = bundle.entry
    .map((entry: any) => {
      const a = entry.resource;     

      return {
        id: a.id,
        substance: a.code?.text || a.code?.coding?.[0]?.display || "Unknown",
        category: a.category?.[0] || undefined,
        criticality: a.criticality || undefined,
        clinical_status: a.clinicalStatus?.coding?.[0]?.code || undefined,
        verification_status: a.verificationStatus?.coding?.[0]?.code || undefined,
        recorded_date: a.recordedDate.split('T')[0] || undefined,
        start_date: a.onsetDateTime.split('T')[0] || undefined,
        reactions: a.reaction?.flatMap((r: any) =>
          r.manifestation?.map((m: any) => m.coding?.[0]?.display || "Unknown") || []
        ) || [],
      };
    });

    return allergies;
  }

  async get_patient_conditions_by_id(patient_id: string): Promise<Condition[]> {

  const bundle = await this.get(`Condition?patient=${patient_id}`);
  

  // check if bundle has entry
  if (!bundle.entry || bundle.entry.length === 0) {
    console.log('No conditions found for patient:', patient_id);
    return [];
  }

  const conditions = bundle.entry?.map((entry: any) => {
    const c = entry.resource;
    return {
      id: c.id,
      code: c.code?.text || c.code?.coding?.[0]?.display || "Unknown",
      clinical_status: c.clinicalStatus?.coding?.[0]?.code || undefined,
      verification_status: c.verificationStatus?.coding?.[0]?.code || undefined,
      onset_date: c.onsetDateTime ? c.onsetDateTime.split('T')[0] : undefined,
      abatement_date: c.abatementDateTime ? c.abatementDateTime.split('T')[0] : undefined,
      notes: c.note?.map((n: any) => n.text).join(' ') || '',
      patient_id: patient_id,
    };
  }) || [];

  return conditions;
}

}
