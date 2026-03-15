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
const nawahLogo = toBase64(`${LOGOS_DIR}/nawah.png`);
const marcLogo = toBase64(`${LOGOS_DIR}/marc.jpg`);
const medsolLogo = toBase64(`${LOGOS_DIR}/medsol.png`);

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Noto+Sans+Arabic:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; background: transparent; font-family: 'Montserrat', sans-serif; }
  .post { width: 1080px; min-height: 1080px; background: #1a2a5e; position: relative; overflow: hidden; }
  .top-bar { width: 100%; height: 12px; background: linear-gradient(90deg, #c9a227, #f0d060, #c9a227); }
  .header { padding: 24px 48px 16px; text-align: center; }
  .header .tag { font-size: 20px; color: #f0d060; font-style: italic; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px; }
  .header .big-date { font-size: 68px; font-weight: 900; color: #ffffff; line-height: 1; letter-spacing: -2px; text-transform: uppercase; }
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
  .ws-grid-2x2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 8px 60px; }
  .ws-info-card { background: #ffffff; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 6px 20px rgba(0,0,0,0.35); }
  .ws-info-card .card-header { background: #1a2a5e; padding: 10px 8px 8px; text-align: center; border-bottom: 3px solid #c9a227; }
  .ws-info-card .card-header .ws-num { font-size: 17px; font-weight: 800; color: #c9a227; letter-spacing: 1px; }
  .ws-info-card .card-logo { background: #f8f8ff; height: 110px; display: flex; align-items: center; justify-content: center; padding: 8px; border-bottom: 1px solid #e8e8f0; }
  .ws-info-card .card-logo img { max-height: 88px; max-width: 200px; object-fit: contain; }
  .ws-info-card .card-logo .logo-emoji { font-size: 64px; line-height: 1; }
  .ws-info-card .card-body { padding: 10px 14px 8px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .ws-info-card .card-title-en { font-size: 20px; font-weight: 800; color: #1a2a5e; line-height: 1.3; text-align: center; }
  .ws-info-card .card-title-ar { font-size: 16px; font-weight: 700; color: #444466; line-height: 1.3; text-align: center; direction: rtl; font-family: 'Noto Sans Arabic', sans-serif; }
  .ws-info-card .card-footer { background: #c9a227; padding: 6px 8px; display: flex; justify-content: space-between; align-items: center; }
  .ws-info-card .card-footer .cf-date { font-size: 14px; font-weight: 700; color: #1a2a5e; }
  .ws-info-card .card-footer .cf-fee { font-size: 16px; font-weight: 900; color: #1a2a5e; }
  .free-fee { color: #006600 !important; }
`;

const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>${CSS}</style></head>
<body>
<div class="post">
  <div class="top-bar"></div>
  <div class="header">
    <div class="tag">SCI 2026 · Conference Workshops</div>
    <div class="big-date">APRIL 7–8, 2026</div>
    <div class="divider"></div>
    <div class="subtitle-en">4 Workshops — During the Conference</div>
    <div class="subtitle-ar">٤ ورش عمل خلال المؤتمر</div>
  </div>
  <div class="ws-grid-2x2">
    <!-- WS 04: NAWAH -->
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS 04</div></div>
      <div class="card-logo"><img src="${nawahLogo}" /></div>
      <div class="card-body">
        <div class="card-title-en">NAWAH Scientific Workshop</div>
        <div class="card-title-ar">ورشة عمل نواة للعلوم</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">April 7–8, 2026</span>
        <span class="cf-fee">200 EGP</span>
      </div>
    </div>
    <!-- WS 05: MARC -->
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS 05</div></div>
      <div class="card-logo"><img src="${marcLogo}" /></div>
      <div class="card-body">
        <div class="card-title-en">Good Clinical Practice (GCP)</div>
        <div class="card-title-ar">الممارسة السريرية الجيدة</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">April 8, 2026</span>
        <span class="cf-fee">200 EGP</span>
      </div>
    </div>
    <!-- WS 06: Medsol -->
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS 06</div></div>
      <div class="card-logo"><img src="${medsolLogo}" /></div>
      <div class="card-body">
        <div class="card-title-en">Nanopore &amp; Protein Sequencing</div>
        <div class="card-title-ar">تسلسل النانوبور والبروتين</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">April 7–8, 2026</span>
        <span class="cf-fee">200 EGP</span>
      </div>
    </div>
    <!-- WS 07: Geochemistry (FREE, 2 days) -->
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS 07</div></div>
      <div class="card-logo"><span class="logo-emoji">🌍</span></div>
      <div class="card-body">
        <div class="card-title-en">Geochemistry Workshop</div>
        <div class="card-title-ar">ورشة عمل الجيوكيمياء</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">April 7–8, 2026 · 2 Days</span>
        <span class="cf-fee free-fee">FREE 🆓</span>
      </div>
    </div>
  </div>
  <div class="footer-logos">
    <div class="logo-wrap"><img src="${facultyLogo}" /></div>
    <div class="logo-wrap" style="width:84px;height:84px;"><img src="${sciLogo}" style="height:64px;width:64px;" /></div>
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
await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2500));
const el = await page.$('.post');
await el.screenshot({ path: `${OUTPUT_DIR}/post3_during_conference.png`, type: 'png' });
console.log('Generated post3_during_conference.png');
await browser.close();
