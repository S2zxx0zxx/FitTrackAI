// Nutritionix API configuration
const API_ID = 'YOUR_API_ID';  // Note: Replace with actual API credentials
const API_KEY = 'YOUR_API_KEY';

export const fetchNutritionData = async (query, weight) => {
  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': API_ID,
        'x-app-key': API_KEY,
      },
      body: JSON.stringify({
        query: `${weight}g ${query}`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }

    const data = await response.json();
    
    if (!data.foods || data.foods.length === 0) {
      throw new Error('No nutrition data found');
    }

    const food = data.foods[0];
    
    return {
      calories: parseFloat(food.nf_calories.toFixed(1)),
      protein: parseFloat(food.nf_protein.toFixed(1)),
      carbs: parseFloat(food.nf_total_carbohydrate.toFixed(1)),
      fat: parseFloat(food.nf_total_fat.toFixed(1)),
      servingWeight: food.serving_weight_grams,
      name: food.food_name,
    };
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};

export const convertWeight = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  
  // Convert to grams first
  let grams;
  switch (fromUnit.toLowerCase()) {
    case 'kg':
      grams = value * 1000;
      break;
    case 'g':
      grams = value;
      break;
    default:
      throw new Error('Unsupported unit');
  }
  
  // Convert from grams to target unit
  switch (toUnit.toLowerCase()) {
    case 'kg':
      return grams / 1000;
    case 'g':
      return grams;
    default:
      throw new Error('Unsupported unit');
  }
};

export const parseWeightInput = (input) => {
  const match = input.toString().match(/^([\d.]+)\s*(g|kg|grams|kilograms)?$/i);
  
  if (!match) {
    throw new Error('Invalid weight format');
  }
  
  const value = parseFloat(match[1]);
  let unit = match[2]?.toLowerCase() || 'g';
  
  // Normalize unit names
  unit = unit.replace('grams', 'g').replace('kilograms', 'kg');
  
  if (isNaN(value) || value < 0) {
    throw new Error('Invalid weight value');
  }
  
  return {
    value,
    unit: unit || 'g'
  };
};