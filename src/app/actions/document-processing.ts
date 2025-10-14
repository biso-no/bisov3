'use server'

import {
  processDocument as processDocumentLib,
  type ExtractedDocumentData,
} from '@/lib/services/document-processing'

export async function processDocumentAction(
  fileBuffer: ArrayBuffer,
  mimeType: string,
): Promise<ExtractedDocumentData> {
  return processDocumentLib(Buffer.from(fileBuffer), mimeType)
}
