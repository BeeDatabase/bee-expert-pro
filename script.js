const knowledge = {
    breeding: { graft: 0, check: 24, sealed: 120, move: 264, emerge: 312 },
    medication: { oxalic: '35g 草酸 + 1L 糖水，每框 5ml' },
    feed: { pollenCake: '黃豆粉 4.5kg : 酵母 1.5kg : 奶粉 1kg : 糖 2.5kg : 花粉 0.5kg' },
    // 從規格書和舊網站加更多...
};

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
        <div>微氣候: 溫濕度載入中</div>
        <button onclick="toggleMode('elder')">陽光/老人模式</button>
        <button onclick="toggleMode('night')">夜間紅光模式</button>
    `,
    map: () => `
        <div class="hive-grid">
            <div class="hive red">A-01 🟥 警報 (失王)</div>
            <div class="hive yellow">A-02 🟨 注意 (空間不足)</div>
            <div class="hive green">A-03 🟩 健康</div>
            <!-- 加更多箱 -->
        </div>
        <button>批次統一餵食</button>
        <input placeholder="語音紀錄" type="text">
    `,
    calculator: () => `
        <input id="graftDate" type="date" placeholder="移蟲日">
        <button onclick="calcBreeding()">計算育王排程</button>
        <div id="calcResult"></div>
        <input id="feedAmount" type="number" placeholder="飼料目標量">
        <button onclick="calcFeed()">計算1:1飼料</button>
        <div id="feedResult"></div>
        <!-- 加舊網站其他計算如蜂蟹蟎、利潤 -->
    `,
    compliance: () => `
        <button>生成農糧署 PDF</button>
        <div>台灣蜜源地圖: 龍眼/荔枝花期</div>
        <button>土地免責書</button>
    `,
    knowledge: () => `
        <ul>
            <li>蜂蟹蟎: 診斷 (300蜂>3隻)，草酸滴殺配方</li>
            <li>AFB: 拉絲>2.5cm，燒毀</li>
            <li>花粉餅: 黃豆粉4.5kg...</li>
            <li>朗氏箱: 465x375x240mm</li>
        </ul>
    `,
    business: () => `
        <div>庫存自動扣料</div>
        <button>生成銷售頁 (LINE Pay)</button>
        <div>防偽計算: 進糖 vs 產蜜</div>
    `,
    safety: () => `
        <button>GPS 求救 SOS</button>
        <div>衛星 NDVI 植被綠度</div>
        <button>毒蛇醫院導航</button>
    `,
    settings: () => `
        <button>匯出 Excel/PDF/JSON</button>
        <div>軟刪除後悔藥</div>
        <div>會員方案: Free/Pro</div>
    `
};

function showPage(page) {
    document.getElementById('content').innerHTML = pages[page]();
}

function toggleMode(mode) {
    document.body.className = mode;
}

function calcBreeding() {
    const date = new Date(document.getElementById('graftDate').value);
    const addH = (h) => new Date(date.getTime() + h * 3600000).toLocaleString('zh-TW');
    document.getElementById('calcResult').innerHTML = `
        移蟲: ${addH(0)}<br>
        檢查接受: ${addH(24)}<br>
        封蓋: ${addH(120)}<br>
        移台: ${addH(264)}<br>
        出房: ${addH(312)}
    `;
}

function calcFeed() {
    const amount = document.getElementById('feedAmount').value;
    document.getElementById('feedResult').innerHTML = `糖: ${amount} kg, 水: ${amount} L (1:1)`;
}

window.onload = () => showPage('dashboard');
