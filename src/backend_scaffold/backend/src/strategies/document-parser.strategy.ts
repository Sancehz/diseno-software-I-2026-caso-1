/**
 * Document Parser Strategy (Strategy Pattern)
 * 
 * Base interface and abstract class for different document parsing strategies.
 * Each document type (Word, Excel, PDF) has its own parsing implementation.
 * 
 * Algorithm Selection:
 * - Word documents: Text extraction with heading analysis
 * - Excel documents: Table and cell data extraction
 * - PDF documents: OCR + text extraction with layout analysis
 */

import { DocumentData } from '@models/document-data.model';

/**
 * Parsed document result with confidence scores
 */
export interface ParseResult {
  data: DocumentData;
  confidence: number;
  metadata: {
    fileName: string;
    fileType: string;
    parseMethod: string;
    timestamp: Date;
    processingTimeMs: number;
  };
  warnings: string[];
  errors: string[];
}

/**
 * Parser configuration options
 */
export interface ParserOptions {
  // Confidence thresholds from algorithm parameters
  minConfidence?: number;
  semanticSimilarityThreshold?: number;
  fuzzyMatchThreshold?: number;
  
  // OCR settings
  ocrLanguage?: string;
  ocrPageSegmentationMode?: number;
  
  // Processing options
  extractImages?: boolean;
  extractTables?: boolean;
  preserveFormatting?: boolean;
  strictValidation?: boolean;
  autoCorrection?: boolean;
}

/**
 * Abstract base class for document parsing strategies
 */
export abstract class DocumentParserStrategy {
  protected options: Required<ParserOptions>;

  constructor(options: ParserOptions = {}) {
    // Default values from configuration service (to be injected)
    this.options = {
      minConfidence: options.minConfidence ?? 0.60,
      semanticSimilarityThreshold: options.semanticSimilarityThreshold ?? 0.80,
      fuzzyMatchThreshold: options.fuzzyMatchThreshold ?? 85,
      ocrLanguage: options.ocrLanguage ?? 'spa+eng',
      ocrPageSegmentationMode: options.ocrPageSegmentationMode ?? 3,
      extractImages: options.extractImages ?? false,
      extractTables: options.extractTables ?? true,
      preserveFormatting: options.preserveFormatting ?? false,
      strictValidation: options.strictValidation ?? false,
      autoCorrection: options.autoCorrection ?? true,
    };
  }

  /**
   * Parse document and extract data
   * Must be implemented by concrete strategies
   */
  abstract parse(filePath: string): Promise<ParseResult>;

  /**
   * Validate that the file can be parsed by this strategy
   */
  abstract canParse(filePath: string): Promise<boolean>;

  /**
   * Get supported file extensions for this strategy
   */
  abstract getSupportedExtensions(): string[];

  /**
   * Calculate confidence score for parsed data
   * Common across all strategies
   */
  protected calculateConfidence(
    extractedFields: number,
    totalExpectedFields: number,
    qualityScore: number
  ): number {
    const completeness = extractedFields / totalExpectedFields;
    const confidence = (completeness * 0.6) + (qualityScore * 0.4);
    return Math.min(Math.max(confidence, 0), 1); // Clamp between 0 and 1
  }

  /**
   * Validate parsed data against business rules
   */
  protected validateData(data: DocumentData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation (to be extended by subclasses)
    if (!data || Object.keys(data).length === 0) {
      errors.push('No data extracted from document');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Extract metadata from file
   */
  protected async extractMetadata(filePath: string): Promise<{
    fileName: string;
    fileType: string;
    size: number;
  }> {
    // To be implemented with actual file system operations
    return {
      fileName: '',
      fileType: '',
      size: 0,
    };
  }
}
