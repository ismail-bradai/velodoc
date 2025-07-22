
// ======================
// 🧬 Patient data model
// ======================
export interface Patient {
  id: string;
  name: string;
  gender?: string;
  dob?: string;
  address?: string;
  email?: string;
  phone?: string;
  ssn?: string;   // Social Security Number
  mrn?: string;   // Medical Record Number
  language?: string;
  active?: boolean;
}

// ==========================
// 👨‍⚕️ Practitioner data model
// ==========================
export interface Practitioner {
  id: string;
  name: string;   // full name: <designation firstname lastname>
  gender: string;
  email?: string;
  phone?: string;
  identifier?: string;  // e.g., NPI number
  role?: string;    // e.g., Physician, Nurse
  specialty?: string;
  active?: boolean; // whether the practitioner is currently active
}

// ======================
// 🏥 Encounter data model
// ======================
export interface Encounter {
  id: string;
  status: string;
  type?: string;
  class?: string;
  patient_id: string;
  practitioner_id?: string;
  start?: string;
  end?: string;
  location?: string;
  reason?: string;
}

// ======================
// 🔬 Observation data model
// ======================
export interface Observation {
  id: string;
  code: string;
  value?: string;
  unit?: string;
  effectiveDateTime?: string;
  status?: string;
  interpretation?: string;
  patientId: string;
  encounterId?: string;
}

// ======================
// ⚠️ Allergy data model
// ======================
export interface Allergy {
  id: string;
  patient_id: string;
  substance: string;
  clinical_status?: string; // e.g., "active", "resolved"
  verification_status?: string; // e.g., "confirmed", "unconfirmed"
  criticality?: string;
  reaction?: string;
  start_date?: string;     // date when the allergy was first noted
  recorded_date?: string;      // date when the allergy was recorded
  category?: string;          // e.g., "food", "medication"
  reactions?: string[];      // list of reactions
}

// ========================
// 🩺 Condition data model
// ========================
export interface Condition {
  id: string;
  patient_id: string;
  code: string;
  clinical_status?: string;
  verification_status?: string;
  onset_date?: string;
  abatement_date?: string;
  notes?: string;
}

// ========================
// 💊 Medication data model
// ========================
export interface Medication {
  id: string;
  patientId: string;
  name: string;
  status?: string;
  dosage?: string;
  route?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
  prescriberId?: string;
}
