// import '../style.css';
import { WEB_APP_URL, COMMON, tokenCheck, getBasePath, logo } from "./config.js";

const authenticating = document.getElementById('authenticating');
const mainContainer = document.getElementById('mainContainer');

const logoElement = document.querySelector('#logo-img');
logoElement.src = logo;

const init = async () => {
    const result = await tokenCheck('admin');
    if (result && result.status === 'success') {
        // admin.textContent = result.name;
        // user.value = result.user;
        // authenticating.classList.add('hidden');
        // mainContainer.classList.remove('hidden');
        // loadData();
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

async function getApiKey() {
    let payload = {
        action: 'getGasApiKey',
        userIp: COMMON.ipaddress
    };
    const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error("Server returned status " + response.status);
    }

    const result = await response.json();

    console.log("result ", result);

    if (!result.status) {
        throw new Error(result.message);
    }

    return result.apiKey;
}


// Language State
let activeLangs = {
    burmese: true,
    japanese: true
};

const el = {
    searchView: document.getElementById('searchView'),
    lyricsView: document.getElementById('lyricsView'),
    loadingUI: document.getElementById('loadingUI'),
    loadingMsg: document.getElementById('loadingMsg'),
    mainSearchBtn: document.getElementById('mainSearchBtn'),
    lyricsContainer: document.getElementById('lyricsContainer'),
    metaTitle: document.getElementById('metaTitle'),
    metaArtist: document.getElementById('metaArtist'),
    errorBox: document.getElementById('errorBox'),
    backBtn: document.getElementById('backToSearch'),
    sheet: document.getElementById('translationSheet'),
    overlay: document.getElementById('modalOverlay'),
    closeSheet: document.getElementById('closeSheet'),
    transLoading: document.getElementById('transLoading'),
    transResult: document.getElementById('transResult'),
    sentenceDisplay: document.getElementById('sentenceDisplay'),
    burmeseMean: document.getElementById('burmeseMean'),
    burmeseExpl: document.getElementById('burmeseExpl'),
    burmeseVocab: document.getElementById('burmeseVocab'),
    japaneseMean: document.getElementById('japaneseMean'),
    japaneseExpl: document.getElementById('japaneseExpl'),
    japaneseVocab: document.getElementById('japaneseVocab'),
    cardBurmese: document.getElementById('card-burmese'),
    cardJapanese: document.getElementById('card-japanese'),
    toggleBurmese: document.getElementById('sheet-toggle-burmese'),
    toggleJapanese: document.getElementById('sheet-toggle-japanese'),
    logoutBtn: document.getElementById('logoutBtn')
};

function toggleLang(lang) {
    activeLangs[lang] = !activeLangs[lang];

    // Ensure at least one is active
    if (!activeLangs.burmese && !activeLangs.japanese) {
        activeLangs[lang] = true; // Revert
        const toggleEl = document.getElementById(`sheet-toggle-${lang}`);
        if (toggleEl) toggleEl.checked = true;
        return;
    }

    updateLangUI();

    // If the sheet is currently visible, adjust layout immediately
    if (!el.sheet.classList.contains('hidden')) {
        updateSheetLayout();
    }
}

function updateLangUI() {
    ['burmese', 'japanese'].forEach(lang => {
        const btn = document.getElementById(`btn-${lang}`);
        const toggle = document.getElementById(`sheet-toggle-${lang}`);

        const isActive = activeLangs[lang];

        if (btn) {
            if (isActive) {
                btn.className = `text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${lang === 'burmese' ? 'bg-blue-600' : 'bg-purple-600'} text-white`;
            } else {
                btn.className = `text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all bg-zinc-800 text-zinc-500`;
            }
        }

        if (toggle) {
            toggle.checked = isActive;
        }
    });
}

function updateSheetLayout() {
    if (activeLangs.burmese && activeLangs.japanese) {
        el.transResult.className = "hidden grid grid-cols-1 md:grid-cols-2 gap-6";
    } else {
        el.transResult.className = "hidden grid grid-cols-1 gap-6";
    }

    el.cardBurmese.classList.toggle('hidden', !activeLangs.burmese);
    el.cardJapanese.classList.toggle('hidden', !activeLangs.japanese);

    // If result is shown, make sure it stays shown (unhide the grid container)
    if (!el.transLoading.classList.contains('hidden')) {
        // Keep hidden until fetch completes
    } else {
        el.transResult.classList.remove('hidden');
    }
}

async function fetchGemini(prompt, system, isJson = false) {
    const apiKey = await getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: system }] }
    };

    if (isJson) {
        payload.generationConfig = { responseMimeType: "application/json" };
    }

    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error?.message || "API Request Failed");
            return data.candidates[0].content.parts[0].text;
        } catch (err) {
            if (i === 4) throw err;
            await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        }
    }
}

async function getLyrics(query) {
    if (!query) return;
    toggleUI('loading');
    el.loadingMsg.textContent = `Finding official lyrics for "${query}"...`;

    try {
        const system = "You are a professional music archivist. Provide the official lyrics for the requested song. Format: JSON with keys 'title', 'artist', 'lyrics' (array of lines).";
        const responseText = await fetchGemini(`Find lyrics for: ${query}`, system, true);
        const data = JSON.parse(responseText);

        if (!data.lyrics || data.lyrics.length === 0) throw new Error("Lyrics not found.");

        renderLyrics(data);
        toggleUI('lyrics');
    } catch (err) {
        showError(err.message);
        toggleUI('search');
    }
}

function renderLyrics(data) {
    el.metaTitle.textContent = data.title;
    el.metaArtist.textContent = data.artist;
    el.lyricsContainer.innerHTML = '';

    data.lyrics.forEach(line => {
        if (!line.trim()) {
            const spacer = document.createElement('div');
            spacer.className = "h-6";
            el.lyricsContainer.appendChild(spacer);
            return;
        }

        const lineDiv = document.createElement('div');
        lineDiv.className = "lyric-line";
        lineDiv.textContent = line;

        lineDiv.onclick = () => {
            document.querySelectorAll('.lyric-line').forEach(l => l.classList.remove('active'));
            lineDiv.classList.add('active');
            openTranslation(line);
        };

        el.lyricsContainer.appendChild(lineDiv);
    });
}

async function openTranslation(sentence) {
    el.sheet.classList.remove('hidden');
    el.overlay.classList.remove('hidden');
    setTimeout(() => {
        el.overlay.style.opacity = '1';
        el.sheet.classList.remove('sheet-hidden');
    }, 10);

    el.transLoading.classList.remove('hidden');
    el.transResult.classList.add('hidden');
    el.sentenceDisplay.textContent = sentence;

    updateLangUI();
    updateSheetLayout();

    try {
        const system = `You are a professional translator. 
        Translate the English lyric sentence into Burmese and Japanese.
        IMPORTANT: For vocabulary entries, ALWAYS put the English word in the "word" key and the translation in the "mean" key.
        Response format: JSON { 
            "burmese": { "mean": "Burmese translation", "expl": "...", "vocabulary": [{"word": "English word", "mean": "Burmese translation"}] }, 
            "japanese": { "mean": "Japanese translation", "expl": "...", "vocabulary": [{"word": "English word", "mean": "Japanese translation"}] } 
        }`;

        const response = await fetchGemini(`Translate: "${sentence}"`, system, true);
        const data = JSON.parse(response);

        // Populate Burmese
        el.burmeseMean.textContent = data.burmese.mean;
        el.burmeseExpl.textContent = data.burmese.expl;
        el.burmeseVocab.innerHTML = '';
        data.burmese.vocabulary.forEach(v => {
            const item = document.createElement('div');
            item.className = "flex justify-between items-center text-xs bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50";
            item.innerHTML = `<span class="font-bold text-blue-400">${v.word}</span> <span class="text-zinc-300 text-right ml-2">${v.mean}</span>`;
            el.burmeseVocab.appendChild(item);
        });

        // Populate Japanese
        el.japaneseMean.textContent = data.japanese.mean;
        el.japaneseExpl.textContent = data.japanese.expl;
        el.japaneseVocab.innerHTML = '';
        data.japanese.vocabulary.forEach(v => {
            const item = document.createElement('div');
            item.className = "flex justify-between items-center text-xs bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/50";
            item.innerHTML = `<span class="font-bold text-purple-400">${v.word}</span> <span class="text-zinc-300 text-right ml-2">${v.mean}</span>`;
            el.japaneseVocab.appendChild(item);
        });

        el.transLoading.classList.add('hidden');
        updateSheetLayout(); // This unhides the result grid
    } catch (err) {
        el.burmeseMean.textContent = "Error";
        el.burmeseExpl.textContent = "Failed to translate.";
        el.transLoading.classList.add('hidden');
        updateSheetLayout();
    }
}

function toggleUI(state) {
    el.searchView.classList.toggle('hidden', state !== 'search');
    el.loadingUI.classList.toggle('hidden', state !== 'loading');
    el.lyricsView.classList.toggle('hidden', state !== 'lyrics');
}

function showError(msg) {
    el.errorBox.textContent = msg;
    el.errorBox.classList.remove('hidden');
    setTimeout(() => el.errorBox.classList.add('hidden'), 5000);
}

function closeTranslation() {
    el.sheet.classList.add('sheet-hidden');
    el.overlay.style.opacity = '0';
    setTimeout(() => {
        el.overlay.classList.add('hidden');
        el.sheet.classList.add('hidden');
        document.querySelectorAll('.lyric-line').forEach(l => l.classList.remove('active'));
    }, 500);
}

// el.songInput.onkeypress = (e) => e.key === 'Enter' && getLyrics(el.songInput.value.trim());
// el.backBtn.onclick = () => {
//     toggleUI('search');
//     el.songInput.focus();
// };
// el.closeSheet.onclick = closeTranslation;
// el.overlay.onclick = closeTranslation;

// Initialize UI
updateLangUI();

// function logout() {
//     console.log("Logging out...");
//     document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     window.location.href = getBasePath() + "admin/login/";
// }

// el.logoutBtn.addEventListener("click", logout);