// ====================================================================
// !!! ⚠️ 這是您最終必須替換的程式碼 ⚠️ !!!
// 請將這兩行替換為您 Supabase 專案的真實 URL 和 Key
// ====================================================================

const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE'; // 範例: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE'; // 範例: eyJhbGciOiJIUzI1NiI...

// --------------------------------------------------------------------

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM 元素快取 (用於更新介面)
const loginSection = document.getElementById('login-section');
const calculatorSection = document.getElementById('calculator-section');
const logSection = document.getElementById('log-section');
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const loginMessage = document.getElementById('login-message');

// --- 萬能計算機核心邏輯 (第三篇規格) ---
function calculateSyrup() {
    const volume = parseFloat(document.getElementById('volume').value);
    
    // 檢查輸入是否有效
    if (isNaN(volume) || volume <= 0) {
        document.getElementById('sugar-output').textContent = '請輸入有效數值';
        document.getElementById('water-output').textContent = '請輸入有效數值';
        return;
    }

    // 1:1 比例：體積膨脹係數約為 1.6 (這是您提供的參數)
    const mixFactor = 1.6;
    const requiredParts = volume / mixFactor;

    const sugar = requiredParts * 1;
    const water = requiredParts * 1;

    document.getElementById('sugar-output').textContent = sugar.toFixed(2);
    document.getElementById('water-output').textContent = water.toFixed(2);
}

// --- 會員認證 (Auth) 邏輯 ---
async function handleLogin(event) {
    event.preventDefault();
    const email = emailInput.value;
    
    if (!email) return;

    loginMessage.textContent = '發送中...';

    // 使用 Supabase 的 Email OTP 登入 (Magic Link)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });

    if (error) {
        loginMessage.textContent = `錯誤：${error.message}`;
    } else {
        loginMessage.textContent = `成功！請檢查您的電子郵件信箱，點擊登入連結。`;
        loginBtn.style.display = 'none';
    }
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('登出失敗:', error);
}

// --- 介面更新與數據綁定 ---
function updateUI(session) {
    const user = session?.user;

    if (user) {
        // 會員已登入：顯示日誌區塊
        loginSection.style.display = 'none';
        logSection.style.display = 'block'; 
        userInfo.textContent = `嗨，${user.email.split('@')[0]} (BEP 會員)`;
        logoutBtn.style.display = 'inline-block';
        fetchHiveData(user.id); // 呼叫蜂箱數據
    } else {
        // 會員未登入：只顯示計算機
        loginSection.style.display = 'block';
        logSection.style.display = 'none'; 
        userInfo.textContent = '請登入';
        logoutBtn.style.display = 'none';
    }
}

// 模擬抓取蜂箱資料 (第二篇規格)
async function fetchHiveData(userId) {
    const hiveLogsDiv = document.getElementById('hive-logs');
    hiveLogsDiv.innerHTML = '<p>正在從 Supabase 抓取您的數據...</p>';
    
    // ⚠️ 實際應用中，需要建立 RLS 政策，讓用戶只能看到自己的數據
    const { data: hives, error } = await supabase
        .from('hives') // 假設您在 Supabase 建立了 'hives' 表
        .select('name, status, last_inspection_date')
        .limit(5); // 僅顯示最近 5 筆

    if (error) {
        hiveLogsDiv.innerHTML = `<p style="color:red;">數據抓取失敗：${error.message} (請檢查 Supabase RLS)</p>`;
        return;
    }

    if (hives.length === 0) {
        hiveLogsDiv.innerHTML = '<p>您尚未建立任何蜂箱數據。請開始新增！</p>';
    } else {
        let html = '<ul>';
        hives.forEach(hive => {
            html += `<li><strong>${hive.name}</strong> - 狀態: ${hive.status} - 檢查日: ${hive.last_inspection_date || 'N/A'}</li>`;
        });
        html += '</ul>';
        hiveLogsDiv.innerHTML = html;
    }
}

// --- 啟動與監聽 ---
document.addEventListener('DOMContentLoaded', () => {
    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    calculateSyrup(); // 初始化計算機結果
    
    // 監聽認證狀態變化 (Supabase RLS 核心)
    supabase.auth.onAuthStateChange((event, session) => {
        updateUI(session);
    });

    // 檢查初始 session
    supabase.auth.getSession().then(({ data: { session } }) => {
        updateUI(session);
    });
});
