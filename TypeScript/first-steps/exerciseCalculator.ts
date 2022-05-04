interface ExerciseInfo {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ratingInfo {
  rating: number;
  ratingDescription: string;
}

const ratingFromRatio = (ratio: number): ratingInfo => {
  if (ratio < 0.5) {
    return {
      rating: 1,
      ratingDescription: 'you could try lowering your target',
    };
  }
  if (ratio < 1) {
    return {
      rating: 2,
      ratingDescription: 'not too bad but could be better',
    };
  }
  return {
    rating: 3,
    ratingDescription: 'congratulations you met your target',
  };
};

const calculateExercises = (
  target: number,
  hoursPerDay: Array<number>
): ExerciseInfo => {
  const periodLength = hoursPerDay.length;
  const trainingDays = hoursPerDay.filter(x => x > 0).length;
  const average = hoursPerDay.reduce((a, b) => a + b, 0) / periodLength;
  const success = average > target;
  const { rating, ratingDescription } = ratingFromRatio(average / target);

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

export default calculateExercises;
