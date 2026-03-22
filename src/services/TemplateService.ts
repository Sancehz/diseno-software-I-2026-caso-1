/**
 * TemplateService — DUA template management.
 * Permission required: EDIT_TEMPLATES (Manager only)
 */
export class TemplateService {
  async listTemplates() {
    // TODO: list templates from storage
    return [];
  }

  async uploadTemplate(file: File) {
    // TODO: validate it's a .docx, store via StorageClient
  }
}
