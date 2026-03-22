import { requirePermission } from "@/lib/auth-utils";
import { TemplateService } from "@/services/TemplateService";

/** Template management page — Manager only (EDIT_TEMPLATES permission). */
export default async function Page() {
  await requirePermission("EDIT_TEMPLATES");
  const templateService = new TemplateService();
  const templates = await templateService.listTemplates();
  return <div>Templates: {templates.length}</div>;
}
