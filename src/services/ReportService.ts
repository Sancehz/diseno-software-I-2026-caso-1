/**
 * ReportService — operational and performance report generation.
 * Permission required: VIEW_REPORTS (Manager only)
 */
export class ReportService {
  async getOperationalSummary() {
    // TODO: query metrics from storage / Application Insights
    return { totalProcessed: 0, successRate: 0, averageDurationMs: 0 };
  }
}
