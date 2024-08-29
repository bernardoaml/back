import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Buffer } from "buffer";


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
    // Retorne true se existir, ou false se não existir.
    return false;
};

export const getMeasureFromImage = async (imageBase64: string, mimeType: string): Promise<number> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined");
    }  
    const genAI = new GoogleGenerativeAI(apiKey);
    const buffer = Buffer.from(imageBase64, 'base64');
  
    const request = {
      input: [
        {
          data: buffer.toString('base64'),
          mimeType,
        },
        { text: "Extrair valor do medidor de consumo." }
      ],
      model: "gemini-1.5-pro"
    };
  
    const result = await genAI.generateContent(request);
  
    const measure_value = parseInt(result.output.text, 10);
  
    if (isNaN(measure_value)) {
      throw new Error('Falha ao extrair o valor do medidor.');
    }
  
    return measure_value;
  };