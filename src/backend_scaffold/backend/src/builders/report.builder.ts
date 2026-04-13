/**
 * Report Builder (Builder Pattern)
 * 
 * Manages the setup and organization of DUA reports from multiple source files.
 * Takes normalized document data and constructs a complete DUA report.
 * 
 * Responsibilities:
 * - Orchestrate multi-document processing workflow
 * - Combine data from multiple sources (Word, Excel, PDF)
 * - Apply DUA template structure
 * - Generate confidence indicators
 * - Prepare final report for output
 */

import { NormalizedDuaData } from '@adapters/document-data.adapter';
import { LoggerService } from '@services/logger.service';
import { ConfigService } from '@config/config.service';

/**
 * DUA Report structure
 */
export interface DuaReport {
  // Report Metadata
  reportId: string;
  generatedAt: Date;
  version: string;
  templateId: string;

  // Source Documents
  sourceDocuments: Array<{
    fileName: string;
    fileType: string;
    processedAt: Date;
    confidence: number;
  }>;

  // Normalized Data
  data: NormalizedDuaData;

  // Confidence Indicators
  fieldConfidence: Map<string, number>;
  overallConfidence: number;

  // Validation Results
  validationStatus: 'passed' | 'flagged' | 'failed';
  validationErrors: string[];
  validationWarnings: string[];

  // Flagged Fields
  flaggedFields: Array<{
    fieldName: string;
    reason: string;
    currentValue: any;
    confidence: number;
    suggestedActions: string[];
  }>;

  // Processing Log
  processingLog: Array<{
    timestamp: Date;
    stage: string;
    message: string;
    level: 'info' | 'warn' | 'error';
  }>;
}

/**
 * Builder configuration
 */
export interface ReportBuilderConfig {
  templateId: string;
  templatePath: string;
  outputFormat: 'docx' | 'pdf' | 'json';
  includeConfidenceIndicators: boolean;
  strictValidation: boolean;
}

/**
 * Report Builder implementation
 */
export class ReportBuilder {
  private logger: LoggerService;
  private config: ConfigService;

  // Builder state
  private reportId?: string;
  private templateId?: string;
  private sourceDocuments: DuaReport['sourceDocuments'] = [];
  private normalizedData?: NormalizedDuaData;
  private processingLog: DuaReport['processingLog'] = [];

  constructor() {
    this.logger = LoggerService.getInstance();
    this.config = ConfigService.getInstance();
  }

  /**
   * Set report ID
   */
  setReportId(id: string): this {
    this.reportId = id;
    this.log('info', 'Report ID set', `ID: ${id}`);
    return this;
  }

  /**
   * Set template
   */
  setTemplate(templateId: string): this {
    this.templateId = templateId;
    this.log('info', 'Template set', `Template ID: ${templateId}`);
    return this;
  }

  /**
   * Add source document
   */
  addSourceDocument(
    fileName: string,
    fileType: string,
    confidence: number
  ): this {
    this.sourceDocuments.push({
      fileName,
      fileType,
      processedAt: new Date(),
      confidence,
    });
    this.log('info', 'Source document added', `File: ${fileName}, Type: ${fileType}`);
    return this;
  }

  /**
   * Add multiple source documents
   */
  addSourceDocuments(
    documents: Array<{
      fileName: string;
      fileType: string;
      confidence: number;
    }>
  ): this {
    documents.forEach((doc) => {
      this.addSourceDocument(doc.fileName, doc.fileType, doc.confidence);
    });
    return this;
  }

  /**
   * Set normalized data
   */
  setData(data: NormalizedDuaData): this {
    this.normalizedData = data;
    this.log('info', 'Normalized data set', `Confidence: ${data.confidence}`);
    return this;
  }

  /**
   * Build final DUA report
   */
  async build(): Promise<DuaReport> {
    this.log('info', 'Building report', 'Starting report construction');

    // Validate builder state
    this.validateBuilderState();

    // Calculate field-level confidence
    const fieldConfidence = this.calculateFieldConfidence();

    // Calculate overall confidence
    const overallConfidence = this.calculateOverallConfidence(fieldConfidence);

    // Validate report data
    const validation = await this.validateReport();

    // Identify flagged fields
    const flaggedFields = this.identifyFlaggedFields();

    // Construct final report
    const report: DuaReport = {
      reportId: this.reportId!,
      generatedAt: new Date(),
      version: '1.0',
      templateId: this.templateId!,
      sourceDocuments: this.sourceDocuments,
      data: this.normalizedData!,
      fieldConfidence,
      overallConfidence,
      validationStatus: validation.status,
      validationErrors: validation.errors,
      validationWarnings: validation.warnings,
      flaggedFields,
      processingLog: this.processingLog,
    };

    this.log('info', 'Report built', `Status: ${validation.status}`);

    return report;
  }

  /**
   * Reset builder to initial state
   */
  reset(): this {
    this.reportId = undefined;
    this.templateId = undefined;
    this.sourceDocuments = [];
    this.normalizedData = undefined;
    this.processingLog = [];
    return this;
  }

  /**
   * Validate builder has all required data
   */
  private validateBuilderState(): void {
    if (!this.reportId) {
      throw new Error('Report ID not set');
    }
    if (!this.templateId) {
      throw new Error('Template ID not set');
    }
    if (this.sourceDocuments.length === 0) {
      throw new Error('No source documents added');
    }
    if (!this.normalizedData) {
      throw new Error('Normalized data not set');
    }
  }

  /**
   * Calculate confidence for each field
   */
  private calculateFieldConfidence(): Map<string, number> {
    const fieldConfidence = new Map<string, number>();

    if (!this.normalizedData) return fieldConfidence;

    // Default confidence based on data completeness and quality
    Object.entries(this.normalizedData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Base confidence from normalized data
        let confidence = this.normalizedData!.confidence;

        // Adjust based on field importance
        if (this.isRequiredField(key)) {
          confidence = Math.min(confidence * 1.1, 1.0);
        }

        // Adjust based on data validation
        if (this.isValidFieldValue(key, value)) {
          confidence = Math.min(confidence * 1.05, 1.0);
        } else {
          confidence *= 0.8;
        }

        fieldConfidence.set(key, confidence);
      }
    });

    return fieldConfidence;
  }

  /**
   * Calculate overall report confidence
   */
  private calculateOverallConfidence(
    fieldConfidence: Map<string, number>
  ): number {
    if (fieldConfidence.size === 0) return 0;

    // Weighted average of field confidences
    let totalConfidence = 0;
    let totalWeight = 0;

    fieldConfidence.forEach((confidence, fieldName) => {
      const weight = this.isRequiredField(fieldName) ? 2 : 1;
      totalConfidence += confidence * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? totalConfidence / totalWeight : 0;
  }

  /**
   * Validate report data against business rules
   */
  private async validateReport(): Promise<{
    status: 'passed' | 'flagged' | 'failed';
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!this.normalizedData) {
      errors.push('No data to validate');
      return { status: 'failed', errors, warnings };
    }

    // Check required fields
    const missingFields = this.checkRequiredFields();
    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check data consistency
    const consistencyIssues = this.checkDataConsistency();
    warnings.push(...consistencyIssues);

    // Check confidence threshold
    const confidenceThreshold = this.config.get('CONFIDENCE_THRESHOLD');
    if (this.normalizedData.confidence < confidenceThreshold) {
      warnings.push(
        `Overall confidence (${this.normalizedData.confidence.toFixed(2)}) below threshold (${confidenceThreshold})`
      );
    }

    // Determine status
    let status: 'passed' | 'flagged' | 'failed';
    if (errors.length > 0) {
      status = 'failed';
    } else if (warnings.length > 0) {
      status = 'flagged';
    } else {
      status = 'passed';
    }

    return { status, errors, warnings };
  }

  /**
   * Check for required fields
   */
  private checkRequiredFields(): string[] {
    const required = [
      'exporterName',
      'importerName',
      'invoiceNumber',
      'products',
    ];

    return required.filter(
      (field) => !this.normalizedData?.[field as keyof NormalizedDuaData]
    );
  }

  /**
   * Check data consistency
   */
  private checkDataConsistency(): string[] {
    const warnings: string[] = [];

    if (!this.normalizedData) return warnings;

    // Example: Check if total value matches sum of products
    if (this.normalizedData.totalValue && this.normalizedData.products) {
      const productsTotal = this.normalizedData.products.reduce(
        (sum, product) => sum + (product.totalValue || 0),
        0
      );

      const difference = Math.abs(
        this.normalizedData.totalValue - productsTotal
      );
      if (difference > 0.01) {
        warnings.push(
          `Invoice total (${this.normalizedData.totalValue}) does not match sum of products (${productsTotal})`
        );
      }
    }

    return warnings;
  }

  /**
   * Identify fields that need review
   */
  private identifyFlaggedFields(): DuaReport['flaggedFields'] {
    const flagged: DuaReport['flaggedFields'] = [];
    const minConfidence = this.config.get('MIN_FIELD_CONFIDENCE');

    if (!this.normalizedData) return flagged;

    Object.entries(this.normalizedData).forEach(([fieldName, value]) => {
      // Skip metadata fields
      if (['confidence', 'lastUpdated', 'processingStatus'].includes(fieldName)) {
        return;
      }

      const confidence = this.normalizedData!.confidence;

      if (confidence < minConfidence) {
        flagged.push({
          fieldName,
          reason: 'Low confidence score',
          currentValue: value,
          confidence,
          suggestedActions: [
            'Verify value against source documents',
            'Manually review and correct if needed',
          ],
        });
      }

      if (!this.isValidFieldValue(fieldName, value)) {
        flagged.push({
          fieldName,
          reason: 'Failed validation',
          currentValue: value,
          confidence,
          suggestedActions: [
            'Check format and data type',
            'Verify against business rules',
          ],
        });
      }
    });

    return flagged;
  }

  /**
   * Check if field is required
   */
  private isRequiredField(fieldName: string): boolean {
    const required = [
      'exporterName',
      'importerName',
      'invoiceNumber',
      'products',
    ];
    return required.includes(fieldName);
  }

  /**
   * Validate field value
   */
  private isValidFieldValue(fieldName: string, value: any): boolean {
    // Basic validation - extend with specific rules
    if (value === undefined || value === null) return false;

    // Type-specific validation
    if (fieldName.includes('Date') && !(value instanceof Date)) {
      return false;
    }

    if (fieldName.includes('Value') && typeof value !== 'number') {
      return false;
    }

    return true;
  }

  /**
   * Add log entry
   */
  private log(
    level: 'info' | 'warn' | 'error',
    stage: string,
    message: string
  ): void {
    this.processingLog.push({
      timestamp: new Date(),
      stage,
      message,
      level,
    });

    this.logger[level](`[ReportBuilder:${stage}] ${message}`);
  }
}
