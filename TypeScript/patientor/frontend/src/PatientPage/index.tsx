import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { useStateValue } from '../state';
import { apiBaseUrl } from '../constants';
import { Patient } from '../types';
import Entry from './Entry';
import HealthcheckEntry from './HealthcheckEntryForm';
import HospitalEntry from './HospitalEntryForm';
import OccupationalEntry from './OccupationalEntryForm';

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }
  const [{ patients }, dispatch] = useStateValue();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patientFromApi } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );

        dispatch({ type: 'SET_PATIENT', payload: patientFromApi });
      } catch (e) {
        console.error(e);
      }
    };

    const patientInState = patients[id];
    // Check if SSN is in state for patient since this
    // is only added from individual patient pages
    if (patientInState && patientInState.ssn) {
      return;
    }

    void fetchPatient();
  }, [dispatch]);

  const patient = patients[id];

  if (!patient) {
    return null;
  }

  return (
    <div>
      <h2>
        {patient.name} ({patient.gender})
      </h2>
      <li>Occupation: {patient.occupation}</li>
      {patient.ssn && <li>SSN: {patient.ssn}</li>}
      {patient.dateOfBirth && <li>DoB: {patient.dateOfBirth}</li>}
      <h3>Entries</h3>
      <div>
        {patient.entries.map(entry => (
          <Entry key={entry.id} entry={entry} />
        ))}
      </div>
      <div>
        <HospitalEntry />
        <OccupationalEntry />
        <HealthcheckEntry />
      </div>
    </div>
  );
};

export default PatientPage;
