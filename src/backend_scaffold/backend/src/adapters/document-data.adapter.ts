/**
 * Document Data Adapter (Adapter Pattern)
 * 
 * Converts output from various DocumentParserStrategy implementations
 * into a centralized, normalized DocumentData format with concrete
 * formatted and labeled data points.
 * 
 * Responsibilities:
 * - Normalize field names across different document types
 * - Apply semantic mapping to customs terminology
 * - Standardize data formats (dates, currencies, etc.)
 * - Merge duplicate or related fields
 * - Apply business rules for field interpretation
 */

import { DocumentData, DocumentField } from '@models/document-data.model';
import { ParseResult } from '@strategies/document-parser.strategy';
import { LoggerService } from '@services/logger.service';
import { ConfigService } from '@config/config.service';

/**
 * Normalized DUA field structure
 */
export interface NormalizedDuaData {
  // Exporter Information
  exporterName?: string;
  exporterAddress?: string;
  exporterTaxId?: string;
  exporterCountry?: string;

  // Importer Information
  importerName?: string;
  importerAddress?: string;
  importerTaxId?: string;
  importerCountry?: string;

  // Shipment Details
  invoiceNumber?: string;
  invoiceDate?: Date;
  currency?: string;
  totalValue?: number;
  freightCost?: number;
  insuranceCost?: number;

  // Customs Information
  customsOffice?: string;
  customsRegime?: string;
  tariffCode?: string;
  originCountry?: string;
  destinationCountry?: string;

  // Product Information
  products?: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitValue: number;
    totalValue: number;
    tariffCode?: string;
    netWeight?: number;
    grossWeight?: number;
  }>;

  // Transport Information
  transportMode?: string;
  vesselName?: string;
  containerNumber?: string;
  billOfLading?: string;

  // Additional Fields
  remarks?: string;
  attachments?: string[];

  // Metadata
  confidence: number;
  lastUpdated: Date;
  processingStatus: 'draft' | 'validated' | 'flagged';
}

/**
 * Field mapping configuration
 * Maps various field names to standardized DUA fields
 */
interface FieldMapping {
  duaField: keyof NormalizedDuaData;
  aliases: string[];
  validators?: Array<(value: any) => boolean>;
  transformers?: Array<(value: any) => any>;
}

export class DocumentDataAdapter {
  private logger: LoggerService;
  private config: ConfigService;
  private fieldMappings: FieldMapping[];

  constructor() {
    this.logger = LoggerService.getInstance();
    this.config = ConfigService.getInstance();
    this.initializeFieldMappings();
  }

  /**
   * Adapt parsed document data to normalized DUA format
   */
  adapt(parseResult: ParseResult): NormalizedDuaData {
    const startTime = Date.now();

    this.logger.debug(
      `Adapting ${parseResult.metadata.parseMethod} output to DUA format`
    );

    // Initialize normalized data
    const normalizedData: NormalizedDuaData = {
      confidence: parseResult.confidence,
      lastUpdated: new Date(),
      processingStatus: 'draft',
    };

    // Map each field from source to normalized format
    parseResult.data.fields?.forEach((field) => {
      this.mapField(field, normalizedData);
    });

    // Apply semantic enrichment
    this.enrichWithSemantics(normalizedData);

    // Merge duplicate or related fields
    this.mergeDuplicateFields(normalizedData);

    // Validate and flag low-confidence fields
    this.validateAndFlag(normalizedData);

    const processingTime = Date.now() - startTime;
    this.logger.debug(`Adaptation completed in ${processingTime}ms`);

    return normalizedData;
  }

  /**
   * Batch adapt multiple parse results (for multi-document processing)
   */
  adaptMultiple(parseResults: ParseResult[]): NormalizedDuaData {
    const normalizedResults = parseResults.map((result) => this.adapt(result));

    // Merge all results into single normalized data
    return this.mergeNormalizedData(normalizedResults);
  }

  /**
   * Map a single field to normalized structure
   */
  private mapField(field: DocumentField, target: NormalizedDuaData): void {
    const mapping = this.findFieldMapping(field.key);

    if (!mapping) {
      // Unknown field - log for analysis
      this.logger.debug(`Unmapped field: ${field.key}`);
      return;
    }

    // Apply transformers
    let value = field.value;
    if (mapping.transformers) {
      for (const transformer of mapping.transformers) {
        value = transformer(value);
      }
    }

    // Apply validators
    if (mapping.validators) {
      const isValid = mapping.validators.every((validator) => validator(value));
      if (!isValid) {
        this.logger.warn(
          `Field ${field.key} failed validation: ${value}`
        );
        return;
      }
    }

    // Set value with confidence check
    if (field.confidence >= this.config.get('MIN_FIELD_CONFIDENCE')) {
      target[mapping.duaField] = value as any;
    }
  }

  /**
   * Find field mapping by key or aliases
   */
  private findFieldMapping(key: string): FieldMapping | undefined {
    const normalizedKey = this.normalizeFieldName(key);

    return this.fieldMappings.find((mapping) => {
      const normalizedAliases = mapping.aliases.map(alias =>
        this.normalizeFieldName(alias)
      );
      return normalizedAliases.includes(normalizedKey);
    });
  }

  /**
   * Normalize field name for matching (lowercase, remove special chars)
   */
  private normalizeFieldName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
  }

  /**
   * Enrich data with semantic analysis
   * Uses AI/ML to infer missing fields or improve field quality
   */
  private enrichWithSemantics(data: NormalizedDuaData): void {
    // TODO: Implement semantic enrichment using OpenAI API
    // - Infer missing countries from addresses
    // - Standardize company names
    // - Validate tariff codes
    // - Extract implicit information from remarks
  }

  /**
   * Merge duplicate or related fields
   */
  private mergeDuplicateFields(data: NormalizedDuaData): void {
    // Example: Merge separate street/city/country into full address
    if (data.exporterAddress) {
      // Already has full address
      return;
    }

    // TODO: Implement field merging logic
  }

  /**
   * Validate normalized data and set processing status
   */
  private validateAndFlag(data: NormalizedDuaData): void {
    const confidenceThreshold = this.config.get('CONFIDENCE_THRESHOLD');

    if (data.confidence < confidenceThreshold) {
      data.processingStatus = 'flagged';
      this.logger.warn(`Document flagged: low confidence (${data.confidence})`);
    } else if (this.hasRequiredFields(data)) {
      data.processingStatus = 'validated';
    } else {
      data.processingStatus = 'flagged';
      this.logger.warn('Document flagged: missing required fields');
    }
  }

  /**
   * Check if all required fields are present
   */
  private hasRequiredFields(data: NormalizedDuaData): boolean {
    const requiredFields: Array<keyof NormalizedDuaData> = [
      'exporterName',
      'importerName',
      'invoiceNumber',
      'products',
    ];

    return requiredFields.every((field) => data[field] !== undefined);
  }

  /**
   * Merge multiple normalized data objects
   */
  private mergeNormalizedData(
    dataArray: NormalizedDuaData[]
  ): NormalizedDuaData {
    if (dataArray.length === 0) {
      throw new Error('Cannot merge empty array');
    }

    if (dataArray.length === 1) {
      return dataArray[0];
    }

    // TODO: Implement smart merging logic
    // - Prefer higher confidence values
    // - Combine product arrays
    // - Resolve conflicts intelligently

    return dataArray[0];
  }

  /**
   * Initialize field mappings
   * Maps various field names to standardized DUA fields
   */
  private initializeFieldMappings(): void {
    this.fieldMappings = [
      // Exporter Information
      {
        duaField: 'exporterName',
        aliases: [
          'exporter',
          'exportername',
          'seller',
          'vendor',
          'shipper',
          'consignor',
        ],
      },
      {
        duaField: 'exporterTaxId',
        aliases: ['exportertaxid', 'exporterid', 'sellertaxid', 'vendorid'],
      },

      // Importer Information
      {
        duaField: 'importerName',
        aliases: [
          'importer',
          'importername',
          'buyer',
          'purchaser',
          'consignee',
        ],
      },
      {
        duaField: 'importerTaxId',
        aliases: ['importertaxid', 'importerid', 'buyertaxid'],
      },

      // Invoice Information
      {
        duaField: 'invoiceNumber',
        aliases: ['invoice', 'invoiceno', 'invoicenumber', 'factura'],
      },
      {
        duaField: 'invoiceDate',
        aliases: ['invoicedate', 'date', 'fecha'],
        transformers: [this.parseDate],
      },
      {
        duaField: 'totalValue',
        aliases: ['total', 'totalvalue', 'amount', 'totalamount'],
        transformers: [this.parseNumber],
      },

      // Customs Information
      {
        duaField: 'tariffCode',
        aliases: ['tariff', 'tariffcode', 'hscode', 'hs', 'commoditycode'],
      },

      // Additional mappings...
      // (Complete list would be much longer in production)
    ];
  }

  /**
   * Date parsing transformer
   */
  private parseDate(value: any): Date | undefined {
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  }

  /**
   * Number parsing transformer
   */
  private parseNumber(value: any): number | undefined {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }
}
