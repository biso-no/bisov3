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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { processDocument } from "../../../actions"
import { useToast } from "@/components/ui/use-toast"

interface DocumentData {
  date: string;
  amount: number;
  description: string;
  fileId: string;
  fileName: string;
}

interface DocumentUploadProps {
  onNext: () => void
  onUpdate: (data: any) => void
  data?: {
    documents?: DocumentData[];
  }
}

const documentSchema = z.object({
  date: z.string(),
  amount: z.number().min(0),
  description: z.string().min(1),
})

export function DocumentUpload({ onNext, onUpdate, data }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<DocumentData[]>(data?.documents || [])
  const [isUploading, setIsUploading] = useState(false)
  const [editingDoc, setEditingDoc] = useState<DocumentData | null>(null)
  const { toast } = useToast()

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      setIsUploading(true)
      try {
        const fileId = Math.random().toString(36).substring(7)
        const docData = await processDocument(fileId, file.name)
        
        setDocuments(prev => [...prev, docData])
        onUpdate({ documents: [...documents, docData] })
        toast({
          title: "Document Processed",
          description: "We've automatically extracted the information from your document.",
        })
      } catch (error) {
        toast({
          title: "Processing Failed",
          description: "Failed to process the document. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    }
  }, [documents, onUpdate, toast])

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
    const updatedDoc = { ...doc, ...values }
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

  const onSubmit = () => {
    onUpdate({ documents })
    onNext()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload your receipts and supporting documents. We&apos;ll automatically extract the information.
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
            <Card className="relative group">
              <CardContent className="pt-6">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingDoc(doc)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(doc.fileId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <File className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">Document</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm">{doc.date}</p>
                      <p className="text-xs text-gray-500">Date</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm">${doc.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Amount</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm">{doc.description}</p>
                      <p className="text-xs text-gray-500">Description</p>
                    </div>
                  </div>
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

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8"
          disabled={documents.length === 0}
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 