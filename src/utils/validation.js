import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
};

export const validateMealInput = (meal) => {
  if (!meal.name?.trim()) {
    throw new Error('Meal name is required');
  }

  const numericFields = ['calories', 'protein', 'carbs', 'fat'];
  for (const field of numericFields) {
    const value = Number(meal[field]);
    if (isNaN(value) || value < 0) {
      throw new Error(`Invalid ${field} value`);
    }
  }

  return true;
};

export const validateWeight = (weight) => {
  const match = weight.match(/^(\d+\.?\d*)(kg|g)$/i);
  if (!match) {
    throw new Error('Invalid weight format. Use format: 70kg or 70000g');
  }

  const [, value, unit] = match;
  const weightInKg = unit.toLowerCase() === 'kg' 
    ? Number(value) 
    : Number(value) / 1000;

  if (weightInKg < 20 || weightInKg > 300) {
    throw new Error('Weight must be between 20kg and 300kg');
  }

  return { value: Number(value), unit: unit.toLowerCase() };
};