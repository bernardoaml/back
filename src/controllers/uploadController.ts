import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateUploadData, checkExistingMeasure, getMeasureFromImage } from '../services/uploadService';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;
    const mimeType = "image/jpeg"; // ou "image/png", dependendo do tipo de imagem

    // Validação dos dados recebidos
    const validationError = validateUploadData(req.body);
    if (validationError) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: validationError,
      });
    }

    // Verificação de leitura existente no mês
    const existingMeasure = await checkExistingMeasure(customer_code, measure_datetime, measure_type);
    if (existingMeasure) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    // Obter a medida da imagem usando a API Gemini
    const measure_value = await getMeasureFromImage(image, mimeType);

    // Gerar um UUID para a leitura
    const measure_uuid = uuidv4();

    // Gerar URL temporária da imagem
    const image_url = `https://your-temp-image-storage/${measure_uuid}`;

    return res.status(200).json({
      image_url,
      measure_value,
      measure_uuid,
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    return res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: errorMessage,
    });
  }
};
