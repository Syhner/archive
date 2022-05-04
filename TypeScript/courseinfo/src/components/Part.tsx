// Helper function for exhaustive type checking

import { assertNever } from '../utils';
import { CoursePart } from '../types';

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.type) {
    case 'normal': {
      return (
        <p>
          <li>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </li>
          <li>
            <i>{part.description}</i>
          </li>
        </p>
      );
    }
    case 'groupProject': {
      return (
        <p>
          <li>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </li>
          <li>project exercises {part.groupProjectCount}</li>
        </p>
      );
    }
    case 'submission': {
      return (
        <p>
          <li>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </li>
          <li>
            <i>{part.description}</i>
          </li>
          <li>submit to {part.exerciseSubmissionLink}</li>
        </p>
      );
    }
    case 'special': {
      return (
        <p>
          <li>
            <b>
              {part.name} {part.exerciseCount}
            </b>
          </li>
          <li>
            <i>{part.description}</i>
          </li>
          <li>required skills {part.requirements.join(', ')}</li>
        </p>
      );
    }
    default:
      return assertNever(part);
  }
};

export default Part;
