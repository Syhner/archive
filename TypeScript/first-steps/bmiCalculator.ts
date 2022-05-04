const calculateBmi = (heightInCm: number, weightInKg: number): string => {
  const heightInMeters = heightInCm / 100;
  const bmi = weightInKg / (heightInMeters * heightInMeters);

  const categories = [
    { category: 'Underweight (severe thinness)', threshold: 16 },
    { category: 'Underweight (moderate thinness)', threshold: 17 },
    { category: 'Underweight (mild thinness) ', threshold: 18.5 },
    { category: 'Normal (healthy weight)', threshold: 25 },
    { category: 'Overweight (pre-obese) ', threshold: 30 },
    { category: 'Obese (class I)', threshold: 35 },
    { category: 'Obese (class II)', threshold: 40 },
    { category: 'Obese (class III)', threshold: Infinity },
  ];

  for (const { category, threshold } of categories) {
    if (bmi < threshold) {
      return category;
    }
  }

  throw new Error('Something went wrong');
};

export default calculateBmi;
