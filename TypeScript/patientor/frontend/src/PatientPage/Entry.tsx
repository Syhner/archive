import { Entry as EntryType } from '../types';
import { assertNever } from '../utils';
import HealthRatingBar from '../components/HealthRatingBar';
import { useStateValue } from '../state';

const Entry = ({ entry }: { entry: EntryType }) => {
  const [{ diagnoses }] = useStateValue();

  const style = {
    border: '2px black solid',
    marginBottom: '10px',
    padding: '10px',
  };

  const Common = () => (
    <div style={{ paddingBottom: '10px' }}>
      <div style={{ color: 'red', fontWeight: 'bold' }}>{entry.type}</div>
      <b>
        <div>
          {entry.date}: {entry.description}
        </div>
      </b>
      <i>
        <div>Overseen by {entry.specialist}</div>
      </i>

      {entry.diagnosisCodes &&
        diagnoses &&
        Object.keys(diagnoses).length !== 0 && (
          <ul>
            <u>Diagnoses:</u>
            {entry.diagnosisCodes?.map(code => (
              <li key={code}>{diagnoses[code].name}</li>
            ))}
          </ul>
        )}
    </div>
  );

  switch (entry.type) {
    case 'Hospital':
      return (
        <div style={style}>
          <Common />
          Discharged at {entry.discharge.date}, Reason:{' '}
          {entry.discharge.criteria}
        </div>
      );
    case 'OccupationalHealthcare':
      return (
        <div style={style}>
          <Common />
          <div>Employed by {entry.employerName}</div>
          {entry.sickLeave && (
            <div>
              Entitled sick leave: {entry.sickLeave?.startDate} to{' '}
              {entry.sickLeave?.endDate}
            </div>
          )}
        </div>
      );
    case 'HealthCheck':
      return (
        <div style={style}>
          <Common />
          <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
        </div>
      );
    default:
      return assertNever(entry);
  }
};

export default Entry;
