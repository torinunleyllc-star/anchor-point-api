const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve the bank statement audit tool
app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bank Statement Audit — Anchor Point Institute</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
:root {
  --gold: #C9A84C; --gold-dark: #A07830; --black: #0A0A0A;
  --dark2: #1A1A1A; --dark3: #222222; --white: #FFFFFF;
  --gray: #888888; --gray-light: #CCCCCC;
  --success: #4CAF82; --warning: #E8A84C; --danger: #E85C4C;
}
* { margin:0; padding:0; box-sizing:border-box; }
body { background:var(--black); color:var(--white); font-family:'DM Sans',sans-serif; min-height:100vh; }
header { padding:24px 40px; border-bottom:1px solid rgba(201,168,76,0.2); display:flex; align-items:center; gap:16px; background:rgba(10,10,10,0.95); }
.logo-mark { width:44px; height:44px; border:2px solid var(--gold); border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:'Playfair Display',serif; font-size:18px; color:var(--gold); font-weight:700; }
.brand-name { font-family:'Playfair Display',serif; font-size:16px; color:var(--gold); font-weight:600; }
.brand-sub { font-size:11px; color:var(--gray); letter-spacing:2px; text-transform:uppercase; }
.container { max-width:900px; margin:0 auto; padding:60px 24px; }
.hero { text-align:center; margin-bottom:48px; }
.hero-badge { display:inline-block; background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.3); color:var(--gold); font-size:11px; letter-spacing:3px; text-transform:uppercase; padding:8px 20px; border-radius:100px; margin-bottom:24px; }
h1 { font-family:'Playfair Display',serif; font-size:clamp(32px,5vw,52px); font-weight:700; line-height:1.1; margin-bottom:20px; }
h1 span { color:var(--gold); }
.hero-sub { font-size:17px; color:var(--gray); max-width:560px; margin:0 auto; line-height:1.7; }

/* UPLOAD */
.upload-zone { border:2px dashed rgba(201,168,76,0.3); border-radius:16px; padding:60px 40px; text-align:center; cursor:pointer; transition:all 0.3s; background:rgba(201,168,76,0.02); margin-bottom:20px; }
.upload-zone:hover { border-color:var(--gold); background:rgba(201,168,76,0.06); }
.upload-icon { font-size:48px; margin-bottom:16px; }
.upload-title { font-family:'Playfair Display',serif; font-size:22px; margin-bottom:10px; }
.upload-sub { font-size:14px; color:var(--gray); margin-bottom:20px; }
.upload-btn-label { display:inline-block; background:linear-gradient(135deg,var(--gold),var(--gold-dark)); color:var(--black); font-size:13px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:12px 28px; border-radius:8px; cursor:pointer; transition:all 0.3s; }
.upload-btn-label:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(201,168,76,0.3); }

.file-selected { display:none; align-items:center; gap:12px; background:rgba(201,168,76,0.1); border:1px solid rgba(201,168,76,0.3); border-radius:10px; padding:16px 20px; margin-bottom:16px; }
.file-selected.show { display:flex; }
.file-name { font-weight:600; font-size:14px; color:var(--gold); }
.file-size { font-size:12px; color:var(--gray); }

.analyze-btn { width:100%; background:linear-gradient(135deg,var(--gold),var(--gold-dark)); color:var(--black); border:none; padding:18px; border-radius:12px; font-size:15px; font-weight:700; letter-spacing:1px; text-transform:uppercase; cursor:pointer; transition:all 0.3s; font-family:'DM Sans',sans-serif; display:none; margin-bottom:12px; }
.analyze-btn.show { display:block; }
.analyze-btn:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(201,168,76,0.3); }
.analyze-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

.error-box { display:none; background:rgba(232,92,76,0.1); border:1px solid rgba(232,92,76,0.3); border-radius:12px; padding:20px; text-align:center; font-size:14px; color:var(--danger); margin-top:12px; }
.error-box.show { display:block; }

/* LOADING */
.loading { display:none; text-align:center; padding:60px 20px; }
.loading.show { display:block; }
.loading-spinner { width:60px; height:60px; border:3px solid rgba(201,168,76,0.2); border-top-color:var(--gold); border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 24px; }
@keyframes spin { to { transform:rotate(360deg); } }
.loading-text { font-family:'Playfair Display',serif; font-size:22px; margin-bottom:10px; }
.loading-sub { font-size:14px; color:var(--gray); }

/* RESULTS */
.results { display:none; }
.results.show { display:block; }
.score-hero { background:linear-gradient(135deg,var(--dark2),var(--dark3)); border:1px solid rgba(201,168,76,0.2); border-radius:20px; padding:48px; text-align:center; margin-bottom:24px; }
.score-label { font-size:11px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:16px; }
.score-number { font-family:'Playfair Display',serif; font-size:96px; font-weight:700; line-height:1; margin-bottom:8px; }
.score-tier { font-size:20px; font-weight:600; margin-bottom:16px; }
.score-desc { font-size:15px; color:var(--gray); max-width:500px; margin:0 auto; line-height:1.7; }
.c-green { color:var(--success); } .c-orange { color:var(--warning); } .c-red { color:var(--danger); } .c-gold { color:var(--gold); }

.dimensions-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; margin-bottom:24px; }
.dimension-card { background:var(--dark2); border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:24px; }
.dim-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.dim-name { font-size:13px; font-weight:600; color:var(--gray-light); }
.dim-score { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; }
.dim-bar { height:4px; background:rgba(255,255,255,0.08); border-radius:100px; overflow:hidden; margin-bottom:12px; }
.dim-fill { height:100%; border-radius:100px; }
.dim-note { font-size:12px; color:var(--gray); line-height:1.6; }

.section-card { background:var(--dark2); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:32px; margin-bottom:24px; }
.section-title { font-family:'Playfair Display',serif; font-size:20px; color:var(--gold); margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid rgba(201,168,76,0.15); }

.finding-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.finding-item:last-child { border-bottom:none; }
.finding-icon { font-size:16px; flex-shrink:0; margin-top:2px; }
.finding-text { font-size:14px; color:var(--gray-light); line-height:1.6; }

.red-flag-item { border-radius:12px; padding:18px; margin-bottom:12px; border-left:4px solid; background:rgba(255,255,255,0.02); }
.red-flag-item.high { border-color:var(--danger); background:rgba(232,92,76,0.05); }
.red-flag-item.medium { border-color:var(--warning); background:rgba(232,168,76,0.05); }
.red-flag-item.low { border-color:var(--gold); background:rgba(201,168,76,0.05); }
.red-flag-header { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.red-flag-severity { font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:3px 10px; border-radius:100px; }
.severity-high { background:rgba(232,92,76,0.2); color:var(--danger); }
.severity-medium { background:rgba(232,168,76,0.2); color:var(--warning); }
.severity-low { background:rgba(201,168,76,0.2); color:var(--gold); }
.red-flag-title { font-weight:600; font-size:14px; color:var(--white); }
.red-flag-detail { font-size:13px; color:var(--gray); line-height:1.6; margin-bottom:8px; }
.red-flag-fix { font-size:12px; color:var(--success); line-height:1.5; }

.income-summary { background:rgba(201,168,76,0.06); border:1px solid rgba(201,168,76,0.2); border-radius:14px; padding:24px; display:grid; grid-template-columns:repeat(3,1fr); gap:20px; text-align:center; margin-bottom:20px; }
.income-stat-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:var(--gray); margin-bottom:8px; }
.income-stat-value { font-family:'Playfair Display',serif; font-size:24px; font-weight:700; color:var(--gold); }
.spending-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:14px; }
.spending-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:14px; padding:20px; }
.spending-category { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--gray); margin-bottom:8px; }
.spending-amount { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:var(--white); margin-bottom:6px; }
.spending-bar-wrap { height:3px; background:rgba(255,255,255,0.06); border-radius:100px; margin-bottom:10px; overflow:hidden; }
.spending-bar-fill { height:100%; border-radius:100px; }
.spending-examples { font-size:11px; color:var(--gray); margin-bottom:8px; line-height:1.5; }
.spending-assessment { font-size:12px; color:var(--gray-light); line-height:1.5; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05); }

.opportunity-item { background:rgba(201,168,76,0.05); border:1px solid rgba(201,168,76,0.15); border-radius:10px; padding:16px; margin-bottom:12px; }
.opp-title { font-weight:600; font-size:14px; color:var(--gold); margin-bottom:6px; }
.opp-desc { font-size:13px; color:var(--gray); line-height:1.6; }

.action-item { display:flex; gap:16px; align-items:flex-start; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.04); }
.action-item:last-child { border-bottom:none; }
.action-num { width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg,var(--gold),var(--gold-dark)); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:var(--black); flex-shrink:0; }
.action-text { font-size:14px; color:var(--gray-light); line-height:1.6; padding-top:4px; }

.advisor-note { background:rgba(201,168,76,0.06); border:1px solid rgba(201,168,76,0.25); border-left:4px solid var(--gold); border-radius:12px; padding:24px; margin-bottom:24px; }
.advisor-label { font-size:10px; letter-spacing:3px; text-transform:uppercase; color:var(--gold); margin-bottom:10px; }
.advisor-text { font-size:14px; color:var(--gray-light); line-height:1.8; font-style:italic; }

.portal-instructions { background:rgba(201,168,76,0.06); border:1px solid rgba(201,168,76,0.2); border-radius:14px; padding:24px; margin-bottom:20px; }
.portal-instructions-title { font-family:'Playfair Display',serif; font-size:16px; color:var(--gold); margin-bottom:14px; }
.portal-step { display:flex; gap:12px; align-items:flex-start; padding:8px 0; }
.portal-step-num { width:22px; height:22px; border-radius:50%; background:var(--gold); color:var(--black); font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.portal-step-text { font-size:13px; color:var(--gray-light); line-height:1.6; }

.action-btns { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px; }
.download-btn { background:linear-gradient(135deg,var(--gold),var(--gold-dark)); color:var(--black); border:none; padding:16px; border-radius:12px; font-size:14px; font-weight:700; cursor:pointer; font-family:'DM Sans',sans-serif; text-transform:uppercase; transition:all 0.3s; }
.download-btn:hover { transform:translateY(-2px); }
.restart-btn { background:transparent; border:1px solid rgba(201,168,76,0.3); color:var(--gold); padding:16px; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; text-transform:uppercase; transition:all 0.3s; }
.restart-btn:hover { background:rgba(201,168,76,0.1); }

.privacy-notice { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:20px 24px; margin-top:20px; text-align:center; font-size:12px; color:var(--gray); line-height:1.7; }
.email-status { font-size:12px; text-align:center; margin-top:10px; padding:8px; border-radius:8px; display:none; }
.email-status.sent { display:block; background:rgba(76,175,130,0.1); color:var(--success); }

footer { text-align:center; padding:40px 24px; border-top:1px solid rgba(201,168,76,0.1); font-size:12px; color:var(--gray); }
@media(max-width:600px) { header{padding:16px 20px;} .container{padding:40px 16px;} .score-number{font-size:72px;} .income-summary{grid-template-columns:1fr;} .action-btns{grid-template-columns:1fr;} }
</style>
</head>
<body>
<header>
  <div class="logo-mark">AP</div>
  <div class="brand">
    <div class="brand-name">Anchor Point Institute</div>
    <div class="brand-sub">Mortgage Readiness Tools</div>
  </div>
</header>

<div class="container">
  <div class="hero">
    <div class="hero-badge">AI-Powered Analysis</div>
    <h1>Bank Statement<br><span>Audit Tool</span></h1>
    <p class="hero-sub">Upload your last 2–3 months of bank statements and our AI will analyze your financial patterns the same way a mortgage underwriter would.</p>
  </div>

  <!-- File Input (hidden) -->
  <input type="file" id="fileInput" accept=".pdf" multiple style="display:none" onchange="handleFiles(this.files)">

  <!-- Upload Zone -->
  <div class="upload-zone" id="uploadZone" onclick="document.getElementById('fileInput').click()"
    ondragover="event.preventDefault();this.style.borderColor='var(--gold)'"
    ondragleave="this.style.borderColor=''"
    ondrop="event.preventDefault();handleFiles(event.dataTransfer.files)">
    <div class="upload-icon">📄</div>
    <div class="upload-title">Drop your bank statements here</div>
    <div class="upload-sub">PDF format • Last 2–3 months recommended • Up to 3 files</div>
    <div class="upload-btn-label">Choose Files</div>
  </div>

  <!-- File Selected -->
  <div class="file-selected" id="fileSelected">
    <div style="font-size:28px">📄</div>
    <div style="flex:1">
      <div class="file-name" id="fileName">statement.pdf</div>
      <div class="file-size" id="fileSize">Ready to analyze</div>
    </div>
    <div style="color:var(--success);font-size:20px">✓</div>
  </div>

  <!-- Analyze Button -->
  <button class="analyze-btn" id="analyzeBtn" onclick="runAnalysis()">🔍 Analyze My Bank Statement</button>

  <!-- Error -->
  <div class="error-box" id="errorBox"></div>

  <!-- Loading -->
  <div class="loading" id="loading">
    <div class="loading-spinner"></div>
    <div class="loading-text">Analyzing your statements...</div>
    <div class="loading-sub">Our AI is reviewing your transactions, income patterns, and cash flow. This takes about 30 seconds.</div>
  </div>

  <!-- Results -->
  <div class="results" id="results"></div>
</div>

<footer>
  © 2026 Anchor Point Institute · Confidential Client Tool<br>
  <span style="font-size:11px">🔒 Your bank statement is never stored, saved, or shared. All data is deleted immediately after analysis.</span>
</footer>

<script>
let selectedFiles = [];
let lastAnalysisData = null;

const EMAILJS_SERVICE_ID  = 'service_wn5ydih';
const EMAILJS_TEMPLATE_ID = 'template_0gm4ccg';
const EMAILJS_PUBLIC_KEY  = 'KwJlFR3BAMar7s41J';
const ADVISOR_EMAIL       = 'anchorpointempowermentcenter@gmail.com';
emailjs.init(EMAILJS_PUBLIC_KEY);

function handleFiles(files) {
  const arr = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
  if (!arr.length) { showError('Please select a PDF file.'); return; }
  selectedFiles = arr;
  const names = arr.map(f => f.name).join(', ');
  const size = arr.reduce((a, f) => a + f.size, 0);
  document.getElementById('fileName').textContent = names;
  document.getElementById('fileSize').textContent = arr.length + ' file(s) · ' + (size/1024/1024).toFixed(2) + ' MB';
  document.getElementById('fileSelected').classList.add('show');
  document.getElementById('analyzeBtn').classList.add('show');
  document.getElementById('errorBox').classList.remove('show');
}

function showError(msg) {
  const e = document.getElementById('errorBox');
  e.textContent = msg;
  e.classList.add('show');
}

async function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function runAnalysis() {
  if (!selectedFiles.length) return;
  document.getElementById('analyzeBtn').disabled = true;
  document.getElementById('uploadZone').style.display = 'none';
  document.getElementById('fileSelected').classList.remove('show');
  document.getElementById('analyzeBtn').classList.remove('show');
  document.getElementById('loading').classList.add('show');
  document.getElementById('results').classList.remove('show');
  document.getElementById('errorBox').classList.remove('show');

  try {
    const content = [];
    for (const file of selectedFiles) {
      const b64 = await fileToBase64(file);
      content.push({ type:'document', source:{ type:'base64', media_type:'application/pdf', data:b64 } });
    }
    content.push({ type:'text', text:\`You are a senior mortgage readiness advisor at Anchor Point Institute. Analyze this bank statement thoroughly as a mortgage underwriter would.

Return ONLY a valid JSON object with this exact structure (no markdown, no preamble):
{
  "overallScore": <0-100>,
  "tier": "<Mortgage Ready|Almost Ready|Needs Work|Foundation Stage>",
  "tierDescription": "<2 sentences>",
  "dimensions": [
    {"name":"Income Stability","score":<0-100>,"note":"<observation>"},
    {"name":"Cash Flow Health","score":<0-100>,"note":"<observation>"},
    {"name":"Spending Patterns","score":<0-100>,"note":"<observation>"},
    {"name":"Banking Behavior","score":<0-100>,"note":"<observation>"},
    {"name":"Reserve Building","score":<0-100>,"note":"<observation>"}
  ],
  "keyFindings":[
    {"type":"<positive|warning|negative>","text":"<finding>"},
    {"type":"<positive|warning|negative>","text":"<finding>"},
    {"type":"<positive|warning|negative>","text":"<finding>"},
    {"type":"<positive|warning|negative>","text":"<finding>"}
  ],
  "redFlags":[
    {"flag":"<title>","severity":"<high|medium|low>","detail":"<what underwriter sees>","fix":"<action>"},
    {"flag":"<title>","severity":"<high|medium|low>","detail":"<what underwriter sees>","fix":"<action>"},
    {"flag":"<title>","severity":"<high|medium|low>","detail":"<what underwriter sees>","fix":"<action>"}
  ],
  "spendingBreakdown":{
    "fixedExpenses":{"amount":<number>,"examples":"<examples>","assessment":"<note>"},
    "variableNecessities":{"amount":<number>,"examples":"<examples>","assessment":"<note>"},
    "foodAndDining":{"amount":<number>,"examples":"<examples>","assessment":"<note>"},
    "entertainment":{"amount":<number>,"examples":"<examples>","assessment":"<note>"},
    "discretionary":{"amount":<number>,"examples":"<examples>","assessment":"<note>"},
    "estimatedMonthlyIncome":<number>,
    "estimatedMonthlySavings":<number>,
    "savingsRate":<0-100>
  },
  "cashFlowOpportunities":[
    {"title":"<title>","description":"<detail>"},
    {"title":"<title>","description":"<detail>"},
    {"title":"<title>","description":"<detail>"}
  ],
  "priorityActions":["<action1>","<action2>","<action3>","<action4>","<action5>"],
  "advisorNote":"<3-4 sentence warm professional note>"
}\` });

    const response = await fetch('https://anchor-point-api.onrender.com/analyze', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:2000, messages:[{role:'user',content}] })
    });

    if (!response.ok) throw new Error('API error: ' + response.status);
    const data = await response.json();
    const rawText = (data.content || []).map(b => b.text || '').join('');
    const clean = rawText.replace(/\`\`\`json|\`\`\`/g,'').trim();
    const parsed = JSON.parse(clean);

    document.getElementById('loading').classList.remove('show');
    renderResults(parsed);
    sendAdvisorEmail(parsed);

  } catch(err) {
    document.getElementById('loading').classList.remove('show');
    document.getElementById('uploadZone').style.display = '';
    document.getElementById('analyzeBtn').disabled = false;
    document.getElementById('analyzeBtn').classList.add('show');
    showError('Analysis failed: ' + err.message + '. Please try again.');
    console.error(err);
  }
}

function sc(s) { return s>=75?'var(--success)':s>=50?'var(--warning)':'var(--danger)'; }
function scClass(s) { return s>=75?'c-green':s>=50?'c-orange':'c-red'; }
function fi(t) { return t==='positive'?'✅':t==='warning'?'⚠️':'❌'; }

function renderResults(data) {
  lastAnalysisData = data;
  const sb = data.spendingBreakdown || {};
  const total = (sb.fixedExpenses?.amount||0)+(sb.variableNecessities?.amount||0)+(sb.foodAndDining?.amount||0)+(sb.entertainment?.amount||0)+(sb.discretionary?.amount||0);
  const cats = [
    {label:'🏠 Fixed Expenses',data:sb.fixedExpenses,color:'#E85C4C'},
    {label:'⛽ Variable Necessities',data:sb.variableNecessities,color:'#E8A84C'},
    {label:'🍽️ Food & Dining',data:sb.foodAndDining,color:'#C9A84C'},
    {label:'🎬 Entertainment',data:sb.entertainment,color:'#7C84E8'},
    {label:'🛍️ Discretionary',data:sb.discretionary,color:'#4CAF82'},
  ];
  const savC = (sb.savingsRate||0)>=10?'var(--success)':(sb.savingsRate||0)>=5?'var(--warning)':'var(--danger)';

  document.getElementById('results').innerHTML = \`
    <div class="score-hero">
      <div class="score-label">Mortgage Readiness Score</div>
      <div class="score-number \${scClass(data.overallScore)}">\${data.overallScore}</div>
      <div class="score-tier" style="color:\${sc(data.overallScore)}">\${data.tier}</div>
      <div class="score-desc">\${data.tierDescription}</div>
    </div>

    <div class="dimensions-grid">
      \${(data.dimensions||[]).map(d=>\`
        <div class="dimension-card">
          <div class="dim-header">
            <div class="dim-name">\${d.name}</div>
            <div class="dim-score" style="color:\${sc(d.score)}">\${d.score}</div>
          </div>
          <div class="dim-bar"><div class="dim-fill" style="width:\${d.score}%;background:\${sc(d.score)}"></div></div>
          <div class="dim-note">\${d.note}</div>
        </div>\`).join('')}
    </div>

    <div class="advisor-note">
      <div class="advisor-label">📋 Advisor Notes</div>
      <div class="advisor-text">\${data.advisorNote}</div>
    </div>

    <div class="section-card">
      <div class="section-title">Spending Pattern Breakdown</div>
      <div class="income-summary">
        <div><div class="income-stat-label">Est. Monthly Income</div><div class="income-stat-value">$\${(sb.estimatedMonthlyIncome||0).toLocaleString()}</div></div>
        <div><div class="income-stat-label">Total Spending</div><div class="income-stat-value" style="color:var(--danger)">$\${total.toLocaleString()}</div></div>
        <div><div class="income-stat-label">Savings Rate</div><div class="income-stat-value" style="color:\${savC}">\${sb.savingsRate||0}%</div></div>
      </div>
      <div class="spending-grid">
        \${cats.map(cat=>{
          const pct=total>0?Math.round(((cat.data?.amount||0)/total)*100):0;
          return \`<div class="spending-card">
            <div class="spending-category">\${cat.label}</div>
            <div class="spending-amount">$\${(cat.data?.amount||0).toLocaleString()}</div>
            <div class="spending-bar-wrap"><div class="spending-bar-fill" style="width:\${pct}%;background:\${cat.color}"></div></div>
            <div class="spending-examples">\${cat.data?.examples||''}</div>
            <div class="spending-assessment">\${cat.data?.assessment||''}</div>
          </div>\`;
        }).join('')}
      </div>
    </div>

    <div class="section-card">
      <div class="section-title">Key Findings</div>
      \${(data.keyFindings||[]).map(f=>\`
        <div class="finding-item">
          <div class="finding-icon">\${fi(f.type)}</div>
          <div class="finding-text">\${f.text}</div>
        </div>\`).join('')}
    </div>

    <div class="section-card">
      <div class="section-title">🚨 Mortgage Underwriter Red Flags</div>
      \${(data.redFlags&&data.redFlags.length)?data.redFlags.map(f=>\`
        <div class="red-flag-item \${f.severity}">
          <div class="red-flag-header">
            <span class="red-flag-severity severity-\${f.severity}">\${f.severity} risk</span>
            <span class="red-flag-title">\${f.flag}</span>
          </div>
          <div class="red-flag-detail">\${f.detail}</div>
          <div class="red-flag-fix">→ \${f.fix}</div>
        </div>\`).join(''):'<p style="color:var(--success);font-size:14px">✅ No significant underwriter red flags detected.</p>'}
    </div>

    <div class="section-card">
      <div class="section-title">Cash Flow Opportunities</div>
      \${(data.cashFlowOpportunities||[]).map(o=>\`
        <div class="opportunity-item">
          <div class="opp-title">💡 \${o.title}</div>
          <div class="opp-desc">\${o.description}</div>
        </div>\`).join('')}
    </div>

    <div class="section-card">
      <div class="section-title">Your Priority Action Plan</div>
      \${(data.priorityActions||[]).map((a,i)=>\`
        <div class="action-item">
          <div class="action-num">\${i+1}</div>
          <div class="action-text">\${a}</div>
        </div>\`).join('')}
    </div>

    <div class="portal-instructions">
      <div class="portal-instructions-title">📥 Next Steps — Upload to Your Portal</div>
      <div class="portal-step"><div class="portal-step-num">1</div><div class="portal-step-text"><strong>Download your analysis</strong> using the button below.</div></div>
      <div class="portal-step"><div class="portal-step-num">2</div><div class="portal-step-text"><strong>Log into your Anchor Point ReadyPath Portal</strong> at skool.com/anchor-point-ready-path.</div></div>
      <div class="portal-step"><div class="portal-step-num">3</div><div class="portal-step-text"><strong>Upload your PDF</strong> in the Bank Statement Audit section of your dashboard.</div></div>
      <div class="portal-step"><div class="portal-step-num">4</div><div class="portal-step-text"><strong>Your advisor will review</strong> your analysis and reach out with personalized next steps.</div></div>
    </div>

    <div class="action-btns">
      <button class="download-btn" id="downloadBtn" onclick="downloadPDF()">⬇ Download My Analysis</button>
      <button class="restart-btn" onclick="resetTool()">↩ New Analysis</button>
    </div>
    <div class="email-status" id="emailStatus"></div>
    <div class="privacy-notice">🔒 <strong>Your privacy is protected.</strong> Your bank statement is analyzed in real time and is <strong>never stored, saved, or shared</strong>. All data is permanently deleted immediately after your results are generated.</div>
  \`;
  document.getElementById('results').classList.add('show');
  document.getElementById('results').scrollIntoView({behavior:'smooth',block:'start'});
}

async function sendAdvisorEmail(data) {
  try {
    const sb = data.spendingBreakdown||{};
    const body = \`NEW BANK STATEMENT AUDIT\\nDate: \${new Date().toLocaleString()}\\n\\nSCORE: \${data.overallScore}/100 — \${data.tier}\\n\${data.tierDescription}\\n\\nRED FLAGS:\\n\${(data.redFlags||[]).map(f=>\`[\${f.severity.toUpperCase()}] \${f.flag}: \${f.detail}\`).join('\\n')}\\n\\nSPENDING:\\nIncome: $\${(sb.estimatedMonthlyIncome||0).toLocaleString()} | Savings Rate: \${sb.savingsRate||0}%\\nFixed: $\${(sb.fixedExpenses?.amount||0).toLocaleString()} | Food: $\${(sb.foodAndDining?.amount||0).toLocaleString()} | Discretionary: $\${(sb.discretionary?.amount||0).toLocaleString()}\\n\\nADVISOR NOTE:\\n\${data.advisorNote}\`;
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email:ADVISOR_EMAIL, subject:\`New Audit — Score: \${data.overallScore}/100 (\${data.tier})\`, message:body });
    const s = document.getElementById('emailStatus');
    if(s){ s.textContent='✅ Your advisor has been notified.'; s.className='email-status sent'; }
  } catch(e) { console.warn('Email failed:',e); }
}

function downloadPDF() {
  if(!lastAnalysisData) return;
  const btn = document.getElementById('downloadBtn');
  btn.disabled=true; btn.textContent='Generating...';
  try {
    const {jsPDF}=window.jspdf;
    const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
    const d=lastAnalysisData, W=210, m=20, cW=W-m*2;
    let y=20;
    const gold=[201,168,76],dark=[30,30,30],gray=[120,120,120],white=[255,255,255],red=[232,92,76],green=[76,175,130],orange=[232,168,76];
    function sc2(s){return s>=75?green:s>=50?orange:red;}
    function chk(n=20){if(y+n>275){doc.addPage();y=20;doc.setFillColor(...gold);doc.rect(0,0,W,4,'F');}}
    function secTitle(t){chk(12);doc.setFillColor(245,245,245);doc.rect(m,y,cW,8,'F');doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(...gold);doc.text(t,m+3,y+5.5);y+=12;}
    // Header
    doc.setFillColor(...dark);doc.rect(0,0,W,38,'F');
    doc.setFillColor(...gold);doc.rect(0,38,W,2,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(18);doc.setTextColor(...gold);doc.text('ANCHOR POINT INSTITUTE',m,15);
    doc.setFontSize(10);doc.setTextColor(...white);doc.text('Bank Statement Audit Report',m,23);
    doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(...gray);
    doc.text('Generated: '+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),m,31);
    doc.text('CONFIDENTIAL',W-m,31,{align:'right'});
    y=50;
    // Score
    doc.setFillColor(245,245,245);doc.roundedRect(m,y,cW,30,3,3,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(34);doc.setTextColor(...sc2(d.overallScore));doc.text(String(d.overallScore),m+10,y+19);
    doc.setFontSize(14);doc.setTextColor(...dark);doc.text(d.tier,m+35,y+12);
    doc.setFont('helvetica','normal');doc.setFontSize(9);doc.setTextColor(...gray);
    const descL=doc.splitTextToSize(d.tierDescription,cW-45);doc.text(descL,m+35,y+20);
    y+=36;
    // Dimensions
    secTitle('READINESS DIMENSIONS');
    (d.dimensions||[]).forEach(dim=>{
      chk(14);
      doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(...dark);doc.text(dim.name,m,y+4);
      doc.setTextColor(...sc2(dim.score));doc.text(dim.score+'/100',W-m,y+4,{align:'right'});
      doc.setFillColor(220,220,220);doc.rect(m,y+6,cW,2.5,'F');
      doc.setFillColor(...sc2(dim.score));doc.rect(m,y+6,cW*dim.score/100,2.5,'F');
      doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...gray);
      const nl=doc.splitTextToSize(dim.note,cW);doc.text(nl,m,y+12);
      y+=12+nl.length*4;
    });
    y+=4;
    // Red Flags
    if(d.redFlags&&d.redFlags.length){
      secTitle('MORTGAGE UNDERWRITER RED FLAGS');
      d.redFlags.forEach(f=>{
        chk(20);
        const col=f.severity==='high'?red:f.severity==='medium'?orange:gold;
        doc.setFillColor(...col);doc.rect(m,y,3,16,'F');
        doc.setFont('helvetica','bold');doc.setFontSize(9);doc.setTextColor(...col);
        doc.text('['+f.severity.toUpperCase()+'] '+f.flag,m+6,y+5);
        doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...gray);
        const dl=doc.splitTextToSize(f.detail,cW-8);doc.text(dl,m+6,y+10);
        y+=10+dl.length*4;
        doc.setTextColor(...green);
        const fl=doc.splitTextToSize('→ '+f.fix,cW-8);doc.text(fl,m+6,y);
        y+=fl.length*4+6;
      });
    }
    // Actions
    secTitle('PRIORITY ACTION PLAN');
    (d.priorityActions||[]).forEach((a,i)=>{
      chk(12);
      doc.setFillColor(...gold);doc.circle(m+3.5,y+3.5,3.5,'F');
      doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(...dark);doc.text(String(i+1),m+2,y+5);
      doc.setFont('helvetica','normal');
      const al=doc.splitTextToSize(a,cW-12);doc.text(al,m+10,y+4);
      y+=al.length*4.5+4;
    });
    // Privacy footer
    chk(20);
    doc.setFillColor(245,245,245);doc.rect(m,y,cW,16,'F');
    doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(...dark);doc.text('Privacy Notice',m+4,y+6);
    doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(...gray);
    const pl=doc.splitTextToSize('Your bank statement was analyzed in real time and is never stored, saved, or shared. All data was permanently deleted after your results were generated.',cW-8);
    doc.text(pl,m+4,y+11);
    // Page numbers
    const pages=doc.internal.getNumberOfPages();
    for(let i=1;i<=pages;i++){doc.setPage(i);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(...gray);doc.text('Page '+i+' of '+pages+' | Anchor Point Institute',W/2,292,{align:'center'});}
    doc.save('Anchor-Point-Bank-Audit-'+new Date().toISOString().slice(0,10)+'.pdf');
  } catch(e){ console.error(e); alert('PDF error. Please try again.'); }
  btn.disabled=false; btn.textContent='⬇ Download My Analysis';
}

function resetTool() {
  selectedFiles=[];
  document.getElementById('fileInput').value='';
  document.getElementById('uploadZone').style.display='';
  document.getElementById('fileSelected').classList.remove('show');
  document.getElementById('analyzeBtn').classList.remove('show');
  document.getElementById('analyzeBtn').disabled=false;
  document.getElementById('results').classList.remove('show');
  document.getElementById('results').innerHTML='';
  document.getElementById('errorBox').classList.remove('show');
  window.scrollTo({top:0,behavior:'smooth'});
}
</script>
</body>
</html>
`);
});

// Proxy to Anthropic API
app.post('/analyze', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
