import axios from 'axios';

export const validateUploadData = (data: any): string | null => {
  const { image, customer_code, measure_datetime, measure_type } = data;

  if (!image || typeof image !== 'string') return 'Imagem inválida ou ausente';
  if (!customer_code || typeof customer_code !== 'string') return 'Código do cliente inválido ou ausente';
  if (!measure_datetime || isNaN(Date.parse(measure_datetime))) return 'Data/hora de medição inválida';
  if (!['WATER', 'GAS'].includes(measure_type)) return 'Tipo de medição inválido';

  return null;
};

export const checkExistingMeasure = async (
  customer_code: string,
  measure_datetime: string,
  measure_type: string
): Promise<boolean> => {
  // Local onde eu devo verificar a existencia do check
  // true caso exista , false caso não exista
  return false;
};

export const getMeasureFromImage = async (image: string): Promise<number> => {
  const response = await axios.post('https://api.google.com/gemini', { image });
  return response.data.measure_value;
};
