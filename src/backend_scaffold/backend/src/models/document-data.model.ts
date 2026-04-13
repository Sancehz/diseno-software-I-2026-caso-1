/**
 * Document Data Models
 * 
 * Core data structures for document processing and DUA generation
 */

/**
 * Single field extracted from a document
 */
export interface DocumentField {
  key: string;
  value: any;
  confidence: number;
  source: 'text' | 'heading' | 'table' | 'cell' | 'namedRange' | 'ocr' | 'image';
  location?: {
    page?: number;
    sheet?: number;
    sheetName?: string;
    table?: number;
    row?: number;
    column?: number;
    line?: number;
    position?: number;
    range?: string;
  };
  metadata?: Record<string, any>;
}

/**
 * Structured document data
 */
export interface DocumentData {
  fields: DocumentField[];
  documentType: 'word' | 'excel' | 'pdf' | 'image';
  metadata?: Record<string, any>;
}

/**
 * File processing status
 */
export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Processed file record
 */
export interface ProcessedFile {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  uploadedAt: Date;
  processedAt?: Date;
  status: ProcessingStatus;
  confidence?: number;
  errorMessage?: string;
}

/**
 * DUA Template structure
 */
export interface DuaTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  filePath: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  fieldMappings: TemplateFieldMapping[];
}

/**
 * Template field mapping
 */
export interface TemplateFieldMapping {
  templateField: string;
  sourceFields: string[];
  required: boolean;
  defaultValue?: any;
  validationRules?: ValidationRule[];
}

/**
 * Validation rule
 */
export interface ValidationRule {
  type: 'required' | 'format' | 'range' | 'custom';
  parameter?: any;
  errorMessage: string;
}
