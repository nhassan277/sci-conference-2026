import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import path from 'path';

const LOGOS_DIR = '/home/ubuntu/workshop_logos';
const OUTPUT_DIR = '/home/ubuntu/social_posts_v4';

function toBase64(filePath) {
  try {
    const data = readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png';
    return `data:${mime};base64,${data.toString('base64')}`;
  } catch (e) { return ''; }
}

const sciLogo     = toBase64(`${LOGOS_DIR}/logo_sci2026.png`);
const facultyLogo = toBase64(`${LOGOS_DIR}/logo_faculty_science.jpeg`);
const cuLogo      = toBase64(`${LOGOS_DIR}/logo_cu_new.png`);
const chitosan    = toBase64(`${LOGOS_DIR}/chitosan.png`);
const agitech     = toBase64(`${LOGOS_DIR}/agitech.png`);
const nawah       = toBase64(`${LOGOS_DIR}/nawah.png`);
const marc        = toBase64(`${LOGOS_DIR}/marc.jpg`);
const medsol      = toBase64(`${LOGOS_DIR}/medsol.png`);
const colors      = toBase64(`${LOGOS_DIR}/colors.png`);
const egcompbio   = toBase64(`${LOGOS_DIR}/egcompbio.png`);
const aiArabi     = toBase64(`${LOGOS_DIR}/ai_arabi.jpeg`);
const gesr        = toBase64(`${LOGOS_DIR}/gesr.jpg`);
const hvd         = toBase64(`${LOGOS_DIR}/hvd.png`);

// vaccine is an emoji since no logo file
const vaccineEmoji = '💉';
const geoEmoji = '🌍';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Noto+Sans+Arabic:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; background: transparent; font-family: 'Montserrat', sans-serif; }
  .post { width: 1080px; background: #1a2a5e; }
  .top-bar { width: 100%; height: 10px; background: linear-gradient(90deg, #c9a227, #f0d060, #c9a227); }
  .header { padding: 18px 48px 10px; text-align: center; }
  .header .tag { font-size: 17px; color: #f0d060; font-style: italic; font-weight: 600; letter-spacing: 1px; margin-bottom: 6px; }
  .header .big-title { font-size: 68px; font-weight: 900; color: #ffffff; line-height: 1; letter-spacing: -2px; text-transform: uppercase; }
  .header .divider { width: 100px; height: 4px; background: linear-gradient(90deg, #c9a227, #f0d060); margin: 8px auto; border-radius: 2px; }
  .header .subtitle-en { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
  .header .subtitle-ar { font-size: 20px; font-weight: 700; color: #f0d060; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; }
  .count-box { margin: 8px 48px; background: rgba(255,255,255,0.08); border: 1.5px solid #c9a227; border-radius: 10px; padding: 8px 24px; text-align: center; }
  .count-box .num { font-size: 36px; font-weight: 900; color: #f0d060; line-height: 1; }
  .count-box .num-label { font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 2px; }
  .count-box .num-ar { font-size: 14px; color: #d0d8f0; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; }
  .ws-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 6px 28px; }
  .ws-card { background: #ffffff; border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 4px 14px rgba(0,0,0,0.35); }
  .ws-card .ch { background: #1a2a5e; padding: 6px 4px 5px; text-align: center; border-bottom: 2.5px solid #c9a227; }
  .ws-card .ch .wn { font-size: 12px; font-weight: 800; color: #c9a227; letter-spacing: 0.5px; }
  .ws-card .cl { background: #f8f8ff; height: 72px; display: flex; align-items: center; justify-content: center; padding: 5px; border-bottom: 1px solid #e8e8f0; }
  .ws-card .cl img { max-height: 58px; max-width: 140px; object-fit: contain; }
  .ws-card .cl .le { font-size: 42px; line-height: 1; }
  .ws-card .cb { padding: 6px 8px 5px; flex: 1; display: flex; flex-direction: column; gap: 3px; }
  .ws-card .ten { font-size: 12px; font-weight: 800; color: #1a2a5e; line-height: 1.25; text-align: center; }
  .ws-card .tar { font-size: 10px; font-weight: 700; color: #444466; line-height: 1.25; text-align: center; direction: rtl; font-family: 'Noto Sans Arabic', sans-serif; }
  .ws-card .cf { background: #c9a227; padding: 4px 6px; display: flex; justify-content: space-between; align-items: center; }
  .ws-card .cf .cd { font-size: 10px; font-weight: 700; color: #1a2a5e; }
  .ws-card .cf .cfe { font-size: 11px; font-weight: 900; color: #1a2a5e; }
  .free-fee { color: #006600 !important; }
  .footer-logos { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 8px 48px 4px; }
  .logo-wrap { background: #ffffff; border-radius: 50%; width: 62px; height: 62px; display: flex; align-items: center; justify-content: center; padding: 6px; box-shadow: 0 3px 10px rgba(0,0,0,0.3); }
  .logo-wrap img { height: 46px; width: 46px; object-fit: contain; }
  .bottom-cta { text-align: center; padding: 4px 48px 10px; }
  .bottom-cta .venue { font-size: 16px; color: #d0d8f0; font-weight: 600; margin-bottom: 4px; }
  .bottom-cta .register { font-size: 24px; font-weight: 800; color: #f0d060; }
  .bottom-bar { width: 100%; height: 10px; background: linear-gradient(90deg, #c9a227, #f0d060, #c9a227); }
`;

function card(num, logoSrc, logoEmoji, titleEn, titleAr, date, fee, isFree = false) {
  const logoHtml = logoSrc
    ? `<img src="${logoSrc}" />`
    : `<span class="le">${logoEmoji || '🔬'}</span>`;
  const feeClass = isFree ? 'cfe free-fee' : 'cfe';
  return `
    <div class="ws-card">
      <div class="ch"><div class="wn">WS ${String(num).padStart(2,'0')}</div></div>
      <div class="cl">${logoHtml}</div>
      <div class="cb">
        <div class="ten">${titleEn}</div>
        <div class="tar">${titleAr}</div>
      </div>
      <div class="cf">
        <span class="cd">${date}</span>
        <span class="${feeClass}">${fee}</span>
      </div>
    </div>
  `;
}

const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${CSS}</style></head>
<body>
<div class="post">
  <div class="top-bar"></div>
  <div class="header">
    <div class="tag">SCI 2026 · Workshops Program</div>
    <div class="big-title">WORKSHOPS 2026</div>
    <div class="divider"></div>
    <div class="subtitle-en">12 Workshops · 7 Days · Multiple Disciplines</div>
    <div class="subtitle-ar">١٢ ورشة عمل · ٧ أيام · تخصصات متعددة</div>
  </div>
  <div class="count-box">
    <div class="num">12</div>
    <div class="num-label">Workshops — April 6 to 12, 2026</div>
    <div class="num-ar">ورش عمل من ٦ إلى ١٢ أبريل ٢٠٢٦</div>
  </div>
  <div class="ws-grid">
    ${card(1, chitosan, null, 'Biotech Product Dev 101', 'تطوير المنتجات البيوتكنولوجية', 'Apr 6', '100 EGP')}
    ${card(2, agitech, null, 'NGS & ddPCR Therapy', 'التسلسل الجيني وddPCR', 'Apr 6', '200 EGP')}
    ${card(3, null, vaccineEmoji, 'The Vaccine Industry Race', 'سباق صناعة اللقاحات', 'Apr 6', '100 EGP')}
    ${card(4, nawah, null, 'NAWAH Scientific Workshop', 'ورشة عمل نواة للعلوم', 'Apr 7–8', '200 EGP')}
    ${card(5, marc, null, 'Good Clinical Practice', 'الممارسة السريرية الجيدة', 'Apr 8', '200 EGP')}
    ${card(6, medsol, null, 'Nanopore & Protein Seq.', 'تسلسل النانوبور والبروتين', 'Apr 7–8', '200 EGP')}
    ${card(7, null, geoEmoji, 'Geochemistry Workshop', 'ورشة عمل الجيوكيمياء', 'Apr 7–8', 'FREE 🆓', true)}
    ${card(8, colors, null, 'Metagenomics & Microbiome', 'الميتاجينوميكس والميكروبيوم', 'TBA', '200 EGP')}
    ${card(9, egcompbio, null, 'Single Cell Genomics', 'جينوميات الخلية الواحدة', 'Apr 9', '200 EGP')}
    ${card(10, aiArabi, null, 'AI بالعربي', 'الذكاء الاصطناعي بالعربي', 'Apr 9', '100 EGP')}
    ${card(11, gesr, null, 'From Lab to Global Opps.', 'من المختبر إلى الفرص العالمية', 'Apr 9', 'FREE 🆓', true)}
    ${card(12, hvd, null, 'Genomics & Proteomics', 'الجينوميات والبروتيوميات', 'Apr 12', '200 EGP')}
  </div>
  <div class="footer-logos">
    <div class="logo-wrap"><img src="${facultyLogo}" /></div>
    <div class="logo-wrap" style="width:72px;height:72px;"><img src="${sciLogo}" style="height:54px;width:54px;" /></div>
    <div class="logo-wrap"><img src="${cuLogo}" /></div>
  </div>
  <div class="bottom-cta">
    <div class="venue">Faculty of Science · Cairo University</div>
    <div class="register">Register: sciconf26.website</div>
  </div>
  <div class="bottom-bar"></div>
</div>
</body>
</html>`;

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
});
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1400, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2500));
const el = await page.$('.post');
await el.screenshot({ path: `${OUTPUT_DIR}/post1_campaign_launch.png`, type: 'png' });
console.log('Generated post1_campaign_launch.png');
await browser.close();
