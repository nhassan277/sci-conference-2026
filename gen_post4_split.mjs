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

const sciLogo = toBase64(`${LOGOS_DIR}/logo_sci2026.png`);
const facultyLogo = toBase64(`${LOGOS_DIR}/logo_faculty_science.jpeg`);
const cuLogo = toBase64(`${LOGOS_DIR}/logo_cu_new.png`);
const egcompbioLogo = toBase64(`${LOGOS_DIR}/egcompbio.png`);
const gesrLogo = toBase64(`${LOGOS_DIR}/gesr.jpg`);
const aiLogo = toBase64(`${LOGOS_DIR}/ai_arabi.jpeg`);
const hvdLogo = toBase64(`${LOGOS_DIR}/hvd.png`);

const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Noto+Sans+Arabic:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; background: transparent; font-family: 'Montserrat', sans-serif; }
  .post { width: 1080px; min-height: 1080px; background: #1a2a5e; position: relative; overflow: hidden; }
  .top-bar { width: 100%; height: 12px; background: linear-gradient(90deg, #c9a227, #f0d060, #c9a227); }
  .header { padding: 24px 48px 16px; text-align: center; }
  .header .tag { font-size: 20px; color: #f0d060; font-style: italic; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px; }
  .header .big-date { font-size: 72px; font-weight: 900; color: #ffffff; line-height: 1; letter-spacing: -2px; text-transform: uppercase; }
  .header .divider { width: 120px; height: 4px; background: linear-gradient(90deg, #c9a227, #f0d060); margin: 12px auto; border-radius: 2px; }
  .header .subtitle-en { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
  .header .subtitle-ar { font-size: 24px; font-weight: 700; color: #f0d060; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; }
  .footer-logos { display: flex; align-items: center; justify-content: center; gap: 28px; padding: 12px 48px 6px; }
  .logo-wrap { background: #ffffff; border-radius: 50%; width: 76px; height: 76px; display: flex; align-items: center; justify-content: center; padding: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .logo-wrap img { height: 56px; width: 56px; object-fit: contain; }
  .bottom-cta { text-align: center; padding: 6px 48px 16px; }
  .bottom-cta .venue { font-size: 20px; color: #d0d8f0; font-weight: 600; margin-bottom: 6px; }
  .bottom-cta .register { font-size: 30px; font-weight: 800; color: #f0d060; letter-spacing: 0.5px; }
  .bottom-bar { width: 100%; height: 12px; background: linear-gradient(90deg, #c9a227, #f0d060, #c9a227); }

  /* 3-column grid for April 9 */
  .ws-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 8px 40px; }

  /* Single centered card for April 12 */
  .ws-single { display: flex; justify-content: center; padding: 8px 120px; }
  .ws-single .ws-info-card { width: 100%; max-width: 600px; }

  .ws-info-card { background: #ffffff; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 6px 20px rgba(0,0,0,0.35); }
  .ws-info-card .card-header { background: #1a2a5e; padding: 10px 8px 8px; text-align: center; border-bottom: 3px solid #c9a227; }
  .ws-info-card .card-header .ws-num { font-size: 15px; font-weight: 800; color: #c9a227; letter-spacing: 1px; }
  .ws-info-card .card-logo { background: #f8f8ff; height: 100px; display: flex; align-items: center; justify-content: center; padding: 8px; border-bottom: 1px solid #e8e8f0; }
  .ws-info-card .card-logo img { max-height: 80px; max-width: 180px; object-fit: contain; }
  .ws-info-card .card-logo .logo-emoji { font-size: 56px; line-height: 1; }
  .ws-info-card .card-body { padding: 10px 12px 8px; flex: 1; display: flex; flex-direction: column; gap: 5px; }
  .ws-info-card .card-title-en { font-size: 17px; font-weight: 800; color: #1a2a5e; line-height: 1.3; text-align: center; }
  .ws-info-card .card-title-ar { font-size: 14px; font-weight: 700; color: #444466; line-height: 1.3; text-align: center; direction: rtl; font-family: 'Noto Sans Arabic', sans-serif; }
  .ws-info-card .card-footer { background: #c9a227; padding: 7px 10px; display: flex; justify-content: space-between; align-items: center; }
  .ws-info-card .card-footer .cf-date { font-size: 13px; font-weight: 700; color: #1a2a5e; }
  .ws-info-card .card-footer .cf-fee { font-size: 14px; font-weight: 900; color: #1a2a5e; }
  .free-fee { color: #006600 !important; }

  /* Large single card */
  .ws-single .ws-info-card .card-logo { height: 160px; }
  .ws-single .ws-info-card .card-logo img { max-height: 130px; max-width: 320px; }
  .ws-single .ws-info-card .card-header .ws-num { font-size: 20px; }
  .ws-single .ws-info-card .card-title-en { font-size: 26px; }
  .ws-single .ws-info-card .card-title-ar { font-size: 20px; }
  .ws-single .ws-info-card .card-footer .cf-date { font-size: 18px; }
  .ws-single .ws-info-card .card-footer .cf-fee { font-size: 20px; }
  .ws-single .ws-info-card .card-body { padding: 16px 20px 12px; gap: 8px; }
  .ws-single .ws-info-card .card-footer { padding: 10px 16px; }

  /* Highlight box for HVD post */
  .highlight-box { background: rgba(201,162,39,0.15); border: 2px solid #c9a227; border-radius: 12px; margin: 0 60px 16px; padding: 14px 24px; text-align: center; }
  .highlight-box .hl-text { font-size: 20px; font-weight: 700; color: #ffffff; margin-bottom: 4px; }
  .highlight-box .hl-ar { font-size: 18px; color: #f0d060; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; }
`;

function logosHtml(sciLogo, facultyLogo, cuLogo) {
  return `
    <div class="footer-logos">
      <div class="logo-wrap"><img src="${facultyLogo}" /></div>
      <div class="logo-wrap" style="width:84px;height:84px;"><img src="${sciLogo}" style="height:64px;width:64px;" /></div>
      <div class="logo-wrap"><img src="${cuLogo}" /></div>
    </div>
  `;
}

// ===== POST 4a: April 9 — EgCompBio + AI بالعربي + GESR =====
const post4a_html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${BASE_CSS}</style></head>
<body>
<div class="post">
  <div class="top-bar"></div>
  <div class="header">
    <div class="tag">SCI 2026 · Post-Conference Workshops</div>
    <div class="big-date">APRIL 9, 2026</div>
    <div class="divider"></div>
    <div class="subtitle-en">3 Workshops — Day After the Conference</div>
    <div class="subtitle-ar">٣ ورش عمل بعد المؤتمر</div>
  </div>
  <div class="ws-grid-3">
    <!-- WS 08: EgCompBio -->
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS 08</div></div>
      <div class="card-logo"><img src="${egcompbioLogo}" /></div>
      <div class="card-body">
        <div class="card-title-en">Intro to Single Cell Genomics</div>
        <div class="card-title-ar">مقدمة في جينوميات الخلية الواحدة</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">April 9, 2026</span>
        <span class="cf-fee">200 EGP</span>
      </div>
    </div>
    <!-- WS 09: AI بالعربي -->
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS 09</div></div>
      <div class="card-logo"><img src="${aiLogo}" /></div>
      <div class="card-body">
        <div class="card-title-en">AI Meets Biotech</div>
        <div class="card-title-ar">الذكاء الاصطناعي يلتقي البيوتك</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">April 9, 2026</span>
        <span class="cf-fee">100 EGP</span>
      </div>
    </div>
    <!-- WS 10: GESR (FREE) -->
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS 10</div></div>
      <div class="card-logo"><img src="${gesrLogo}" /></div>
      <div class="card-body">
        <div class="card-title-en">From Lab to Global Opportunities</div>
        <div class="card-title-ar">من المختبر إلى الفرص العالمية</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">April 9, 2026</span>
        <span class="cf-fee free-fee">FREE 🆓</span>
      </div>
    </div>
  </div>
  ${logosHtml(sciLogo, facultyLogo, cuLogo)}
  <div class="bottom-cta">
    <div class="venue">Faculty of Science · Cairo University</div>
    <div class="register">Register: sciconf26.website</div>
  </div>
  <div class="bottom-bar"></div>
</div>
</body>
</html>`;

// ===== POST 4b: April 12 — HVD Life Sciences =====
const post4b_html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${BASE_CSS}</style></head>
<body>
<div class="post">
  <div class="top-bar"></div>
  <div class="header">
    <div class="tag">SCI 2026 · Post-Conference Workshop</div>
    <div class="big-date">APRIL 12, 2026</div>
    <div class="divider"></div>
    <div class="subtitle-en">Full-Day Workshop — New Cairo</div>
    <div class="subtitle-ar">ورشة عمل يوم كامل — القاهرة الجديدة</div>
  </div>
  <div class="highlight-box">
    <div class="hl-text">🧬 Genomics &amp; Proteomics — ~5 Hours · HVD Life Sciences Facility</div>
    <div class="hl-ar">جينوميات وبروتيوميات · ٥ ساعات · مقر HVD للعلوم الحياتية</div>
  </div>
  <div class="ws-single">
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS 11</div></div>
      <div class="card-logo"><img src="${hvdLogo}" /></div>
      <div class="card-body">
        <div class="card-title-en">Genomics &amp; Proteomics</div>
        <div class="card-title-ar">الجينوميات والبروتيوميات</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">Sunday, April 12, 2026 · New Cairo</span>
        <span class="cf-fee">200 EGP</span>
      </div>
    </div>
  </div>
  ${logosHtml(sciLogo, facultyLogo, cuLogo)}
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

// Generate Post 4a
const page1 = await browser.newPage();
await page1.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
await page1.setContent(post4a_html, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2500));
const el1 = await page1.$('.post');
await el1.screenshot({ path: `${OUTPUT_DIR}/post4a_april9.png`, type: 'png' });
console.log('Generated post4a_april9.png');
await page1.close();

// Generate Post 4b
const page2 = await browser.newPage();
await page2.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
await page2.setContent(post4b_html, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2500));
const el2 = await page2.$('.post');
await el2.screenshot({ path: `${OUTPUT_DIR}/post4b_april12_hvd.png`, type: 'png' });
console.log('Generated post4b_april12_hvd.png');
await page2.close();

await browser.close();
console.log('Done!');
