import puppeteer from 'puppeteer';
import { readFileSync, mkdirSync } from 'fs';
import path from 'path';

const LOGOS_DIR = '/home/ubuntu/workshop_logos';
const OUTPUT_DIR = '/home/ubuntu/social_posts_v4';

mkdirSync(OUTPUT_DIR, { recursive: true });

function toBase64(filePath) {
  try {
    const data = readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png';
    return `data:${mime};base64,${data.toString('base64')}`;
  } catch (e) {
    return '';
  }
}

// Correct logos
const sciLogo = toBase64(`${LOGOS_DIR}/logo_sci2026.png`);
const facultyLogo = toBase64(`${LOGOS_DIR}/logo_faculty_science.jpeg`);
const cuLogo = toBase64(`${LOGOS_DIR}/logo_cu_new.png`);

// Workshop sponsor logos
const logos = {
  chitosan:   toBase64(`${LOGOS_DIR}/chitosan.png`),
  agitech:    toBase64(`${LOGOS_DIR}/agitech.png`),
  nawah:      toBase64(`${LOGOS_DIR}/nawah.png`),
  marc:       toBase64(`${LOGOS_DIR}/marc.jpg`),
  medsol:     toBase64(`${LOGOS_DIR}/medsol.png`),
  colors:     toBase64(`${LOGOS_DIR}/colors.png`),
  egcompbio:  toBase64(`${LOGOS_DIR}/egcompbio.png`),
  gesr:       toBase64(`${LOGOS_DIR}/gesr.jpg`),
  hvd:        toBase64(`${LOGOS_DIR}/hvd.png`),
};

const COMMON_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Amiri:wght@400;700&family=Noto+Sans+Arabic:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; background: transparent; font-family: 'Montserrat', sans-serif; }
  .post { width: 1080px; min-height: 1080px; background: #1a2a5e; position: relative; overflow: hidden; }
  
  /* Gold top bar */
  .top-bar { width: 100%; height: 12px; background: linear-gradient(90deg, #c9a227, #f0d060, #c9a227); }
  
  /* Header area */
  .header { padding: 24px 48px 16px; text-align: center; }
  .header .tag { font-size: 20px; color: #f0d060; font-style: italic; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px; }
  .header .big-date { font-size: 72px; font-weight: 900; color: #ffffff; line-height: 1; letter-spacing: -2px; text-transform: uppercase; }
  .header .divider { width: 120px; height: 4px; background: linear-gradient(90deg, #c9a227, #f0d060); margin: 12px auto; border-radius: 2px; }
  .header .subtitle-en { font-size: 24px; font-weight: 700; color: #ffffff; margin-bottom: 6px; }
  .header .subtitle-ar { font-size: 24px; font-weight: 700; color: #f0d060; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; }
  
  /* Footer logos */
  .footer-logos { display: flex; align-items: center; justify-content: center; gap: 28px; padding: 12px 48px 6px; }
  .logo-wrap { background: #ffffff; border-radius: 50%; width: 76px; height: 76px; display: flex; align-items: center; justify-content: center; padding: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .logo-wrap img { height: 56px; width: 56px; object-fit: contain; }
  
  /* Bottom CTA */
  .bottom-cta { text-align: center; padding: 6px 48px 16px; }
  .bottom-cta .venue { font-size: 20px; color: #d0d8f0; font-weight: 600; margin-bottom: 6px; }
  .bottom-cta .register { font-size: 30px; font-weight: 800; color: #f0d060; letter-spacing: 0.5px; }
  
  /* Gold bottom bar */
  .bottom-bar { width: 100%; height: 12px; background: linear-gradient(90deg, #c9a227, #f0d060, #c9a227); }
  
  /* Highlight box */
  .highlight-box { background: rgba(201,162,39,0.15); border: 2px solid #c9a227; border-radius: 12px; margin: 0 40px 14px; padding: 12px 24px; text-align: center; }
  .highlight-box .hl-num { font-size: 56px; font-weight: 900; color: #f0d060; line-height: 1; }
  .highlight-box .hl-text { font-size: 20px; font-weight: 700; color: #ffffff; }
  .highlight-box .hl-ar { font-size: 18px; color: #f0d060; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; }
  
  /* Urgency warning */
  .urgency-warning { background: linear-gradient(135deg, #c9a227, #f0d060); margin: 0 40px 12px; border-radius: 10px; padding: 12px 24px; text-align: center; }
  .urgency-warning .uw-text { font-size: 22px; font-weight: 900; color: #1a2a5e; }
  .urgency-warning .uw-ar { font-size: 18px; font-weight: 700; color: #1a2a5e; font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; }

  /* ===== NEW: Workshop info cards (readable, no tiny poster images) ===== */
  .ws-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 8px 28px; }
  .ws-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 8px 40px; }
  .ws-grid-2x2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 8px 60px; }

  .ws-info-card {
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  }
  
  /* Card top: colored header with WS number */
  .ws-info-card .card-header {
    background: #1a2a5e;
    padding: 10px 8px 8px;
    text-align: center;
    border-bottom: 3px solid #c9a227;
  }
  .ws-info-card .card-header .ws-num {
    font-size: 13px;
    font-weight: 800;
    color: #c9a227;
    letter-spacing: 1px;
  }
  
  /* Card logo area */
  .ws-info-card .card-logo {
    background: #f8f8ff;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-bottom: 1px solid #e8e8f0;
  }
  .ws-info-card .card-logo img {
    max-height: 56px;
    max-width: 120px;
    object-fit: contain;
  }
  .ws-info-card .card-logo .logo-emoji {
    font-size: 40px;
    line-height: 1;
  }
  
  /* Card body */
  .ws-info-card .card-body {
    padding: 8px 10px 6px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ws-info-card .card-title-en {
    font-size: 14px;
    font-weight: 800;
    color: #1a2a5e;
    line-height: 1.3;
    text-align: center;
  }
  .ws-info-card .card-title-ar {
    font-size: 12px;
    font-weight: 700;
    color: #444466;
    line-height: 1.3;
    text-align: center;
    direction: rtl;
    font-family: 'Noto Sans Arabic', sans-serif;
  }
  
  /* Card footer: date + fee */
  .ws-info-card .card-footer {
    background: #c9a227;
    padding: 6px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ws-info-card .card-footer .cf-date {
    font-size: 11px;
    font-weight: 700;
    color: #1a2a5e;
  }
  .ws-info-card .card-footer .cf-fee {
    font-size: 12px;
    font-weight: 900;
    color: #1a2a5e;
  }
  
  /* Large card variant for 3-col layout */
  .ws-grid-3 .ws-info-card .card-logo { height: 90px; }
  .ws-grid-3 .ws-info-card .card-logo img { max-height: 70px; max-width: 160px; }
  .ws-grid-3 .ws-info-card .card-logo .logo-emoji { font-size: 52px; }
  .ws-grid-3 .ws-info-card .card-header .ws-num { font-size: 15px; }
  .ws-grid-3 .ws-info-card .card-title-en { font-size: 17px; }
  .ws-grid-3 .ws-info-card .card-title-ar { font-size: 14px; }
  .ws-grid-3 .ws-info-card .card-footer .cf-date { font-size: 13px; }
  .ws-grid-3 .ws-info-card .card-footer .cf-fee { font-size: 14px; }
  
  /* Extra large card for 2-col layout */
  .ws-grid-2x2 .ws-info-card .card-logo { height: 110px; }
  .ws-grid-2x2 .ws-info-card .card-logo img { max-height: 88px; max-width: 200px; }
  .ws-grid-2x2 .ws-info-card .card-logo .logo-emoji { font-size: 64px; }
  .ws-grid-2x2 .ws-info-card .card-header .ws-num { font-size: 17px; }
  .ws-grid-2x2 .ws-info-card .card-title-en { font-size: 20px; }
  .ws-grid-2x2 .ws-info-card .card-title-ar { font-size: 16px; }
  .ws-grid-2x2 .ws-info-card .card-footer .cf-date { font-size: 15px; }
  .ws-grid-2x2 .ws-info-card .card-footer .cf-fee { font-size: 16px; }
  .ws-grid-2x2 .ws-info-card .card-body { padding: 10px 14px 8px; gap: 6px; }
`;

function logosHtml() {
  return `
    <div class="footer-logos">
      <div class="logo-wrap"><img src="${facultyLogo}" alt="Faculty of Science" /></div>
      <div class="logo-wrap" style="width:84px;height:84px;"><img src="${sciLogo}" alt="SCI 2026" style="height:64px;width:64px;" /></div>
      <div class="logo-wrap"><img src="${cuLogo}" alt="Cairo University" /></div>
    </div>
  `;
}

// Helper to build a ws-info-card
function wsCard(num, logoKey, logoEmoji, titleEn, titleAr, date, fee, freeTag = false) {
  const logoSrc = logoKey && logos[logoKey] ? logos[logoKey] : null;
  const logoHtml = logoSrc
    ? `<img src="${logoSrc}" />`
    : `<span class="logo-emoji">${logoEmoji || '🔬'}</span>`;
  const feeColor = freeTag ? 'color:#006600;' : '';
  return `
    <div class="ws-info-card">
      <div class="card-header"><div class="ws-num">WS ${String(num).padStart(2,'0')}</div></div>
      <div class="card-logo">${logoHtml}</div>
      <div class="card-body">
        <div class="card-title-en">${titleEn}</div>
        <div class="card-title-ar">${titleAr}</div>
      </div>
      <div class="card-footer">
        <span class="cf-date">${date}</span>
        <span class="cf-fee" style="${feeColor}">${fee}</span>
      </div>
    </div>
  `;
}

const posts = [
  // POST 1: Campaign Launch — all 8 workshops in 4×2 grid
  {
    filename: 'post1_campaign_launch.png',
    html: `
      <div class="post">
        <div class="top-bar"></div>
        <div class="header">
          <div class="tag">SCI 2026 · Workshops Program</div>
          <div class="big-date" style="font-size:68px;">WORKSHOPS 2026</div>
          <div class="divider"></div>
          <div class="subtitle-en">11 Workshops · 6 Days · Multiple Disciplines</div>
          <div class="subtitle-ar">١١ ورشة عمل · ٦ أيام · تخصصات متعددة</div>
        </div>
        <div class="highlight-box">
          <div class="hl-num">11</div>
          <div class="hl-text">Workshops — April 6 to 12, 2026</div>
          <div class="hl-ar">ورش عمل من ٦ إلى ١٢ أبريل ٢٠٢٦</div>
        </div>
        <div class="ws-grid-4">
          ${wsCard(1,'chitosan',null,'Biotech Product Dev 101','تطوير المنتجات البيوتكنولوجية','Apr 6','100 EGP')}
          ${wsCard(2,'agitech',null,'NGS & ddPCR Therapy','التسلسل الجيني وddPCR','Apr 6','200 EGP')}
          ${wsCard(3,null,'💉','The Vaccine Industry Race','سباق صناعة اللقاحات','Apr 6','100 EGP')}
          ${wsCard(4,'nawah',null,'NAWAH Scientific Workshop','ورشة عمل نواة للعلوم','Apr 7–8','200 EGP')}
          ${wsCard(5,'marc',null,'Good Clinical Practice','الممارسة السريرية الجيدة','Apr 8','200 EGP')}
          ${wsCard(6,'medsol',null,'Nanopore & Protein Seq.','تسلسل النانوبور والبروتين','Apr 7–8','200 EGP')}
          ${wsCard(7,'colors',null,'Metagenomics & Microbiome','الميتاجينوميكس والميكروبيوم','TBA','200 EGP')}
          ${wsCard(8,'egcompbio',null,'Single Cell Genomics','جينوميات الخلية الواحدة','Apr 9','200 EGP')}
        </div>
        ${logosHtml()}
        <div class="bottom-cta">
          <div class="venue">Faculty of Science · Cairo University</div>
          <div class="register">Register: sciconf26.website</div>
        </div>
        <div class="bottom-bar"></div>
      </div>
    `
  },
  // POST 2: Pre-Conference (April 6) — 3 workshops
  {
    filename: 'post2_pre_conference.png',
    html: `
      <div class="post">
        <div class="top-bar"></div>
        <div class="header">
          <div class="tag">SCI 2026 · Pre-Conference Workshops</div>
          <div class="big-date">APRIL 6, 2026</div>
          <div class="divider"></div>
          <div class="subtitle-en">3 Workshops — One Day Before the Conference</div>
          <div class="subtitle-ar">٣ ورش عمل قبل المؤتمر</div>
        </div>
        <div class="ws-grid-3">
          ${wsCard(1,'chitosan',null,'Biotech Product Development 101','تطوير المنتجات البيوتكنولوجية ١٠١','April 6, 2026','100 EGP')}
          ${wsCard(2,'agitech',null,'NGS & ddPCR in Targeted Therapy','التسلسل الجيني وتقنية ddPCR في العلاج الموجه','April 6, 2026','200 EGP')}
          ${wsCard(3,null,'💉','The Vaccine Industry Race','سباق صناعة اللقاحات','April 6, 2026','100 EGP')}
        </div>
        ${logosHtml()}
        <div class="bottom-cta">
          <div class="venue">Faculty of Science · Cairo University</div>
          <div class="register">Register: sciconf26.website</div>
        </div>
        <div class="bottom-bar"></div>
      </div>
    `
  },
  // POST 3: During Conference (April 7-8) — 4 workshops in 2×2
  {
    filename: 'post3_during_conference.png',
    html: `
      <div class="post">
        <div class="top-bar"></div>
        <div class="header">
          <div class="tag">SCI 2026 · Conference Workshops</div>
          <div class="big-date" style="font-size:68px;">APRIL 7–8, 2026</div>
          <div class="divider"></div>
          <div class="subtitle-en">4 Workshops — During the Conference</div>
          <div class="subtitle-ar">٤ ورش عمل خلال المؤتمر</div>
        </div>
        <div class="ws-grid-2x2">
          ${wsCard(4,'nawah',null,'NAWAH Scientific Workshop','ورشة عمل نواة للعلوم','April 7–8, 2026','200 EGP')}
          ${wsCard(5,'marc',null,'Good Clinical Practice (GCP)','الممارسة السريرية الجيدة','April 8, 2026','200 EGP')}
          ${wsCard(6,'medsol',null,'Nanopore & Protein Sequencing','تسلسل النانوبور والبروتين','April 7–8, 2026','200 EGP')}
          ${wsCard(7,'colors',null,'Metagenomics & Microbiome Analysis','الميتاجينوميكس وتحليل الميكروبيوم','TBA · Maadi','200 EGP')}
        </div>
        ${logosHtml()}
        <div class="bottom-cta">
          <div class="venue">Faculty of Science · Cairo University</div>
          <div class="register">Register: sciconf26.website</div>
        </div>
        <div class="bottom-bar"></div>
      </div>
    `
  },
  // POST 4: Post-Conference (April 9-12) — 4 workshops in 2×2
  {
    filename: 'post4_post_conference.png',
    html: `
      <div class="post">
        <div class="top-bar"></div>
        <div class="header">
          <div class="tag">SCI 2026 · Post-Conference Workshops</div>
          <div class="big-date" style="font-size:68px;">APRIL 9–12, 2026</div>
          <div class="divider"></div>
          <div class="subtitle-en">4 Workshops — After the Conference</div>
          <div class="subtitle-ar">٤ ورش عمل بعد المؤتمر</div>
        </div>
        <div class="ws-grid-2x2">
          ${wsCard(8,'egcompbio',null,'Intro to Single Cell Genomics','مقدمة في جينوميات الخلية الواحدة','April 9, 2026','200 EGP')}
          ${wsCard(9,'gesr',null,'From Lab to Global Opportunities','من المختبر إلى الفرص العالمية','April 9, 2026','FREE 🆓',true)}
          ${wsCard(10,null,'🌍','Geochemistry Workshop','ورشة عمل الجيوكيمياء','April 8, 2026','200 EGP')}
          ${wsCard(11,'hvd',null,'Genomics & Proteomics','الجينوميات والبروتيوميات','April 12, 2026','200 EGP')}
        </div>
        ${logosHtml()}
        <div class="bottom-cta">
          <div class="venue">Faculty of Science · Cairo University</div>
          <div class="register">Register: sciconf26.website</div>
        </div>
        <div class="bottom-bar"></div>
      </div>
    `
  },
  // POST 5: Urgency CTA — all 11 workshops in 4×3 grid
  {
    filename: 'post5_urgency_cta.png',
    html: `
      <div class="post">
        <div class="top-bar"></div>
        <div class="header" style="padding-bottom: 10px;">
          <div class="tag">SCI 2026 · Workshops Program</div>
          <div class="big-date" style="font-size:64px; color:#f0d060;">SEATS FILLING UP!</div>
          <div class="divider"></div>
          <div class="subtitle-en">Register Now — Limited Spots Available</div>
          <div class="subtitle-ar">سجّل الآن — المقاعد محدودة</div>
        </div>
        <div class="urgency-warning">
          <div class="uw-text">⚡ Priority: First 30 Paid Registrants Per Workshop</div>
          <div class="uw-ar">الأولوية لأول ٣٠ مشاركاً يدفعون في كل ورشة</div>
        </div>
        <div class="ws-grid-4" style="padding: 6px 24px;">
          ${wsCard(1,'chitosan',null,'Biotech Product Dev 101','تطوير المنتجات البيوتكنولوجية','Apr 6','100 EGP')}
          ${wsCard(2,'agitech',null,'NGS & ddPCR Therapy','التسلسل الجيني وddPCR','Apr 6','200 EGP')}
          ${wsCard(3,null,'💉','Vaccine Industry Race','سباق صناعة اللقاحات','Apr 6','100 EGP')}
          ${wsCard(4,'nawah',null,'NAWAH Scientific','ورشة نواة للعلوم','Apr 7–8','200 EGP')}
          ${wsCard(5,'marc',null,'Good Clinical Practice','الممارسة السريرية','Apr 8','200 EGP')}
          ${wsCard(6,'medsol',null,'Nanopore & Protein Seq.','تسلسل النانوبور','Apr 7–8','200 EGP')}
          ${wsCard(7,'colors',null,'Metagenomics','الميتاجينوميكس','TBA','200 EGP')}
          ${wsCard(8,'egcompbio',null,'Single Cell Genomics','جينوميات الخلية','Apr 9','200 EGP')}
          ${wsCard(9,'gesr',null,'Lab to Global Opps.','الفرص العالمية','Apr 9','FREE 🆓',true)}
          ${wsCard(10,null,'🌍','Geochemistry','الجيوكيمياء','Apr 8','200 EGP')}
          ${wsCard(11,'hvd',null,'Genomics & Proteomics','الجينوميات','Apr 12','200 EGP')}
        </div>
        ${logosHtml()}
        <div class="bottom-cta">
          <div class="venue">Faculty of Science · Cairo University</div>
          <div class="register" style="font-size:32px;">🔗 sciconf26.website</div>
        </div>
        <div class="bottom-bar"></div>
      </div>
    `
  }
];

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--allow-file-access-from-files']
});

for (const post of posts) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>${COMMON_CSS}</style>
</head>
<body>
${post.html}
</body>
</html>`;

  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));
  
  const element = await page.$('.post');
  await element.screenshot({ path: `${OUTPUT_DIR}/${post.filename}`, type: 'png' });
  console.log(`Generated: ${post.filename}`);
  await page.close();
}

await browser.close();
console.log('All 5 posts generated successfully!');
