import express from 'express';

import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  const heightAsNum = Number(height);
  const weightAsNum = Number(weight);

  if (isNaN(heightAsNum) || isNaN(weightAsNum)) {
    return res.json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(heightAsNum, weightAsNum);
  return res.json({ height, weight, bmi });
});

app.post('/exercises', (req, res) => {
  if (!req.body) {
    return res.json({ error: 'malformatted parameters' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  // Ensure daily exercises is an array
  if (!Array.isArray(daily_exercises)) {
    return res.json({ error: 'malformatted parameters' });
  }

  // Ensure all parameters are of the right form
  const allNums = daily_exercises.every(num => !isNaN(Number(num)));
  if (!allNums || isNaN(Number(target))) {
    return res.json({ error: 'malformmatted parameters' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(target, daily_exercises);
  return res.json(result);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
