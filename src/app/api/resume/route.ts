import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  const filePath = join(process.cwd(), "public", "Taj_Khunkhun.docx");
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=Taj_Khunkhun_Resume.docx",
    },
  });
}
