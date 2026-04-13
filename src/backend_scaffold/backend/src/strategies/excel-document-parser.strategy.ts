/**
 * Excel Document Parser Strategy
 * 
 * Implements document parsing for Microsoft Excel files (.xlsx, .xls)
 * 
 * Algorithm:
 * - Multi-sheet processing with sheet name analysis
 * - Table and cell data extraction with formula evaluation
 * - Data type detection and validation
 * - Named range identification
 * 
 * Parameters:
 * - Extracts all sheets or specified sheets
 * - Preserves formulas vs evaluates to values
 * - Detects merged cells and cell formatting
 */

import {
  DocumentParserStrategy,
  ParseResult,
  ParserOptions,
} from './document-parser.strategy';
import { DocumentData, DocumentField } from '@models/document-data.model';
import { LoggerService } from '@services/logger.service';

/**
 * Excel cell data with metadata
 */
interface ExcelCell {
  value: any;
  formula?: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'formula' | 'empty';
  format?: string;
  row: number;
  column: number;
}

/**
 * Excel sheet data
 */
interface ExcelSheet {
  name: string;
  cells: ExcelCell[];
  tables: Array<{
    range: string;
    headers: string[];
    data: any[][];
  }>;
  namedRanges: Array<{ name: string; range: string; value: any }>;
}

/**
 * Excel document content
 */
interface ExcelContent {
  sheets: ExcelSheet[];
  metadata: {
    creator?: string;
    createdDate?: Date;
    modifiedDate?: Date;
    sheetCount: number;
  };
}

export class ExcelDocumentParserStrategy extends DocumentParserStrategy {
  private logger: LoggerService;

  constructor(options?: ParserOptions) {
    super(options);
    this.logger = LoggerService.getInstance();
  }

  /**
   * Parse Excel document and extract structured data
   */
  async parse(filePath: string): Promise<ParseResult> {
    const startTime = Date.now();
    const metadata = await this.extractMetadata(filePath);
    const warnings: string[] = [];
    const errors: string[] = [];

    try {
      this.logger.debug(`Parsing Excel document: ${filePath}`);

      // Extract content from Excel
      const excelContent = await this.extractExcelContent(filePath);

      // Convert to DocumentData structure
      const documentData = await this.convertToDocumentData(excelContent);

      // Validate extracted data
      const validation = this.validateData(documentData);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }

      // Calculate confidence score
      const extractedFields = this.countExtractedFields(documentData);
      const expectedFields = this.estimateExpectedFields(excelContent);
      const qualityScore = this.assessContentQuality(excelContent);
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
          fileType: 'xlsx',
          parseMethod: 'ExcelDocumentParserStrategy',
          timestamp: new Date(),
          processingTimeMs,
        },
        warnings,
        errors,
      };
    } catch (error) {
      this.logger.error('Error parsing Excel document', error);
      errors.push(`Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      return {
        data: {} as DocumentData,
        confidence: 0,
        metadata: {
          fileName: metadata.fileName,
          fileType: 'xlsx',
          parseMethod: 'ExcelDocumentParserStrategy',
          timestamp: new Date(),
          processingTimeMs: Date.now() - startTime,
        },
        warnings,
        errors,
      };
    }
  }

  /**
   * Check if file is an Excel document
   */
  async canParse(filePath: string): Promise<boolean> {
    const ext = filePath.toLowerCase().split('.').pop();
    return this.getSupportedExtensions().includes(`.${ext}`);
  }

  /**
   * Get supported file extensions
   */
  getSupportedExtensions(): string[] {
    return ['.xlsx', '.xls', '.xlsm'];
  }

  /**
   * Extract raw content from Excel document
   * Implementation placeholder - uses xlsx library in actual implementation
   */
  private async extractExcelContent(filePath: string): Promise<ExcelContent> {
    // TODO: Implement using xlsx library
    // const workbook = XLSX.readFile(filePath);
    // const sheets = workbook.SheetNames.map(name => {
    //   const sheet = workbook.Sheets[name];
    //   return { name, data: XLSX.utils.sheet_to_json(sheet) };
    // });

    return {
      sheets: [],
      metadata: {
        sheetCount: 0,
      },
    };
  }

  /**
   * Convert Excel content to standardized DocumentData
   */
  private async convertToDocumentData(excelContent: ExcelContent): Promise<DocumentData> {
    const fields: DocumentField[] = [];

    excelContent.sheets.forEach((sheet, sheetIndex) => {
      // Extract fields from cells
      sheet.cells.forEach((cell) => {
        if (cell.type !== 'empty') {
          fields.push({
            key: `sheet_${sheetIndex}_${sheet.name}_cell_${cell.row}_${cell.column}`,
            value: this.formatCellValue(cell),
            confidence: this.calculateCellConfidence(cell),
            source: 'cell',
            location: {
              sheet: sheetIndex,
              sheetName: sheet.name,
              row: cell.row,
              column: cell.column,
            },
            metadata: {
              formula: cell.formula,
              type: cell.type,
              format: cell.format,
            },
          });
        }
      });

      // Extract fields from tables
      sheet.tables.forEach((table, tableIndex) => {
        const tableFields = this.extractTableFields(
          table,
          sheetIndex,
          sheet.name,
          tableIndex
        );
        fields.push(...tableFields);
      });

      // Extract named ranges
      sheet.namedRanges.forEach((range) => {
        fields.push({
          key: `named_range_${range.name}`,
          value: range.value,
          confidence: 0.95,
          source: 'namedRange',
          location: {
            sheet: sheetIndex,
            sheetName: sheet.name,
            range: range.range,
          },
        });
      });
    });

    return {
      fields,
      documentType: 'excel',
      metadata: excelContent.metadata,
    };
  }

  /**
   * Format cell value based on type
   */
  private formatCellValue(cell: ExcelCell): string {
    switch (cell.type) {
      case 'date':
        return cell.value instanceof Date
          ? cell.value.toISOString()
          : String(cell.value);
      case 'boolean':
        return cell.value ? 'true' : 'false';
      case 'number':
        return String(cell.value);
      case 'formula':
        // Return evaluated value, not formula
        return String(cell.value);
      default:
        return String(cell.value);
    }
  }

  /**
   * Calculate confidence for a cell based on its properties
   */
  private calculateCellConfidence(cell: ExcelCell): number {
    let confidence = 0.7; // Base confidence

    // Higher confidence for non-empty cells
    if (cell.type !== 'empty') confidence += 0.1;

    // Higher confidence for cells with formulas (intentional)
    if (cell.formula) confidence += 0.1;

    // Higher confidence for formatted cells
    if (cell.format) confidence += 0.05;

    // Lower confidence for very large numbers (might be errors)
    if (cell.type === 'number' && Math.abs(cell.value) > 1e10) {
      confidence -= 0.2;
    }

    return Math.min(Math.max(confidence, 0), 1);
  }

  /**
   * Extract fields from table structure
   */
  private extractTableFields(
    table: ExcelSheet['tables'][0],
    sheetIndex: number,
    sheetName: string,
    tableIndex: number
  ): DocumentField[] {
    const fields: DocumentField[] = [];

    table.data.forEach((row, rowIndex) => {
      table.headers.forEach((header, colIndex) => {
        if (row[colIndex] !== undefined && row[colIndex] !== null) {
          fields.push({
            key: `table_${sheetIndex}_${tableIndex}_${header}`,
            value: String(row[colIndex]),
            confidence: 0.9,
            source: 'table',
            location: {
              sheet: sheetIndex,
              sheetName,
              table: tableIndex,
              row: rowIndex,
              column: colIndex,
            },
          });
        }
      });
    });

    return fields;
  }

  /**
   * Count extracted fields
   */
  private countExtractedFields(data: DocumentData): number {
    return data.fields?.length ?? 0;
  }

  /**
   * Estimate expected number of fields
   */
  private estimateExpectedFields(content: ExcelContent): number {
    let estimate = 0;

    content.sheets.forEach((sheet) => {
      estimate += sheet.cells.filter((c) => c.type !== 'empty').length;
    });

    return Math.max(estimate, 1);
  }

  /**
   * Assess content quality
   */
  private assessContentQuality(content: ExcelContent): number {
    let score = 0;

    // Multiple sheets
    if (content.sheets.length > 1) score += 0.2;

    // Has tables
    const hasTables = content.sheets.some((s) => s.tables.length > 0);
    if (hasTables) score += 0.3;

    // Has named ranges
    const hasNamedRanges = content.sheets.some((s) => s.namedRanges.length > 0);
    if (hasNamedRanges) score += 0.2;

    // Has formulas
    const hasFormulas = content.sheets.some((s) =>
      s.cells.some((c) => c.formula)
    );
    if (hasFormulas) score += 0.2;

    // Has metadata
    if (content.metadata.creator) score += 0.1;

    return Math.min(score, 1.0);
  }
}
