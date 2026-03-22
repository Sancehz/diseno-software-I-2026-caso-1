import { GenerateDuaRequestSchema } from "@/validation/duaSchemas";

describe("GenerateDuaRequestSchema", () => {
  it("accepts valid request", () => {
    const result = GenerateDuaRequestSchema.safeParse({
      templateFileId: "template-001",
      sourceFileIds: ["file-001", "file-002"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty sourceFileIds", () => {
    const result = GenerateDuaRequestSchema.safeParse({
      templateFileId: "template-001",
      sourceFileIds: [],
    });
    expect(result.success).toBe(false);
  });
});
