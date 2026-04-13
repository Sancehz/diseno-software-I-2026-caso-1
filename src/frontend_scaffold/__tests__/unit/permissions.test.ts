import { hasPermission, getPermissionsForRole } from "@/lib/permissions";

describe("hasPermission", () => {
  it("grants Manager permissions to Manager role", () => {
    expect(hasPermission("Manager", "MANAGE_USERS")).toBe(true);
    expect(hasPermission("Manager", "VIEW_REPORTS")).toBe(true);
    expect(hasPermission("Manager", "EDIT_TEMPLATES")).toBe(true);
  });

  it("denies Customs Agent permissions to Manager role", () => {
    expect(hasPermission("Manager", "GENERATE_DUA")).toBe(false);
    expect(hasPermission("Manager", "DOWNLOAD_DUA")).toBe(false);
  });

  it("grants Customs Agent permissions to CustomsAgent role", () => {
    expect(hasPermission("CustomsAgent", "LOAD_FILES")).toBe(true);
    expect(hasPermission("CustomsAgent", "GENERATE_DUA")).toBe(true);
    expect(hasPermission("CustomsAgent", "DOWNLOAD_DUA")).toBe(true);
  });

  it("denies Manager permissions to CustomsAgent role", () => {
    expect(hasPermission("CustomsAgent", "MANAGE_USERS")).toBe(false);
    expect(hasPermission("CustomsAgent", "VIEW_REPORTS")).toBe(false);
  });
});

describe("getPermissionsForRole", () => {
  it("returns all 3 Manager permissions", () => {
    expect(getPermissionsForRole("Manager")).toHaveLength(3);
  });

  it("returns all 3 Customs Agent permissions", () => {
    expect(getPermissionsForRole("CustomsAgent")).toHaveLength(3);
  });
});
