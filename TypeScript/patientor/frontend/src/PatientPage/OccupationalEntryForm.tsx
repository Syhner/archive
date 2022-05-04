import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Field, Formik, Form } from 'formik';
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { OccupationalHealthcareEntry } from '../types';
import { useStateValue } from '../state';
import { apiBaseUrl } from '../constants';
import { TextField } from '../components/FormField';
import { DiagnosisSelection } from '../AddPatientModal/FormField';

type EntryFormValues = Omit<OccupationalHealthcareEntry, 'id'>;

interface AddEntryFormProps {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const AddEntryForm = ({ onSubmit, onCancel }: AddEntryFormProps) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={{
        type: 'OccupationalHealthcare',
        description: '',
        date: '',
        specialist: '',
        employerName: '',
        sickLeave: {
          startDate: '',
          endDate: '',
        },
      }}
      onSubmit={onSubmit}
      validate={values => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.employerName) {
          errors.employerName = requiredError;
        }
        if (values.sickLeave) {
          if (
            (!values.sickLeave.startDate && values.sickLeave.endDate) ||
            (values.sickLeave.startDate && !values.sickLeave.endDate)
          ) {
            errors.sickLeave =
              'Start and end date must either be both defined, or both undefined';
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched }) => {
        return (
          <Form className='form ui'>
            <Field
              label='Description'
              placeholder='Description'
              name='description'
              component={TextField}
            />
            <Field
              label='Date'
              placeholder='Date'
              name='date'
              component={TextField}
            />
            <Field
              label='Specialist'
              placeholder='Specialist'
              name='specialist'
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label='Employer name'
              placeholder='Employer name'
              name='employerName'
              component={TextField}
            />
            <Field
              label='Sick leave start date'
              placeholder='Sick leave start date'
              name='sickLeave.startDate'
              component={TextField}
            />
            <Field
              label='Sick leave end date'
              placeholder='Sick leave end date'
              name='sickLeave.endDate'
              component={TextField}
            />
            <Grid>
              <Grid item>
                <Button
                  color='secondary'
                  variant='contained'
                  style={{ float: 'left' }}
                  type='button'
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  style={{
                    float: 'right',
                  }}
                  type='submit'
                  variant='contained'
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

interface AddEntryModalProps {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

const AddEntryModal = ({
  modalOpen,
  onClose,
  onSubmit,
  error,
}: AddEntryModalProps) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add an occupational healthcare entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity='error'>{`Error: ${error}`}</Alert>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} />
    </DialogContent>
  </Dialog>
);

const HealcheckEntry = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return null;
  }

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const openModal = (): void => setModalOpen(true);
  const [, dispatch] = useStateValue();

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };
  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<OccupationalHealthcareEntry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch({ type: 'ADD_ENTRY', payload: newEntry, patientId: id });

      closeModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        console.error(e?.response?.data || 'Unrecognized axios error');
        setError(
          String(e?.response?.data?.error) || 'Unrecognized axios error'
        );
      } else {
        console.error('Unknown error', e);
        setError('Unknown error');
      }
    }
  };
  return (
    <div>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button variant='contained' onClick={() => openModal()}>
        New Occupational Healthcare Entry
      </Button>
    </div>
  );
};

export default HealcheckEntry;
