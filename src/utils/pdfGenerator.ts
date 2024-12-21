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
        // Conditionally import Puppeteer
        let puppeteer;
        if (process.env.NODE_ENV === "production") {
            puppeteer = await import("puppeteer-core");
        } else {
            puppeteer = await import("puppeteer");
        }

        if (!puppeteer) throw new Error("Puppeteer import failed");

        // Launch Puppeteer browser
        if (process.env.NODE_ENV === "production") {
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath("https://github.com/Sparticuz/chromium/releases/download/v122.0.0/chromium-v122.0.0-pack.tar"),
                headless: true,
                ignoreHTTPSErrors: true,
            });
        } else {
            browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disable-setuid-sandbox"],
                headless: true, // Use boolean true for headless mode
            });
        }

        if (!browser) throw new Error("Browser launch failed");

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const tailwindCdn = "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
        await page.addStyleTag({ url: tailwindCdn });

        const pdfBuffer = await page.pdf({
            format: "a4",
            printBackground: true,
        });

        await page.close();
        return pdfBuffer;
    } catch (error: unknown) {
        console.error("Error generating PDF:", error);
        throw new Error(`PDF generation failed: ${error}`);
    } finally {
        if (browser) await browser.close();
    }
}
