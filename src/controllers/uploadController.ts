import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateUploadData, checkExistingMeasure, getMeasureFromImage } from '../services/uploadService';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;
    const validationError = validateUploadData(req.body);
    if (validationError) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: validationError,
      });
    }
    const existingMeasure = await checkExistingMeasure(customer_code, measure_datetime, measure_type);
    if (existingMeasure) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    const measure_value = await getMeasureFromImage(image);
    const measure_uuid = uuidv4();
    const image_url = `https://your-temp-image-storage/${measure_uuid}`;

    return res.status(200).json({
      image_url,
      measure_value,
      measure_uuid,
    });
  } catch (error) {
    return res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Ocorreu um erro ao processar sua requisição',
    });
  }
};
