import type { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import { promisify } from "util";
import { generatePdfFromHtml } from "../../utils/pdfGenerator";

const execPromise = promisify(exec);

type Data = {
  message: string;
  status: boolean;
  pdf: Buffer | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // Install dependencies only if running on Vercel
    if (process.env.VERCEL) {
      await execPromise("/install-deps.sh");
    }

    const data = req.body;
    console.log("data", data?.html);
    const pdf = await generatePdfFromHtml(data?.html);
    console.log("pdf", pdf);

    res.status(200).json({
      status: true,
      message: "PDF generation successful",
      pdf: pdf,
    });
  } catch (error: unknown) {
    console.log("error", error);
    res.status(500).json({
      status: false,
      message: "PDF generation Failed. Check vercel logs",
      pdf: null,
    });
  }
}
