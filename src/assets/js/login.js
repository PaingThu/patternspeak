import { COMMON, WEB_APP_URL, getBasePath, loadingSpinner } from "./config.js";

// Elements
const loginForm = document.getElementById('loginForm');

// Login Logic
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const loader = document.getElementById('loginBtnLoader');
    const status = document.getElementById('loginStatus');
    const displayArea = document.getElementById('displayArea');

    btn.disabled = true;

    displayArea.innerHTML = loadingSpinner('Authenticating...');
    status.textContent = '';
    status.classList.add('hidden');

    let payload = {
        action: 'login',
        adminId: document.getElementById('adminId').value,
        password: document.getElementById('password').value,
        userIp: COMMON.ipaddress
    };

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Server returned status " + response.status);
        }

        const result = await response.json();

        if (result.status === 'success') {
            // Sets a cookie that expires in 7 days
            const d = new Date();
            d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();

            document.cookie = "userToken=" + result.token + ";" + expires + ";path=/;SameSite=Strict";

            window.location.href = getBasePath() + "admin/";
        } else {
            status.textContent = 'Invalid credentials. Please check and try again.';
            status.className = 'mt-4 p-3 rounded-lg text-sm text-center block bg-red-100 text-red-700';
            status.classList.remove('hidden');
        }
    } catch (err) {
        console.error(err);
        status.textContent = 'Connection error. Make sure Apps Script is deployed as "Anyone".';
        status.className = 'mt-4 p-3 rounded-lg text-sm text-center block bg-red-100 text-red-700';
        status.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        loader.classList.add('hidden');
        displayArea.innerHTML = '';
    }
});