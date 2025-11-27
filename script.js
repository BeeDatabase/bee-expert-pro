const pages = {
  dashboard: () => `
    <div class="page">
      <h1 style="color:var(--gold);margin-bottom:30px;text-align:center;">Bee Expert Pro 戰情儀表板</h1>
      <div class="grid">
        <div class="card" onclick="showPage('map')"><h3>蜂箱管理</h3><p>108 箱 • 3 紅燈</p></div>
        <div class="card" onclick="showPage('calculator')"><h3>萬能計算</h3><p>育王•飼料•用藥</p></div>
        <div class="card"><h3>病蟲害圖鑑</h3><p>即時診斷</p></div>
        <div class="card"><h3>天氣情報</h3><p>微氣候預測</p></div>
        <div class="card"><h3>政府申報</h3><p>一鍵產 PDF</p></div>
        <div class="card"><h3>資材團購</h3><p>蜂農價</p></div>
        <div class="card"><h3>我的賣場</h3><p>LINE Pay</p></div>
        <div class="card" onclick="showPage('safety')"><h3>緊急求救</h3><p>GPS SOS</p></div>
      </div>
      <div class="info-grid">
        <div class="info-card"><h4>今日概況</h4><p>總箱數 108 │ 異常 3 箱</p></div>
        <div class="info-card"><h4>年度產量</h4><p>1250 kg</p></div>
        <div class="info-card"><h4>蜂王年份色</h4><p>2025 藍色</p></div>
        <div class="info-card"><h4>微氣候</h4><p>27°C • 濕度 72% • 無雨</p></div>
      </div>
    </div>
  `,
  map: () => `
    <div class="page">
      <h1 style="color:var(--gold);margin-bottom:30px;">蜂場地圖</h1>
      <div class="hive-grid">
        <div class="hive red">A-01<br>失王</div>
        <div class="hive yellow">A-02<br>空間不足</div>
        <div class="hive green">A-03<br>健康</div>
        <div class="hive purple">A-04<br>菁英種源</div>
        <!-- 可加到 108 個 -->
      </div>
    </div>
  `,
  calculator: () => `
    <div class="page">
      <h1 style="color:var(--gold)">萬能計算機</h1>
      <div style="background:var(--glass);padding:30px;border-radius:20px;margin:20px 0;">
        <input type="date" id="graftDate"><button onclick="calcBreeding()" style="margin-left:10px;">計算育王排程</button>
        <div id="calcResult" style="color:var(--gold);margin-top:20px;font-size:1.1em;"></div>
      </div>
    </div>
  `
  // 其他頁面可繼續加...
};

function showPage(id) {
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.querySelector(`nav button[data-page="${id}"]`).classList.add('active');
  document.getElementById('content').innerHTML = pages[id]();
}

document.getElementById('elderMode').onclick = () => document.body.classList.toggle('elder');
document.getElementById('nightMode').onclick = () => document.body.classList.toggle('night');

function calcBreeding() {
  const d = new Date(document.getElementById('graftDate').value);
  const f = h => new Date(d.getTime() + h*3600000).toLocaleString('zh-TW',{dateStyle:'full',timeStyle:'short'});
  document.getElementById('calcResult').innerHTML = `
    <b>移蟲：</b>${f(0)}<br>
    <b>檢查接受：</b>${f(24)}<br>
    <b>封蓋：</b>${f(120)}<br>
    <b>移王台：</b>${f(264)}<br>
    <b>出房：</b>${f(312)}
  `;
}

window.onload = () => showPage('dashboard');
