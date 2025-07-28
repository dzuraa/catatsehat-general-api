// generatePdfBase64.ts
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import { DateTime } from 'luxon';

/**
 * Generate PDF from HTML + Daum data and return as base64
 * @param htmlTemplate - HTML string (with Handlebars syntax)
 * @param data - Full Daum data object
 * @returns base64 string of PDF
 */
export async function generatePdfBase64(htmlTemplate: string, data: any) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-gpu', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Hitung umur dari dateOfBirth (format: YYYY-MM-DD)
  handlebars.registerHelper('calculateAge', (dob: Date) => {
    const birthDate = DateTime.fromJSDate(dob);
    console.log(dob);
    const now = DateTime.now();
    const age = now.diff(birthDate, 'years').years;
    return Math.floor(age) || 0; // Pastikan mengembalikan angka bulat
  });

  // Format tanggal lahir jadi: 14 Juli 1949
  handlebars.registerHelper('formatDate', (dob: Date) => {
    const dt = DateTime.fromJSDate(dob);
    return dt.setLocale('id').toFormat('d MMMM yyyy');
  });

  // Konversi jenis kelamin
  handlebars.registerHelper('genderText', (gender: string) => {
    const g = gender;
    return g === 'MALE' ? 'Laki-laki' : g === 'FEMALE' ? 'Perempuan' : gender;
  });

  // Compile HTML with Handlebars
  const template = handlebars.compile(htmlTemplate);
  const finalHtml = template(data);

  await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm',
    },
  });
  console.log('PDF generated successfully');

  await browser.close();
  return Buffer.from(pdfBuffer);
}
