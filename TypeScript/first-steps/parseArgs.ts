const parseArgs = (
  args: Array<string>,
  min = 0,
  max = Infinity
): Array<number> => {
  args.splice(0, 2);

  if (args.length < min) throw new Error('Not enough arguments');
  if (args.length > max) throw new Error('Too many arguments');

  const nums = args.map(arg => Number(arg));

  const allNums = nums.every(num => !isNaN(num));
  if (!allNums) {
    throw new Error('Provided values were not numbers!');
  }

  return nums;
};

export default parseArgs;
