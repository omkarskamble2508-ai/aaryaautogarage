const puppeteer = require('puppeteer-core');
const path = require('path');

const HTML_FILE = 'c:\\Internship2026-27\\FinalProject_Viva_Preparation.html';
const PDF_FILE  = 'c:\\Internship2026-27\\FinalProject_Viva_Preparation.pdf';

// Find Chrome installation
const CHROME_PATHS = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
];

const fs = require('fs');
const chromePath = CHROME_PATHS.find(p => fs.existsSync(p));

if (!chromePath) {
    console.error('No Chrome/Edge found!');
    process.exit(1);
}

console.log('Using browser:', chromePath);

(async () => {
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ],
        timeout: 30000,
    });

    const page = await browser.newPage();
    const fileUrl = 'file:///' + HTML_FILE.replace(/\\/g, '/');
    
    console.log('Loading:', fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('Page loaded. Generating PDF...');

    await page.pdf({
        path: PDF_FILE,
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
        displayHeaderFooter: false,
    });

    await browser.close();

    const stat = fs.statSync(PDF_FILE);
    console.log('SUCCESS!');
    console.log('PDF:', PDF_FILE);
    console.log('Size:', Math.round(stat.size / 1024) + ' KB');
})().catch(err => {
    console.error('ERROR:', err.message);
    process.exit(1);
});
