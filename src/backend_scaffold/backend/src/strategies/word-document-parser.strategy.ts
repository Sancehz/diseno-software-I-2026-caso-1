/**
 * Word Document Parser Strategy
 * 
 * Implements document parsing for Microsoft Word files (.docx, .doc)
 * 
 * Algorithm:
 * - Text extraction using mammoth.js
 * - Heading structure analysis for document organization
 * - Table detection and extraction
 * - Metadata extraction (author, creation date, etc.)
 * 
 * Parameters:
 * - Preserves document structure through heading levels
 * - Extracts tables as structured data
 * - Identifies key-value pairs through pattern matching
 */

import {
  DocumentParserStrategy,
  ParseResult,
  ParserOptions,
} from './document-parser.strategy';
import { DocumentData, DocumentField } from '@models/document-data.model';
import { LoggerService } from '@services/logger.service';

/**
 * Word document specific parsing result
 */
interface WordContent {
  text: string;
  headings: Array<{ level: number; text: string; position: number }>;
  tables: Array<{ rows: string[][]; caption?: string }>;
  metadata: {
    author?: string;
    createdDate?: Date;
    modifiedDate?: Date;
    wordCount?: number;
  };
}

export class WordDocumentParserStrategy extends DocumentParserStrategy {
  private logger: LoggerService;

  constructor(options?: ParserOptions) {
    super(options);
    this.logger = LoggerService.getInstance();
  }

  /**
   * Parse Word document and extract structured data
   */
  async parse(filePath: string): Promise<ParseResult> {
    const startTime = Date.now();
    const metadata = await this.extractMetadata(filePath);
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      this.logger.debug(`Parsing Word document: ${filePath}`);

      // Extract content from Word document
      const wordContent = await this.extractWordContent(filePath);

      // Convert to DocumentData structure
      const documentData = await this.convertToDocumentData(wordContent);

      // Validate extracted data
      const validation = this.validateData(documentData);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }

      // Calculate confidence score
      const extractedFields = this.countExtractedFields(documentData);
      const expectedFields = this.estimateExpectedFields(wordContent);
      const qualityScore = this.assessContentQuality(wordContent);
      const confidence = this.calculateConfidence(extractedFields, expectedFields, qualityScore);

      if (confidence < this.options.minConfidence) {
        warnings.push(
          `Document confidence (${confidence.toFixed(2)}) below threshold (${this.options.minConfidence})`
        );
      }

      const processingTimeMs = Date.now() - startTime;

      return {
        data: documentData,
        confidence,
        metadata: {
          fileName: metadata.fileName,
          fileType: 'docx',
          parseMethod: 'WordDocumentParserStrategy',
          timestamp: new Date(),
          processingTimeMs,
        },
        warnings,
        errors,
      };
    } catch (error) {
      this.logger.error('Error parsing Word document', error);
      errors.push(`Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        data: {} as DocumentData,
        confidence: 0,
        metadata: {
          fileName: metadata.fileName,
          fileType: 'docx',
          parseMethod: 'WordDocumentParserStrategy',
          timestamp: new Date(),
          processingTimeMs: Date.now() - startTime,
        },
        warnings,
        errors,
      };
    }
  }

  /**
   * Check if file is a Word document
   */
  async canParse(filePath: string): Promise<boolean> {
    const ext = filePath.toLowerCase().split('.').pop();
    return this.getSupportedExtensions().includes(`.${ext}`);
  }

  /**
   * Get supported file extensions
   */
  getSupportedExtensions(): string[] {
    return ['.docx', '.doc'];
  }

  /**
   * Extract raw content from Word document
   * Implementation placeholder - uses mammoth.js in actual implementation
   */
  private async extractWordContent(filePath: string): Promise<WordContent> {
    // TODO: Implement using mammoth.js
    // const result = await mammoth.extractRawText({ path: filePath });
    // const html = await mammoth.convertToHtml({ path: filePath });
    
    return {
      text: '',
      headings: [],
      tables: [],
      metadata: {},
    };
  }

  /**
   * Convert Word content to standardized DocumentData
   */
  private async convertToDocumentData(wordContent: WordContent): Promise<DocumentData> {
    const fields: DocumentField[] = [];

    // Extract fields from text using pattern matching
    const keyValuePairs = this.extractKeyValuePairs(wordContent.text);
    keyValuePairs.forEach((pair) => {
      fields.push({
        key: pair.key,
        value: pair.value,
        confidence: pair.confidence,
        source: 'text',
        location: pair.location,
      });
    });

    // Extract fields from headings
    wordContent.headings.forEach((heading) => {
      fields.push({
        key: `heading_${heading.level}`,
        value: heading.text,
        confidence: 1.0,
        source: 'heading',
        location: { position: heading.position },
      });
    });

    // Extract fields from tables
    wordContent.tables.forEach((table, tableIndex) => {
      const tableFields = this.extractTableFields(table.rows, tableIndex);
      fields.push(...tableFields);
    });

    return {
      fields,
      documentType: 'word',
      metadata: wordContent.metadata,
    };
  }

  /**
   * Extract key-value pairs from text using pattern matching
   */
  private extractKeyValuePairs(text: string): Array<{
    key: string;
    value: string;
    confidence: number;
    location: { line: number };
  }> {
    const pairs: Array<{ key: string; value: string; confidence: number; location: { line: number } }> = [];
    const lines = text.split('\n');

    // Pattern: "Key: Value" or "Key - Value"
    const keyValuePattern = /^([^::\-]+)[:\-]\s*(.+)$/;

    lines.forEach((line, lineNumber) => {
      const match = line.trim().match(keyValuePattern);
      if (match) {
        pairs.push({
          key: match[1].trim(),
          value: match[2].trim(),
          confidence: 0.8,
          location: { line: lineNumber },
        });
      }
    });

    return pairs;
  }

  /**
   * Extract fields from table structure
   */
  private extractTableFields(rows: string[][], tableIndex: number): DocumentField[] {
    const fields: DocumentField[] = [];

    if (rows.length === 0) return fields;

    // Assume first row is header
    const headers = rows[0];

    // Extract data rows
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      headers.forEach((header, colIndex) => {
        if (row[colIndex]) {
          fields.push({
            key: `table_${tableIndex}_${header}`,
            value: row[colIndex],
            confidence: 0.9,
            source: 'table',
            location: { table: tableIndex, row: i, column: colIndex },
          });
        }
      });
    }

    return fields;
  }

  /**
   * Count extracted fields
   */
  private countExtractedFields(data: DocumentData): number {
    return data.fields?.length ?? 0;
  }

  /**
   * Estimate expected number of fields based on document structure
   */
  private estimateExpectedFields(content: WordContent): number {
    let estimate = 0;

    // Count potential fields from text length
    estimate += Math.floor(content.text.length / 100); // Rough estimate

    // Count table cells
    content.tables.forEach((table) => {
      estimate += table.rows.length * (table.rows[0]?.length ?? 0);
    });

    return Math.max(estimate, 1); // At least 1 to avoid division by zero
  }

  /**
   * Assess content quality
   */
  private assessContentQuality(content: WordContent): number {
    let score = 0;

    // Has text content
    if (content.text.length > 100) score += 0.3;

    // Has structured headings
    if (content.headings.length > 0) score += 0.3;

    // Has tables
    if (content.tables.length > 0) score += 0.2;

    // Has metadata
    if (content.metadata.author) score += 0.1;
    if (content.metadata.createdDate) score += 0.1;

    return Math.min(score, 1.0);
  }
}
