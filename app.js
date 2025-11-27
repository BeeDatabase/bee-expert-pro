// ====================================================================
// !!! ⚠️ 這是您最終必須替換的程式碼 ⚠️ !!!
// 請將這兩行替換為您 Supabase 專案的真實 URL 和 Key
// ====================================================================

const SUPABASE_URL = 'https://wskhicsuvdpfaqjzdprt.supabase.co'; // 範例: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indza2hpY3N1dmRwZmFxanpkcHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNTM3NzQsImV4cCI6MjA3OTgyOTc3NH0.BTAgZzJ3e9w6LI1Lk2aEWdicZWIIwoLHil7NWWslRgU'; // 範例: eyJhbGciOiJIUzI1NiI...

// --------------------------------------------------------------------

// 修正：使用全局的 createClient 函數，並將實例命名為 sb (Supabase Client)
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM 元素快取 (其餘不變)
const splashScreen = document.getElementById('splash-screen');
const mainHeader = document.getElementById('main-header');
const mainContent = document.getElementById('main-content');
const loginSection = document.getElementById('login-section');
const calculatorSection = document.getElementById('calculator-section');
const logSection = document.getElementById('log-section');
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const loginMessage = document.getElementById('login-message');

// --- 萬能計算機核心邏輯 ---
function calculateSyrup() {
    const volume = parseFloat(document.getElementById('volume').value);
    
    if (isNaN(volume) || volume <= 0) {
        document.getElementById('sugar-output').textContent = '請輸入有效數值';
        document.getElementById('water-output').textContent = '請輸入有效數值';
        return;
    }

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

    // 使用修正後的 sb 實例連線
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });

    if (error) {
        loginMessage.textContent = `錯誤：${error.message}`;
    } else {
        loginMessage.textContent = `成功！請檢查您的電子郵件信箱，點擊登入連結。`;
        loginBtn.style.display = 'none';
    }
}

async function handleLogout() {
    // 使用修正後的 sb 實例連線
    const { error } = await sb.auth.signOut();
    if (error) console.error('登出失敗:', error);
}

// --- 介面更新與數據綁定 ---
function updateUI(session) {
    const user = session?.user;

    if (user) {
        loginSection.style.display = 'none';
        logSection.style.display = 'block'; 
        userInfo.textContent = `嗨，${user.email.split('@')[0]} (BEP 會員)`;
        logoutBtn.style.display = 'inline-block';
        fetchHiveData(user.id); 
    } else {
        loginSection.style.display = 'block';
        logSection.style.display = 'none'; 
        userInfo.textContent = '請登入';
        logoutBtn.style.display = 'none';
    }
}

// 模擬抓取蜂箱資料
async function fetchHiveData(userId) {
    const hiveLogsDiv = document.getElementById('hive-logs');
    hiveLogsDiv.innerHTML = '<p>正在從 Supabase 抓取您的數據...</p>';
    
    // 使用修正後的 sb 實例連線
    const { data: hives, error } = await sb
        .from('hives')
        .select('name, status, last_inspection_date')
        .limit(5);

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
    
    // 步驟 1: 延遲 2 秒，然後顯示主頁面
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        
        mainHeader.style.display = 'flex'; 
        mainContent.style.display = 'block'; 

        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500); 

        // 執行原有的啟動邏輯 (連線 Supabase)
        loginBtn.addEventListener('click', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);
        calculateSyrup(); 
        
        // 使用修正後的 sb 實例連線
        sb.auth.getSession().then(({ data: { session } }) => {
            updateUI(session);
        });
        sb.auth.onAuthStateChange((event, session) => {
            updateUI(session);
        });

    }, 2000); 
});
