/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';

import patientsService from '../services/patients';
import { toNewPatient } from '../utils';
import { isEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(patientsService.getNonSensitivePatients());
});

router.post('/', (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation, entries } = req.body;

  try {
    const newPatient = toNewPatient({
      name,
      dateOfBirth,
      ssn,
      gender,
      occupation,
      entries,
    });

    const addedPatient = patientsService.addPatient(newPatient);
    return res.json(addedPatient);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
    return res.status(400);
  }
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const foundPatient = patientsService.findPatient(id);
  if (!foundPatient) {
    return res.status(404);
  }
  return res.json(foundPatient);
});

router.post('/:id/entries', (req, res) => {
  const { id } = req.params;

  if (!isEntry(req.body)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  try {
    const entries = patientsService.addEntryToPatient(id, req.body);
    return res.json(entries);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).send(error.message);
    }
    return res.status(404);
  }
});

export default router;
