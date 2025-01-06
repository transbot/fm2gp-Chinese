interface Step {
  powerOfTwo: number;
  value: number;
  isSelected: boolean;
}

export function calculateEgyptianMultiplication(multiplicand: number, multiplier: number): {
  steps: Step[];
  result: number;
} {
  const n1 = Math.abs(Math.floor(multiplicand));
  const n2 = Math.abs(Math.floor(multiplier));
  
  const steps: Step[] = [];
  let power = 1;
  let value = n2;

  while (power <= n1) {
    steps.push({
      powerOfTwo: power,
      value,
      isSelected: (n1 & power) !== 0
    });
    power *= 2;
    value *= 2;
  }

  const result = steps
    .filter(step => step.isSelected)
    .reduce((sum, step) => sum + step.value, 0);

  return {
    steps,
    result: multiplicand < 0 !== multiplier < 0 ? -result : result
  };
}