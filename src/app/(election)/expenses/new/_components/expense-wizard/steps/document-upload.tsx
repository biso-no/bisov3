"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Upload,
  File,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  Edit2,
  Save,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DocumentData as ActionDocumentData } from '../../../actions'
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { processDocument } from '@/lib/utils/document-processing'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { generateExpenseDescription } from '../../../actions'
import { FilePreview } from "../../file-preview"

interface DocumentData {
  date: string;
  amount: number;  // This will always be the NOK amount
  description: string;
  fileId: string;
  fileName: string;
  file: File;
  processedByAI: boolean;
  originalAmount?: number;  // The amount in foreign currency (if any)
  originalCurrency?: string;  // The currency code (if not NOK)
  exchangeRate?: number;  // For display purposes only
}

interface DocumentUploadProps {
  onNext: () => void
  onPrevious: () => void
  onUpdate: (data: any) => void
  data?: {
    documents?: ActionDocumentData[];
  }
}

const formatAmount = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return "0.00";
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const documentSchema = z.object({
  date: z.string(),
  amount: z.number().min(0),
  description: z.string().min(1),
})

interface AIToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const AIToggle = ({ enabled, onToggle }: AIToggleProps) => (
  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border">
    <Label 
      htmlFor="ai-toggle" 
      className="text-sm font-medium text-gray-600 cursor-pointer"
    >
      AI Assistance
    </Label>
    <Switch
      id="ai-toggle"
      checked={enabled}
      onCheckedChange={onToggle}
      className="data-[state=checked]:bg-gradient-to-r from-blue-500 to-indigo-500"
    />
  </div>
);

// Update the DocumentAlerts component with better vertical alignment
const DocumentAlerts = ({ doc }: { doc: DocumentData }) => {
  const alerts = [];
  
  if (doc.originalCurrency && doc.originalCurrency !== 'NOK') {
    alerts.push(
      <Alert key="foreign" className="p-2 bg-yellow-50 border-yellow-200">
        <div className="flex items-center w-full min-h-[24px]">
          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <AlertDescription className="ml-2 my-0 text-yellow-700">
            Foreign currency detected. Bank statements may be required.
          </AlertDescription>
        </div>
      </Alert>
    );
  }
  
  return alerts.length > 0 ? (
    <div className="space-y-2 mb-4">{alerts}</div>
  ) : null;
};

// First, let's add a new component for better organization
const CurrencyDisplay = ({ doc }: { doc: DocumentData }) => {
  if (!doc.originalCurrency || doc.originalCurrency === 'NOK') {
    return (
      <div>
        <p className="text-sm font-medium">{formatAmount(doc.amount)} NOK</p>
        <p className="text-xs text-gray-500">Amount</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium">{formatAmount(doc.amount)} NOK</p>
      <p className="text-xs text-gray-500 text-right">
        Original: {formatAmount(doc.originalAmount)} {doc.originalCurrency}
        <span className="text-xs text-yellow-600 ml-1">
          @ {doc.exchangeRate?.toFixed(2)}
        </span>
      </p>
      <p className="text-xs text-gray-500">Amount</p>
    </div>
  );
};

export function DocumentUpload({ onNext, onPrevious, onUpdate, data }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentData[]>(data?.documents as DocumentData[] || [])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDoc, setEditingDoc] = useState<DocumentData | null>(null)
  const [aiEnabled, setAiEnabled] = useState(false)
  const { toast } = useToast()
  const [previewFileId, setPreviewFileId] = useState<string | undefined>()

  const form = useForm({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      date: "",
      amount: 0,
      description: "",
    },
  })

  useEffect(() => {
    if (editingDoc) {
      form.reset({
        date: editingDoc.date,
        amount: editingDoc.amount,
        description: editingDoc.description,
      })
    }
  }, [editingDoc, form])

  const processExistingDocuments = useCallback(async () => {
    const updatedDocuments = [...documents];
    setIsUploading(true);

    try {
      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        if (!doc.processedByAI) {
          const result = await processDocument(doc.file);
          
          updatedDocuments[i] = {
            ...doc,
            date: result.date || doc.date,
            amount: result.amount || doc.amount,
            description: result.description || doc.description,
            originalAmount: doc.amount,
            originalCurrency: doc.originalCurrency,
            exchangeRate: result.exchangeRate,
            processedByAI: true
          };
        }
      }

      setDocuments(updatedDocuments);
      onUpdate({ documents: updatedDocuments });
      
      toast({
        title: "Documents Processed",
        description: "All documents have been processed with AI assistance.",
      });
    } catch (error) {
      console.error('Error processing documents:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process some documents with AI.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [documents, onUpdate, toast]);

  useEffect(() => {
    if (aiEnabled && documents.some(doc => !doc.processedByAI)) {
      processExistingDocuments();
    }
  }, [aiEnabled, documents, processExistingDocuments]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const newDocuments = await Promise.all(acceptedFiles.map(async (file) => {
        const fileId = Math.random().toString(36).substring(7);
        
        let docData: DocumentData = {
          date: new Date().toISOString().split('T')[0],
          amount: 0,
          description: `Expense from ${file.name}`,
          fileId,
          fileName: file.name,
          file,
          processedByAI: false,
        };

        if (aiEnabled) {
          const result = await processDocument(file);
          const amount = Number(result.amount || 0);
          const currency = result.currency || 'NOK';
          
          docData = {
            ...docData,
            date: result.date || docData.date,
            description: result.description || docData.description,
            amount: currency === 'NOK' ? amount : (amount * (result.exchangeRate || 1)),
            ...(currency !== 'NOK' && {
              originalAmount: amount,
              originalCurrency: currency,
              exchangeRate: result.exchangeRate
            }),
            processedByAI: true
          };
        }

        return docData;
      }));

      setDocuments(prev => [...prev, ...newDocuments]);
      onUpdate({ documents: [...documents, ...newDocuments] });

      toast({
        title: aiEnabled ? "Documents Processed" : "Documents Uploaded",
        description: aiEnabled 
          ? "We've extracted the information from your documents. Please verify the details."
          : "Documents have been uploaded successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error processing documents:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [documents, onUpdate, toast, aiEnabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10000000, // 10MB
  })

  const handleEditSave = (doc: DocumentData) => {
    const values = form.getValues()
    const updatedDoc = { 
      ...doc, 
      ...values,
    }
    const updatedDocuments = documents.map(d => 
      d.fileId === doc.fileId ? updatedDoc : d
    )
    setDocuments(updatedDocuments)
    onUpdate({ documents: updatedDocuments })
    setEditingDoc(null)
    toast({
      title: "Document Updated",
      description: "The document details have been updated successfully.",
    })
  }

  const handleDelete = (fileId: string) => {
    const updatedDocuments = documents.filter(d => d.fileId !== fileId)
    setDocuments(updatedDocuments)
    onUpdate({ documents: updatedDocuments })
    toast({
      title: "Document Removed",
      description: "The document has been removed from your expense claim.",
    })
  }

  const onSubmit = async () => {
    if (aiEnabled) {
      const descriptions = documents.map(doc => doc.description);
      
      // Update documents and set loading state
      onUpdate({
        documents,
        description: { generatedDescription: null }
      });
      
      try {
        const description = await generateExpenseDescription(descriptions);
        // Update with final data
        onUpdate({
          documents,
          description: { generatedDescription: description }
        });
      } catch (error) {
        console.error('Error generating description:', error);
        toast({
          title: "Description Generation Failed",
          description: "We'll continue without AI-generated description.",
          variant: "destructive",
        });
        onUpdate({ documents });
      }
    } else {
      onUpdate({ documents });
    }
    onNext();
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="relative pb-2">
          <div className="absolute right-6 top-6">
            <AIToggle 
              enabled={aiEnabled}
              onToggle={setAiEnabled}
            />
          </div>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription className="mt-1.5">
            Upload your receipts and supporting documents. 
            {aiEnabled && " We'll automatically extract the information."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 transition-colors",
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center">
              <Upload
                className={cn(
                  "w-12 h-12 mb-4",
                  isDragActive ? "text-blue-500" : "text-gray-400"
                )}
              />
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600">Processing document...</p>
                </div>
              ) : (
                <>
                  <p className="text-lg font-medium mb-2">
                    {isDragActive
                      ? "Drop your documents here"
                      : "Drag & drop your documents here"}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    or click to select files
                  </p>
                  <p className="text-xs text-gray-400">
                    Supports PDF, JPG, PNG up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {documents.map((doc, index) => (
          <motion.div
            key={doc.fileId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Card 
              className={cn(
                "relative group cursor-pointer transition-all",
                previewFileId === doc.fileId && "ring-2 ring-blue-500"
              )}
              onClick={() => setPreviewFileId(doc.fileId)}
            >
              <CardContent>
                <DocumentAlerts doc={doc} />
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[100px] items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {doc.file && (
                        <iframe
                          src={URL.createObjectURL(doc.file)}
                          className="w-full h-full"
                          style={{ pointerEvents: 'none' }}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-2">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">Document</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm">{doc.date}</p>
                      <p className="text-xs text-gray-500">Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <CurrencyDisplay doc={doc} />
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm line-clamp-2">{doc.description}</p>
                      <p className="text-xs text-gray-500">Description</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingDoc(doc)
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2 text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(doc.fileId)
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      <Dialog 
        open={!!editingDoc} 
        onOpenChange={(open) => {
          if (!open) {
            setEditingDoc(null)
            form.reset()
          }
        }}
      >
        {editingDoc && (
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Document Details</DialogTitle>
              <DialogDescription>
                Update the extracted information from your document.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingDoc(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleEditSave(editingDoc)}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        )}
      </Dialog>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
        >
          Previous
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8"
          disabled={documents.length === 0}
        >
          Continue
        </Button>
      </div>

      <AnimatePresence>
        {previewFileId && (
          <FilePreview
            files={documents}
            currentFileId={previewFileId}
            onClose={() => setPreviewFileId(undefined)}
            onFileChange={setPreviewFileId}
          />
        )}
      </AnimatePresence>
    </div>
  )
} 