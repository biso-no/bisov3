import { createWorker } from 'tesseract.js';
import { clientFunctions } from '../appwrite-client';
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Initialize PDF.js
if (typeof window !== 'undefined') {
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

interface ExtractedData {
  date: string | null;
  amount: number | null;
  description: string | null;
  currency: string | null;
  exchangeRate: number | null;
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
      description: resultToJson.description,
      currency: resultToJson.currency || 'NOK',
      exchangeRate: resultToJson.exchangeRate || 1
    };
  } catch (error) {
    console.error('ChatGPT processing failed:', error);
    return {
      date: null,
      amount: null,
      description: null,
      currency: null,
      exchangeRate: null
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

// New function to extract text from PDF
async function extractPDFText(file: File): Promise<string> {
  try {
    console.log('Starting PDF text extraction...');
    const arrayBuffer = await file.arrayBuffer();
    console.log('File converted to array buffer');
    
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    console.log(`PDF loaded, number of pages: ${pdf.numPages}`);
    
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i}...`);
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + ' ';
      console.log(`Page ${i} processed`);
    }

    console.log('PDF text extraction complete');
    return fullText.trim();
  } catch (error) {
    console.error('Error in PDF text extraction:', error);
    throw error;
  }
}

// New function to check if PDF contains text or is image-based
async function isPDFScanned(file: File): Promise<boolean> {
  const text = await extractPDFText(file);
  // If extracted text is very short, likely a scanned/image PDF
  return text.length < 50;
}

// Main document processing function
export async function processDocument(file: File): Promise<ExtractedData> {
  try {
    console.log('Starting document processing...', file.type);
    
    if (file.type === 'application/pdf') {
      console.log('Processing PDF file...');
      try {
        const isScanned = await isPDFScanned(file);
        console.log('PDF scan check complete. Is scanned:', isScanned);

        if (isScanned) {
          console.log('Processing scanned PDF...');
          const pdf = await getDocument(await file.arrayBuffer()).promise;
          let fullText = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            console.log(`Processing scanned page ${i}...`);
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
              throw new Error('Failed to get canvas context');
            }
            
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;

            const blob = await new Promise<Blob>((resolve) => 
              canvas.toBlob((blob) => resolve(blob!), 'image/png')
            );
            const imageFile = new File([blob], 'page.png', { type: 'image/png' });
            
            const pageText = await extractImageText(imageFile);
            fullText += pageText + ' ';
            console.log(`Scanned page ${i} processed`);
          }

          console.log('Processing extracted text with ChatGPT...');
          return await processChatGPT(fullText);
        } else {
          console.log('Processing text-based PDF...');
          const text = await extractPDFText(file);
          console.log('Extracted text:', text.substring(0, 100) + '...');
          return await processChatGPT(text);
        }
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        throw pdfError;
      }
    } else if (file.type.startsWith('image/')) {
      console.log('Processing image file...');
      const extractedText = await extractImageText(file);
      return await processChatGPT(extractedText);
    } else {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error) {
    console.error('Document processing failed:', error);
    return {
      date: null,
      amount: null,
      description: null,
      currency: null,
      exchangeRate: null
    };
  }
} 