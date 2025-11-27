
const pages = {
    dashboard: () => `
        <div class="grid">
            <button>蜂箱管理</button>
            <button>萬能計算</button>
            <button>病蟲害圖鑑</button>
            <button>天氣情報</button>
            <button>政府申報</button>
            <button>資材團購</button>
            <button>我的賣場</button>
            <button>緊急求救</button>
            <button>設定</button>
        </div>
        <div>今日概況: 總箱數 108 / 異常 3</div>
        <div>今年產量: 1250 kg</div>
        <div>年度蜂王色: 2025藍</div>
        <button onclick="toggleMode('elder')">老人模式</button>
        <button onclick="toggleMode('night')">夜間紅光</button>
    `,
    map: () => `
        <div class="hive-grid">
            <!-- 模擬 9 箱，紅黃綠燈號 -->
            <div class="hive red">A-01 警報</div>
            <div class="hive yellow">A-02 注意</div>
            <div class="hive green">A-03 健康</div>
            <!-- 加更多... -->
        </div>
        <button>批次餵食</button>
    `,
    calculator: () => `
        <input id="graftDate" type="date" placeholder="移蟲日">
        <button onclick="calcBreeding()">計算育王</button>
        <div id="calcResult"></div>
    `,
    // 其他頁面類似，模擬規格書
    compliance: () => `<button>生成政府 PDF</button>`,
    knowledge: () => `<ul><li>蜂蟹蟎: 300蜂>3隻</li></ul>`,
    business: () => `<div>庫存: 自動扣料</div>`,
    safety: () => `<button>GPS 求救</button>`,
    settings: () => `<button>匯出資料</button>`
};

function showPage(page) {
    document.getElementById('content').innerHTML = pages[page]();
}

function toggleMode(mode) {
    document.body.className = mode; // 切換 CSS class
}

function calcBreeding() {
    const date = new Date(document.getElementById('graftDate').value);
    const addDays = (d) => new Date(date.getTime() + d * 86400000);
    document.getElementById('calcResult').innerHTML = `
        Day 3: ${addDays(3)} 查接受率<br>
        Day 5: ${addDays(5)} 封蓋
    `;
    // 加更多計算從規格書
}

window.onload = () => showPage('dashboard');
