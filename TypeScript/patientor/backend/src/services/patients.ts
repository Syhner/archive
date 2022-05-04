import { v1 as uuid } from 'uuid';

import patientsData from '../../data/patients';
import {
  Patient,
  NonSensitivePatient,
  PatientWithoutId,
  Entry,
} from '../types';

const getNonSensitivePatients = (): NonSensitivePatient[] =>
  patientsData.map(({ id, name, dateOfBirth, gender, occupation, entries }) => {
    return { id, name, dateOfBirth, gender, occupation, entries };
  });

const addPatient = (patient: PatientWithoutId): Patient => {
  const newPatient = { ...patient, id: uuid() };
  patientsData.push(newPatient);
  return newPatient;
};

const findPatient = (id: string): Patient | null => {
  const foundPatient = patientsData.find(p => p.id === id);
  if (!foundPatient) {
    return null;
  }
  const { name, dateOfBirth, gender, occupation, entries, ssn } = foundPatient;
  return {
    id: foundPatient.id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries,
    ssn,
  };
};

const addEntryToPatient = (patientId: string, newEntry: Entry): Entry => {
  const newEntryWithId = { ...newEntry, id: uuid() };

  patientsData.forEach(patient => {
    if (patient.id === patientId) {
      patient.entries.push(newEntryWithId);
    }
  });

  return newEntryWithId;
};

export default {
  getNonSensitivePatients,
  addPatient,
  findPatient,
  addEntryToPatient,
};
