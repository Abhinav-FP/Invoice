// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { generatePdfFromHtml } from "../pdfGenerator";

type Data = {
  message: string;
  status: boolean
  pdf: unknown
};

export default async function POST(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try{
    const data=req.body;
    console.log('data',data?.html);
    const pdf=await generatePdfFromHtml(data?.html);
    console.log("pdf",pdf)
    res.status(200).json({
      status:true,
      message: "PDF generation successful", 
      pdf:pdf,
    });
  }catch(error:unknown){
    console.log("error",error);
    res.status(500).json({
      status:false,
      message: "PDF generation Failed. Check vercel logs", 
      pdf:null,
    });
  }
}