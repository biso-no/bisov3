import { createWorker } from 'tesseract.js';
import { clientFunctions } from '../appwrite-client';

interface ExtractedData {
  date: string | null;
  amount: number | null;
  description: string | null;
}

// Process text with ChatGPT
async function processChatGPT(text: string): Promise<ExtractedData> {
  try {
    const response = await clientFunctions.createExecution(
      'process_receipts',
      text,
      false,
    );

    if (!response.$id) {
      throw new Error('Failed to process with ChatGPT');
    }

    const result = await response.responseBody;
    const resultToJson = JSON.parse(result);
    
    if (resultToJson.error) {
      throw new Error(resultToJson.error);
    }

    return {
      date: resultToJson.date,
      amount: resultToJson.amount,
      description: resultToJson.description
    };
  } catch (error) {
    console.error('ChatGPT processing failed:', error);
    return {
      date: null,
      amount: null,
      description: null
    };
  }
}

// Extract text from images using Tesseract (client-side)
async function extractImageText(file: File): Promise<string> {
  const worker = await createWorker('eng+nor');
  
  try {
    const { data: { text } } = await worker.recognize(file);
    return text.trim();
  } finally {
    await worker.terminate();
  }
}

// Process PDF on server-side
async function processPDFServer(file: File): Promise<ExtractedData> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const fileContent = await file.arrayBuffer();
    console.log("File Content: ", fileContent);
    const response = await clientFunctions.createExecution(
      'process_receipts',
      JSON.stringify({ file: JSON.stringify(fileContent) }),
      false
    );

    if (!response.$id) {
      throw new Error('Failed to process PDF');
    }

    const result = await response.responseBody;
    const resultToJson = JSON.parse(result);
    
    if (resultToJson.error) {
      throw new Error(resultToJson.error);
    }

    return {
      date: resultToJson.date,
      amount: resultToJson.amount,
      description: resultToJson.description
    };
  } catch (error) {
    console.error('PDF processing failed:', error);
    return {
      date: null,
      amount: null,
      description: null
    };
  }
}

// Main document processing function
export async function processDocument(file: File): Promise<ExtractedData> {
  try {
    // Handle PDFs server-side, images client-side
    if (file.type === 'application/pdf') {
      return await processPDFServer(file);
    } else if (file.type.startsWith('image/')) {
      const extractedText = await extractImageText(file);
      return await processChatGPT(extractedText);
    } else {
      throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Document processing failed:', error);
    return {
      date: null,
      amount: null,
      description: null
    };
  }
} 