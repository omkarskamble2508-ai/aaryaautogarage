const puppeteer = require('puppeteer-core');
const fs = require('fs');

const HTML_FILE = 'c:\\Internship2026-27\\AaryaAutoGarage_ProjectGuide.html';
const PDF_FILE  = 'c:\\Internship2026-27\\AaryaAutoGarage_ProjectGuide.pdf';

const CHROME_PATHS = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
];
const chromePath = CHROME_PATHS.find(p => fs.existsSync(p));
if (!chromePath) { console.error('No Chrome found!'); process.exit(1); }
console.log('Browser:', chromePath);

(async () => {
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage','--disable-gpu'],
        timeout: 30000,
    });
    const page = await browser.newPage();
    const fileUrl = 'file:///' + HTML_FILE.replace(/\\/g, '/');
    console.log('Loading:', fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 20000 });
    console.log('Generating PDF...');
    await page.pdf({
        path: PDF_FILE,
        format: 'A4',
        printBackground: true,
        margin: { top: '15mm', bottom: '15mm', left: '12mm', right: '12mm' },
    });
    await browser.close();
    const stat = fs.statSync(PDF_FILE);
    console.log('SUCCESS! PDF:', PDF_FILE);
    console.log('Size:', Math.round(stat.size / 1024) + ' KB');
})().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
