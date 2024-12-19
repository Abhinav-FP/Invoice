import chromium from "@sparticuz/chromium";

/**
 * Generate a PDF document from the given HTML string.
 *
 * @async
 * @param {string} html - The HTML document to convert into a PDF.
 * @returns {Promise<Buffer>} A promise that resolves to a Buffer containing the generated PDF.
 */
export async function generatePdfFromHtml(html: string): Promise<Buffer> {
    let browser;

    try {
        // Launch Puppeteer browser
        if (process.env.NODE_ENV === "production") {
            const puppeteer = await import("puppeteer-core");
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(process.env.CHROMIUM_EXECUTABLE_PATH || ""),
                headless: true,
                ignoreHTTPSErrors: true,
            });
        } else {
            const puppeteer = await import("puppeteer");
            browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                headless: "new",
            });
        }

        if (!browser) throw new Error("Browser launch failed");

        const page = await browser.newPage();

        // Set the content of the page
        await page.setContent(html, { waitUntil: "networkidle0" });

        // Optionally, add Tailwind CSS if required
        const tailwindCdn = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
        await page.addStyleTag({ url: tailwindCdn });

        // Generate the PDF
        const pdfBuffer = await page.pdf({
            format: "a4",
            printBackground: true,
        });

        // Close the page
        await page.close();

        // Return the PDF buffer
        return pdfBuffer;
    } catch (error: unknown) {
        console.error("Error generating PDF:", error);
        throw new Error(`PDF generation failed: ${error}`);
    } finally {
        if (browser) await browser.close();
    }
}
