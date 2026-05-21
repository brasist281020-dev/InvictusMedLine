let state = { mode: 'full', questions: [], answers: {}, score: 0, startTime: null, timerInterval: null };
let localMistakes = JSON.parse(localStorage.getItem('invictus_mistakes') || '[]');
let localBookmarks = JSON.parse(localStorage.getItem('invictus_bookmarks') || '[]');
let localStats = JSON.parse(localStorage.getItem('invictus_stats') || '{"total":0, "correct":0}');
let pendingQuizConfig = null;

let easterEggClicks = 0;
let easterEggTimer = null;
let easterEggAudio = null;

function handleEasterEgg() {
    if (!easterEggAudio) easterEggAudio = new Audio('6%207.mp3');
    easterEggClicks++;
    if (easterEggClicks === 3) {
        easterEggAudio.currentTime = 0;
        easterEggAudio.play().catch(e => console.log("Audio play failed:", e));
        easterEggClicks = 0;
    }
    clearTimeout(easterEggTimer);
    easterEggTimer = setTimeout(() => { easterEggClicks = 0; }, 1000);
}

let activeDbConfig = null;
let activeDbData = null;

function loadDatabaseScript() {
    if (typeof MODULE_DATABASES === 'undefined' || MODULE_DATABASES.length === 0) {
        // Fallback for pages without MODULE_DATABASES
        if (typeof TEST_DATA !== 'undefined') activeDbData = TEST_DATA;
        else if (typeof TEST_DATA_2025 !== 'undefined') activeDbData = TEST_DATA_2025;
        initQuizApp();
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const dbId = urlParams.get('db') || MODULE_DATABASES[0].id;
    activeDbConfig = MODULE_DATABASES.find(db => db.id === dbId) || MODULE_DATABASES[0];

    const script = document.createElement('script');
    script.src = activeDbConfig.file + '?v=' + new Date().getTime(); // Cache busting
    script.onload = () => {
        try {
            activeDbData = eval(activeDbConfig.varName);
        } catch (e) {
            console.error("DB Eval Error:", e);
        }
        initQuizApp();
    };
    script.onerror = () => {
        alert("Помилка завантаження бази тестів: " + activeDbConfig.file);
    };
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    loadDatabaseScript();
});

function getActiveDB() {
    return activeDbData;
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const sunIcon = document.getElementById('theme-icon-light');
    const moonIcon = document.getElementById('theme-icon-dark');
    const sunIconMobile = document.getElementById('theme-icon-light-mobile');
    const moonIconMobile = document.getElementById('theme-icon-dark-mobile');

    if (theme === 'dark') {
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        if (sunIconMobile) sunIconMobile.classList.remove('hidden');
        if (moonIconMobile) moonIconMobile.classList.add('hidden');
    } else {
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (sunIconMobile) sunIconMobile.classList.add('hidden');
        if (moonIconMobile) moonIconMobile.classList.remove('hidden');
    }
}

function initQuizApp() {
    initTheme();

    const yearSelect = document.getElementById('year-select');
    if (yearSelect && typeof MODULE_DATABASES !== 'undefined') {
        yearSelect.innerHTML = MODULE_DATABASES.map(db => 
            `<option value="${db.id}" ${activeDbConfig && db.id === activeDbConfig.id ? 'selected' : ''}>${db.title}</option>`
        ).join('');
        
        yearSelect.onchange = (e) => {
            window.location.search = '?db=' + e.target.value;
        };
    }

    const select = document.getElementById('learn-chunk');
    if (!select) return;

    const db = getActiveDB();

    if (!db) {
        select.innerHTML = `<option value="">Помилка: Базу тестів не знайдено!</option>`;
        select.style.color = "var(--wrong-red)";
        return;
    }

    const total = db.questions.length;
    select.innerHTML = `<option value="0-${total}">Усі ${total} питань (Повний цикл)</option>`;

    for (let i = 0; i < total; i += 10) {
        const start = i;
        const end = Math.min(i + 10, total);
        select.innerHTML += `<option value="${start}-${end}">Спринт-модуль: Питання ${start + 1} - ${end}</option>`;
    }

    const catSelect = document.getElementById('category-select');
    if (catSelect && db.categories) {
        Object.entries(db.categories).forEach(([key, val]) => {
            catSelect.innerHTML += `<option value="${key}">${val}</option>`;
        });
    }
    updateLocalUI();
}

function updateLocalUI() {
    const countEl = document.getElementById('mistakes-count');
    const btnEl = document.getElementById('btn-mistakes');
    if (countEl) countEl.innerText = localMistakes.length;
    if (btnEl) btnEl.disabled = localMistakes.length === 0;

    const bCountEl = document.getElementById('bookmarks-count');
    const bBtnEl = document.getElementById('btn-bookmarks');
    if (bCountEl) bCountEl.innerText = localBookmarks.length;
    if (bBtnEl) bBtnEl.disabled = localBookmarks.length === 0;

    const stTotal = document.getElementById('stat-total');
    const stCorr = document.getElementById('stat-correct');
    const stAcc = document.getElementById('stat-accuracy');
    if (stTotal) stTotal.innerText = localStats.total;
    if (stCorr) stCorr.innerText = localStats.correct;
    if (stAcc) {
        const acc = localStats.total > 0 ? Math.round((localStats.correct / localStats.total) * 100) : 0;
        stAcc.innerText = `${acc}%`;
    }
}

function toggleStatsModal() { document.getElementById('stats-modal').classList.toggle('hidden'); }

function clearStats() {
    if (confirm('Очистити всю статистику, збережені питання та базу помилок? (Дію неможливо скасувати)')) {
        localMistakes = []; localBookmarks = []; localStats = { total: 0, correct: 0 };
        localStorage.setItem('invictus_mistakes', JSON.stringify(localMistakes));
        localStorage.setItem('invictus_bookmarks', JSON.stringify(localBookmarks));
        localStorage.setItem('invictus_stats', JSON.stringify(localStats));
        updateLocalUI(); toggleStatsModal();
    }
}

function requestQuizStart(mode, count = 150) {
    const db = getActiveDB();
    if (!db) {
        alert("Критична помилка: Базу даних не підключено!"); return;
    }
    pendingQuizConfig = { mode, count };

    const modal = document.getElementById('disclaimer-modal');
    const content = document.getElementById('disclaimer-content');
    modal.classList.remove('hidden'); modal.classList.add('flex');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function acceptDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    const content = document.getElementById('disclaimer-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.remove('flex'); modal.classList.add('hidden');
        if (pendingQuizConfig) {
            initQuiz(pendingQuizConfig.mode, pendingQuizConfig.count);
            pendingQuizConfig = null;
        }
    }, 300);
}

function cancelDisclaimer() {
    const modal = document.getElementById('disclaimer-modal');
    const content = document.getElementById('disclaimer-content');
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.remove('flex'); modal.classList.add('hidden');
        pendingQuizConfig = null;
    }, 300);
}

function toggleMobileNav() {
    document.getElementById('nav-sidebar').classList.toggle('active');
    document.getElementById('nav-overlay').classList.toggle('active');
}

function initQuiz(mode, count) {
    state.mode = mode; state.answers = {}; state.score = 0;
    const db = getActiveDB();

    if (mode === 'mistakes') {
        let pool = db.questions.filter(q => localMistakes.includes(q.text));
        if (pool.length === 0) { alert("У вас немає невідпрацьованих помилок!"); return; }
        pool = pool.sort(() => 0.5 - Math.random());
        state.questions = pool.map((q, idx) => {
            let opts = q.options.map((text, i) => ({ text, isCorrect: i === q.correct })).sort(() => 0.5 - Math.random());
            return { ...q, options: opts.map(o => o.text), correct: opts.findIndex(o => o.isCorrect), displayNumber: idx + 1 };
        });
        document.getElementById('mode-label').innerText = `Робота над помилками: ${pool.length} Q`;
    }
    else if (mode === 'bookmarks') {
        let pool = db.questions.filter(q => localBookmarks.includes(q.text));
        if (pool.length === 0) { alert("У вас немає збережених питань!"); return; }
        pool = pool.sort(() => 0.5 - Math.random());
        state.questions = pool.map((q, idx) => {
            let opts = q.options.map((text, i) => ({ text, isCorrect: i === q.correct })).sort(() => 0.5 - Math.random());
            return { ...q, options: opts.map(o => o.text), correct: opts.findIndex(o => o.isCorrect), displayNumber: idx + 1 };
        });
        document.getElementById('mode-label').innerText = `Збережені питання: ${pool.length} Q`;
    }
    else if (mode === 'sim') {
        state.questions = [...db.questions].sort(() => 0.5 - Math.random()).slice(0, count).map((q, idx) => {
            let opts = q.options.map((text, i) => ({ text, isCorrect: i === q.correct })).sort(() => 0.5 - Math.random());
            return { ...q, options: opts.map(o => o.text), correct: opts.findIndex(o => o.isCorrect), displayNumber: idx + 1 };
        });
        document.getElementById('mode-label').innerText = `Режим симуляції: ${count} Q`;
    } else {
        const chunkValue = document.getElementById('learn-chunk').value;
        if (!chunkValue) return;
        const [start, end] = chunkValue.split('-').map(Number);
        const isShuffleQuestions = document.getElementById('shuffle-questions').checked;
        const isShuffleOptions = document.getElementById('shuffle-options').checked;
        const catFilter = document.getElementById('category-select').value;

        let sliced = db.questions.slice(start, end);
        if (catFilter !== 'all') sliced = sliced.filter(q => q.category === catFilter);
        if (sliced.length === 0) { alert("У цьому модулі немає питань обраної категорії."); return; }
        if (isShuffleQuestions) sliced = sliced.sort(() => 0.5 - Math.random());

        state.questions = sliced.map((q, idx) => {
            let opts = q.options.map((text, i) => ({ text, isCorrect: i === q.correct }));
            if (isShuffleOptions) { opts = opts.sort(() => 0.5 - Math.random()); }
            else { opts = [opts.find(o => o.isCorrect), ...opts.filter(o => !o.isCorrect)]; }
            return { ...q, options: opts.map(o => o.text), correct: opts.findIndex(o => o.isCorrect), displayNumber: idx + 1 };
        });
        document.getElementById('mode-label').innerText = `Режим навчання: Q ${start + 1}-${end}`;
    }

    renderQuizList();

    document.getElementById('header-start').classList.add('hidden');
    document.getElementById('header-quiz').classList.remove('hidden');

    showScreen('quiz-screen');
    window.scrollTo({ top: 0, behavior: 'instant' });
    startTimer();
    if (window.MathJax) MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

function normalizeQuestionText(text) {
    if (text === text.toUpperCase() && text.length > 10) return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    return text;
}

function renderQuizList() {
    const list = document.getElementById('quiz-list');
    const nav = document.getElementById('nav-dots');
    list.innerHTML = ''; nav.innerHTML = '';
    const db = getActiveDB();
    const catMap = db.categories || {};

    state.questions.forEach((q, qIdx) => {
        const item = document.createElement('div');
        item.id = `q-${qIdx}`;
        item.className = 'quiz-item animate-in slide-in-from-bottom-8 duration-500';
        const cleanText = normalizeQuestionText(q.text);

        item.innerHTML = `
            <div class="flex justify-between items-center mb-6 border-b pb-4" style="border-color: var(--border-color);">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] italic ${q.displayNumber === 67 ? 'cursor-pointer select-none' : ''}" ${q.displayNumber === 67 ? 'onclick="handleEasterEgg()"' : ''} style="color: var(--accent-color-hover);">Питання №${q.displayNumber}</span>
                <div class="flex items-center space-x-3">
                    <span class="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border" style="background: var(--bg-main); border-color: var(--border-color); color: var(--text-dim);">${state.mode === 'sim' ? "СИМУЛЯЦІЯ" : (catMap[q.category] || "Загальна")}</span>
                    <button onclick="toggleBookmark(${qIdx})" id="bookmark-btn-${qIdx}" class="text-xl md:text-2xl transition-transform hover:scale-110 focus:outline-none" style="color: ${localBookmarks.includes(q.text) ? 'var(--accent-color)' : 'var(--border-color)'};">
                        ${localBookmarks.includes(q.text) ? '★' : '☆'}
                    </button>
                </div>
            </div>
            <p class="question-content text-base md:text-xl font-black text-left tracking-tight" style="color: var(--text-main);">${cleanText}</p>
            <div class="options-container space-y-3 mt-8" id="opts-${qIdx}">
                ${q.options.map((opt, oIdx) => `
                    <button onclick="handleSelect(${qIdx}, ${oIdx})" class="option-btn group/opt" id="q-${qIdx}-o-${oIdx}">
                        <span class="font-black mr-5 text-xl" style="color: var(--accent-color-hover);">${String.fromCharCode(65 + oIdx)}</span>
                        <span class="font-bold tracking-tight text-transform-none">${opt}</span>
                    </button>
                `).join('')}
            </div>
            ${state.mode === 'sim' ? '' : `
            <div class="mt-6 flex flex-wrap gap-3">
                <button onclick="getAIExplanation(${qIdx})" class="flex items-center space-x-2 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[var(--card-border)]" style="background: var(--bg-main); border-color: var(--border-color); color: var(--text-dim);">
                    <span>✨ Пояснення</span>
                </button>
            </div>
            `}
            <div id="ai-res-${qIdx}" data-typing="false" class="hidden mt-4 p-5 border-l-4 rounded-r-2xl text-sm italic leading-relaxed shadow-inner" style="background: var(--bg-main); border-color: var(--accent-color); color: var(--text-main);"></div>
        `;
        list.appendChild(item);

        const dot = document.createElement('div');
        dot.className = 'nav-dot shadow-inner';
        dot.id = `dot-${qIdx}`; dot.innerText = q.displayNumber;
        dot.onclick = () => {
            const el = document.getElementById(`q-${qIdx}`);
            const offset = window.innerWidth < 1024 ? 90 : 110;
            const offsetPosition = (el.getBoundingClientRect().top - document.body.getBoundingClientRect().top) - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            if (window.innerWidth < 1024) toggleMobileNav();
        };
        nav.appendChild(dot);
    });

    const finishBtnContainer = document.createElement('div');
    finishBtnContainer.id = 'final-finish-btn-container';
    finishBtnContainer.className = 'mt-12 text-center pb-12 hidden opacity-0 transition-opacity duration-1000';
    finishBtnContainer.innerHTML = `<button onclick="finishQuiz(true)" class="btn-accent px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 text-sm">Завершити тестування</button>`;
    list.appendChild(finishBtnContainer);

    document.getElementById('answered-count').innerText = `0 / ${state.questions.length}`;
}

function toggleBookmark(qIdx) {
    const qText = state.questions[qIdx].text;
    const btn = document.getElementById(`bookmark-btn-${qIdx}`);
    if (localBookmarks.includes(qText)) {
        localBookmarks = localBookmarks.filter(m => m !== qText);
        if (btn) { btn.innerText = '☆'; btn.style.color = 'var(--border-color)'; }
    } else {
        localBookmarks.push(qText);
        if (btn) { btn.innerText = '★'; btn.style.color = 'var(--accent-color)'; }
    }
    localStorage.setItem('invictus_bookmarks', JSON.stringify(localBookmarks));
    updateLocalUI();
}

function handleSelect(qIdx, oIdx) {
    if (state.answers[qIdx] !== undefined) return;
    state.answers[qIdx] = oIdx;
    const q = state.questions[qIdx];
    const container = document.getElementById(`opts-${qIdx}`);
    const buttons = container.querySelectorAll('.option-btn');
    const dot = document.getElementById(`dot-${qIdx}`);

    buttons.forEach((btn, idx) => {
        btn.classList.add('disabled');
        if (state.mode === 'sim') {
            if (idx === oIdx) {
                btn.style.borderColor = "var(--accent-color)";
                btn.style.backgroundColor = "var(--card-border)";
                if (dot) {
                    dot.classList.add('answered');
                    dot.style.borderColor = "var(--accent-color)";
                    dot.style.color = "var(--accent-color)";
                    dot.style.backgroundColor = "var(--card-border)";
                }
            }
        } else {
            if (idx === q.correct) {
                if (oIdx === q.correct) {
                    btn.classList.add('correct');
                    if (dot) dot.classList.add('answered');
                } else {
                    btn.classList.add('breathe-correct');
                    if (dot) { dot.style.borderColor = "var(--wrong-red)"; dot.style.color = "var(--wrong-red)"; }
                }
            } else if (idx === oIdx) {
                btn.classList.add('wrong');
            }
        }
    });

    localStats.total++;
    if (oIdx === q.correct) {
        localStats.correct++; localMistakes = localMistakes.filter(m => m !== q.text);
    } else {
        if (!localMistakes.includes(q.text)) localMistakes.push(q.text);
    }
    localStorage.setItem('invictus_mistakes', JSON.stringify(localMistakes));
    localStorage.setItem('invictus_stats', JSON.stringify(localStats));
    updateLocalUI();

    document.getElementById('answered-count').innerText = `${Object.keys(state.answers).length} / ${state.questions.length}`;

    if (Object.keys(state.answers).length === state.questions.length) {
        const finalBtnContainer = document.getElementById('final-finish-btn-container');
        if (finalBtnContainer) {
            finalBtnContainer.classList.remove('hidden');
            setTimeout(() => finalBtnContainer.classList.remove('opacity-0'), 50);
        }
    }
}

function startTimer() {
    state.startTime = Date.now();
    state.timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const s = (elapsed % 60).toString().padStart(2, '0');
        const timerEl = document.getElementById('timer');
        if (timerEl) timerEl.innerText = `${m}:${s}`;
    }, 1000);
}

function showScreen(id) {
    ['start-screen', 'quiz-screen', 'result-screen'].forEach(s => {
        const screen = document.getElementById(s);
        if (screen) screen.classList.add('hidden');
    });
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
}

function finishQuiz(force = false) {
    const totalQuestions = state.questions.length;
    const answeredCount = Object.keys(state.answers).length;
    if (!force && answeredCount < totalQuestions) {
        openConfirmModal();
        return;
    }

    clearInterval(state.timerInterval);
    let correctCount = 0; const catStats = {};

    state.questions.forEach((q, idx) => {
        if (!catStats[q.category]) catStats[q.category] = { correct: 0, total: 0 };
        catStats[q.category].total++;
        if (state.answers[idx] === q.correct) { correctCount++; catStats[q.category].correct++; }
    });

    const percentValue = (correctCount / totalQuestions) * 100;
    const circle = document.getElementById('res-circle');
    const status = document.getElementById('res-status');
    document.getElementById('res-percent').innerText = `${percentValue.toFixed(1)}%`;

    circle.className = 'w-48 h-48 md:w-56 md:h-56 rounded-full border-[10px] flex flex-col items-center justify-center';
    if (percentValue >= 66.0) {
        circle.classList.add('pulse-correct'); status.innerText = 'СКЛАДЕНО'; status.style.color = "var(--correct-green)";
    } else {
        circle.classList.add('pulse-wrong'); status.innerText = 'НЕ СКЛАДЕНО'; status.style.color = "var(--wrong-red)";
    }

    const catContainer = document.getElementById('res-categories');
    catContainer.innerHTML = '';
    const db = getActiveDB();
    const catMap = db.categories || {};

    Object.keys(catStats).forEach(key => {
        const s = catStats[key]; const p = (s.correct / s.total) * 100;
        catContainer.innerHTML += `
            <div class="space-y-3">
                <div class="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                    <span style="color: var(--text-dim);">${catMap[key] || key}</span>
                    <span class="${p < 66 ? '' : ''} font-black text-xs" style="color: ${p < 66 ? 'var(--wrong-red)' : 'var(--correct-green)'}">${p.toFixed(0)}%</span>
                </div>
                <div class="w-full h-2 rounded-full overflow-hidden border shadow-inner" style="background: var(--bg-main); border-color: var(--border-color);">
                    <div class="h-full transition-all duration-1000 shadow-lg" style="width: ${p}%; background: ${p < 66 ? 'var(--wrong-red)' : 'var(--correct-green)'}"></div>
                </div>
            </div>
        `;
    });

    document.getElementById('header-quiz').classList.add('hidden');
    showScreen('result-screen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function getAIExplanation(qIdx) {
    const q = state.questions[qIdx];
    const resBox = document.getElementById(`ai-res-${qIdx}`);
    if (resBox.dataset.typing === "true") return;
    resBox.dataset.typing = "true";

    resBox.classList.remove('hidden');
    resBox.innerHTML = '<span class="animate-pulse font-bold" style="color: var(--accent-color-hover);">Аналіз клінічної картини...</span>';

    const questionEl = document.querySelector(`#q-${qIdx} .question-content`);
    if (questionEl) questionEl.classList.add('show-keywords');

    await new Promise(resolve => setTimeout(resolve, 800));

    const explanationText = q.explanation || "Дані для цього клінічного випадку відсутні в локальній базі.";
    const prefixHTML = `<strong class="uppercase tracking-widest text-[10px] mb-2 block" style="color: var(--accent-color-hover);">Коментар:</strong> `;

    resBox.innerHTML = prefixHTML + '<span id="typewriter-' + qIdx + '" style="color: var(--accent-color-hover); font-weight: bold; transition: color 1s ease, font-weight 1s ease;"></span><span id="cursor-' + qIdx + '" class="animate-pulse font-bold" style="color: var(--accent-color-hover);">_</span>';
    const typeContainer = document.getElementById(`typewriter-${qIdx}`);
    const cursor = document.getElementById(`cursor-${qIdx}`);

    let i = 0;
    function typeWriter() {
        if (i < explanationText.length) {
            if (explanationText.charAt(i) === '<') {
                const tagEnd = explanationText.indexOf('>', i);
                if (tagEnd !== -1) {
                    i = tagEnd + 1;
                } else {
                    i++;
                }
            } else {
                i++;
            }
            typeContainer.innerHTML = explanationText.substring(0, i);
            setTimeout(typeWriter, 10);
        } else {
            resBox.dataset.typing = "false";
            cursor.classList.add('hidden');
            typeContainer.style.color = "var(--text-dim)";
            typeContainer.style.fontWeight = "normal";
            if (window.MathJax) MathJax.Hub.Queue(["Typeset", MathJax.Hub, resBox]);
        }
    }
    typeWriter();
}

function toggleFavoritePage(url, title) {
    let favs = JSON.parse(localStorage.getItem('invictus_favorite_pages') || '[]');
    const exists = favs.find(f => f.url === url);
    if (exists) {
        favs = favs.filter(f => f.url !== url);
    } else {
        if (favs.length >= 10) { alert('Максимум 10 віджетів!'); return; }
        favs.push({ url, title });
    }
    localStorage.setItem('invictus_favorite_pages', JSON.stringify(favs));
    updateFavoriteStar(url);
}

function updateFavoriteStar(url) {
    let favs = JSON.parse(localStorage.getItem('invictus_favorite_pages') || '[]');
    const btn = document.getElementById('btn-favorite-page');
    if (!btn) return;
    if (favs.find(f => f.url === url)) {
        btn.innerText = '★'; btn.style.color = 'var(--accent-color)';
        btn.classList.add('pulse-correct'); setTimeout(() => btn.classList.remove('pulse-correct'), 1000);
    } else {
        btn.innerText = '☆'; btn.style.color = 'var(--text-dim)';
    }
}



document.addEventListener('DOMContentLoaded', () => { 
    const p = window.location.pathname.split('/').pop();
    if(p) updateFavoriteStar(p);
});

function openConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    const content = document.getElementById('confirm-modal-content');
    if (modal && content) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            content.classList.remove('scale-95', 'opacity-0');
            content.classList.add('scale-100', 'opacity-100');
        }, 10);
    }
}

function closeConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    const content = document.getElementById('confirm-modal-content');
    if (modal && content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
        }, 300);
    }
}

function confirmFinishQuiz() {
    closeConfirmModal();
    setTimeout(() => {
        finishQuiz(true);
    }, 300);
}