import { getFileType, formatBytes } from "@/utils/fileUtils";

describe("getFileType", () => {
  it("detects word documents", () => {
    expect(getFileType("invoice.docx")).toBe("word");
  });
  it("detects excel files", () => {
    expect(getFileType("data.xlsx")).toBe("excel");
  });
  it("detects PDFs", () => {
    expect(getFileType("scan.pdf")).toBe("pdf");
  });
  it("detects images", () => {
    expect(getFileType("photo.png")).toBe("image");
    expect(getFileType("photo.jpg")).toBe("image");
  });
  it("returns unknown for unrecognised extensions", () => {
    expect(getFileType("archive.zip")).toBe("unknown");
  });
});

describe("formatBytes", () => {
  it("formats bytes", () => expect(formatBytes(500)).toBe("500 B"));
  it("formats kilobytes", () => expect(formatBytes(2048)).toBe("2.0 KB"));
  it("formats megabytes", () => expect(formatBytes(5 * 1024 * 1024)).toBe("5.0 MB"));
});
