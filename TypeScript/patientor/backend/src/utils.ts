import { PatientWithoutId, Gender } from './types';
import { Entry } from './types';

// Helper function for exhaustive type checking
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const checkKeyValueTypes = (obj: any, map: any) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  Object.entries(map).every(([key, type]) => typeof obj[key] === type);

const isString = (input: unknown): input is string => {
  return typeof input === 'string' || input instanceof String;
};

const parseString = (string: unknown, fieldName: string): string => {
  if (!string || !isString(string)) {
    throw new Error(`Incorrect or missing ${fieldName}: ${string}`);
  }

  return string;
};

const isDate = (input: string): boolean => {
  return Boolean(Date.parse(input));
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date of birth: ' + date);
  }
  return date;
};

const isGender = (input: unknown): input is Gender => {
  return Object.values(Gender).includes(input as Gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

export const isEntry = (input: unknown): input is Entry => {
  const entry = input as Entry;
  const defaultMap = {
    description: 'string',
    date: 'string',
    specialist: 'string',
  };

  if (!checkKeyValueTypes(entry, defaultMap)) {
    return false;
  }

  switch (entry.type) {
    case 'Hospital':
      return checkKeyValueTypes(entry.discharge, {
        date: 'string',
        criteria: 'string',
      });
    case 'OccupationalHealthcare':
      return checkKeyValueTypes(entry, {
        employerName: 'string',
      });
    case 'HealthCheck':
      return checkKeyValueTypes(entry, {
        healthCheckRating: 'number',
      });
    default:
      return assertNever(entry);
  }
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!entries) {
    throw new Error('Entries must be defined');
  }

  if (!Array.isArray(entries)) {
    throw new Error('Entries must be an array');
  }

  if (!entries.every(entry => isEntry(entry))) {
    throw new Error('Entries array must consist of valid entries');
  }

  return entries as Entry[];
};

type Fields = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
  entries: unknown;
};

export const toNewPatient = ({
  name,
  dateOfBirth,
  ssn,
  gender,
  occupation,
  entries,
}: Fields): PatientWithoutId => {
  const newPatient: PatientWithoutId = {
    name: parseString(name, 'name'),
    dateOfBirth: parseDateOfBirth(dateOfBirth),
    ssn: parseString(ssn, 'ssn'),
    gender: parseGender(gender),
    occupation: parseString(occupation, 'occupation'),
    entries: parseEntries(entries),
  };

  return newPatient;
};
