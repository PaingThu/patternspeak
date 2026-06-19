import {logo, homePageLogo} from "./config.js";
const imgElement = document.querySelector('#logo-img');
imgElement.src = logo;
const homePageImgElement = document.querySelector('#homepageLogo');
homePageImgElement.src = homePageLogo;

/* Global Variables and State Configuration */
let currentLanguage = 'en'; 
let activePatternId = null;
let masteredPatterns = JSON.parse(localStorage.getItem('ps_mastered')) || [];
let currentQuizIndex = 0; 
let quizScore = 0;
let selectedWordBlocks = [];
let selectedLevelFilter = 'all';
let searchQuery = '';
let synthVoices = [];

// The entire multi-language text dictionary database
const localization = {
    en: {
        "tagline": "Master English through speaking patterns",
        "stats-label": "Mastered",
        "search-title": "Find Patterns",
        "filter-all": "All Levels",
        "patterns-list-title": "Explore Patterns",
        "select-prompt-title": "Ready to Learn?",
        "select-prompt-desc": "Pick an exciting pattern from the menu on the left to start your English speaking adventure today!",
        "pattern-prefix": "Formula:",
        "desc-title": "Meaning & Nuance",
        "tab-examples": "Learn Examples",
        "tab-practice": "Build Sentences",
        "tab-speech": "Speak & Score",
        "examples-list-head": "10 Real-world Examples",
        "examples-list-sub": "Listen to the native voice and try mimicking it aloud.",
        "voice-speed-label": "Speed:",
        "scramble-title": "Build the Sentence",
        "scramble-desc": "Tap the words in the correct order to match the translation.",
        "translation-prompt": "Translate This:",
        "scramble-your-ans": "Your Answer:",
        "scramble-source-lbl": "Tap Words Below:",
        "btn-skip": "Skip Puzzle",
        "btn-restart": "Reset",
        "btn-check": "Check",
        "speech-title": "Speak & Score",
        "speech-desc": "Test your pronunciation. Choose a sentence, hit the mic, and speak clearly!",
        "speech-select-lbl": "Select Target Sentence:",
        "speaking-target": "Target Phrase",
        "record-idle": "TAP MIC TO SPEAK",
        "record-listening": "LISTENING... SPEAK NOW",
        "speech-heard": "WE HEARD:",
        "speech-acc": "Accuracy Score:",
        "mastered": "Mastered!",
        "in-progress": "Mark Completed",
        "toast-mastered": "Awesome! Pattern marked as Completed. 🎉",
        "toast-unmastered": "Pattern moved back to In Progress.",
        "toast-reset": "All progress has been reset. Fresh start!",
        "scramble-correct": "Brilliant! You nailed it! 🌟",
        "scramble-incorrect": "Oops! Not quite right. Keep trying!",
        "scramble-partial": "Almost there! Try rearranging a bit.",
        "speech-great": "Incredible! You sound like a native speaker! 🏆",
        "speech-good": "Good pronunciation! Just a tiny bit of polish needed. 👍",
        "speech-try-again": "We didn't quite catch that. Give it another try! 💪"
    },
    ja: {
        "tagline": "スピーキングパターンで英語を効率よくマスター",
        "stats-label": "完了済み",
        "search-title": "パターンを検索",
        "filter-all": "すべてのレベル",
        "patterns-list-title": "パターン一覧",
        "select-prompt-title": "準備はいいですか？",
        "select-prompt-desc": "左のメニューから気になるパターンを選んで、スピーキングの冒険を始めましょう！",
        "pattern-prefix": "公式:",
        "desc-title": "意味とニュアンス",
        "tab-examples": "例文で学ぶ",
        "tab-practice": "文法クイズ",
        "tab-speech": "発音テスト",
        "examples-list-head": "10個の実用例文",
        "examples-list-sub": "ネイティブの音声を聞いて、声に出して真似してみましょう。",
        "voice-speed-label": "音声速度:",
        "scramble-title": "文構造組み立てトレーニング",
        "scramble-desc": "日本語の翻訳に合わせて、下の単語を正しい順番でタップしてください。",
        "translation-prompt": "これを英訳しよう:",
        "scramble-your-ans": "あなたの解答:",
        "scramble-source-lbl": "単語をタップ:",
        "btn-skip": "スキップ",
        "btn-restart": "やり直す",
        "btn-check": "チェック",
        "speech-title": "発音テスト & スコア",
        "speech-desc": "あなたの発音をチェック！文章を選んでマイクをタップし、ハッキリ話してください。",
        "speech-select-lbl": "練習する文章を選択:",
        "speaking-target": "お題のフレーズ",
        "record-idle": "マイクをタップして話す",
        "record-listening": "聞き取り中... 話してください",
        "speech-heard": "聞き取った音声:",
        "speech-acc": "正確性スコア:",
        "mastered": "習得済み！",
        "in-progress": "完了にする",
        "toast-mastered": "素晴らしい！このパターンを完了しました 🎉",
        "toast-unmastered": "進行中の学習に戻しました。",
        "toast-reset": "学習データがすべてリセットされました。",
        "scramble-correct": "大正解！完璧です！ 🌟",
        "scramble-incorrect": "おっと！違います。もう一度トライ！",
        "scramble-partial": "惜しい！順番を見直してみましょう。",
        "speech-great": "信じられない！ネイティブみたいな発音です！ 🏆",
        "speech-good": "良い発音です！あと少しで完璧です。 👍",
        "speech-try-again": "上手く聞き取れませんでした。もう一度チャレンジ！ 💪"
    },
    my: {
        "tagline": "ပြောဆိုမှု ပုံစံများမှတစ်ဆင့် အင်္ဂလိပ်စာကို ကျွမ်းကျင်အောင်လေ့လာပါ",
        "stats-label": "ပြီးစီးမှု",
        "search-title": "ပုံစံများကို ရှာဖွေပါ",
        "filter-all": "အဆင့်အားလုံး",
        "patterns-list-title": "အင်္ဂလိပ်ပုံစံများ စာရင်း",
        "select-prompt-title": "လေ့လာရန် အဆင်သင့်ဖြစ်ပြီလား?",
        "select-prompt-desc": "ဘယ်ဘက်ရှိ မီနူးမှ ပုံစံတစ်ခုကို ရွေးချယ်ပြီး ယနေ့ပင် စတင်လေ့လာလိုက်ပါ!",
        "pattern-prefix": "ဖော်မြူလာ:",
        "desc-title": "အဓိပ္ပါယ်နှင့် သုံးစွဲပုံ",
        "tab-examples": "နမူနာများ",
        "tab-practice": "ဝါကျတည်ဆောက်ခြင်း",
        "tab-speech": "အသံထွက်စစ်ဆေးခြင်း",
        "examples-list-head": "လက်တွေ့သုံး နမူနာဝါကျ ၁၀ ခု",
        "examples-list-sub": "အသံထွက်ကို နားထောင်ပြီး အသံထွက်ဖတ်ကြည့်ပါ။",
        "voice-speed-label": "အသံနှုန်း:",
        "scramble-title": "ဝါကျတည်ဆောက်ခြင်း ဂိမ်း",
        "scramble-desc": "ဘာသာပြန်နှင့်ကိုက်ညီအောင် စကားလုံးများကို မှန်ကန်သော အစီအစဉ်အတိုင်း ရွေးချယ်ပါ။",
        "translation-prompt": "အင်္ဂလိပ်လို ပြန်ဆိုပါ:",
        "scramble-your-ans": "သင်၏အဖြေ:",
        "scramble-source-lbl": "စကားလုံးများကို နှိပ်ပါ:",
        "btn-skip": "ကျော်မည်",
        "btn-restart": "ပြန်စမည်",
        "btn-check": "စစ်ဆေးမည်",
        "speech-title": "အသံထွက်စစ်ဆေးခြင်း",
        "speech-desc": "ဝါကျကိုရွေးချယ်ပြီး မိုက်ကိုနှိပ်ကာ ရှင်းလင်းစွာ ပြောဆိုပါ။",
        "speech-select-lbl": "ဝါကျကို ရွေးပါ:",
        "speaking-target": "ရည်မှန်းချက် ဝါကျ",
        "record-idle": "မိုက်ကိုနှိပ်ပြီး ပြောပါ",
        "record-listening": "နားထောင်နေသည်... ယခုပြောပါ",
        "speech-heard": "ကြားရသော အသံ:",
        "speech-acc": "မှန်ကန်မှု ရာခိုင်နှုန်း:",
        "mastered": "ကျွမ်းကျင်ပြီးပြီ!",
        "in-progress": "ပြီးမြောက်ကြောင်း မှတ်မည်",
        "toast-mastered": "အောင်မြင်ပါသည်! ဤပုံစံကို ပြီးမြောက်ကြောင်း မှတ်လိုက်ပါပြီ 🎉",
        "toast-unmastered": "လေ့လာဆဲအဖြစ် ပြန်လည်ပြောင်းလဲလိုက်သည်။",
        "toast-reset": "အချက်အလက်များ အားလုံးကို မူလအတိုင်း ပြန်သတ်မှတ်လိုက်ပါပြီ။",
        "scramble-correct": "အရမ်းတော်ပါတယ်! အဖြေမှန်ကန်ပါသည်။ 🌟",
        "scramble-incorrect": "မှားယွင်းနေပါသည်။ ထပ်မံ ကြိုးစားကြည့်ပါ!",
        "scramble-partial": "နီးစပ်နေပါပြီ။ အစီအစဉ်ကို ပြန်စဉ်းစားကြည့်ပါ။",
        "speech-great": "အထူးကောင်းမွန်ပါသည်! အသံထွက် တိကျပါသည်။ 🏆",
        "speech-good": "အသံထွက် ကောင်းပါတယ်။ အနည်းငယ်သာ ပြင်ဆင်ရန်လိုသည်။ 👍",
        "speech-try-again": "သေချာမကြားရပါ။ နောက်တစ်ကြိမ် ထပ်ပြောကြည့်ပါ 💪"
    }
};

// The Speaking Patterns Data Array
const speakingPatterns = [
    {
        id: 1,
        level: "Level 1",
        title: "Subject + have/has + to + verb1",
        formula: "I have to + verb1",
        explanation: {
            en: "Used to express a strong obligation, necessity, or duty that is required from an external source or circumstance.",
            ja: "義務や、何らかの理由で「〜しなければならない」という強い必要性を伝える表現です。日常会話で頻出します。",
            my: "မဖြစ်မနေ ပြုလုပ်ဆောင်ရမည့် တာဝန်၊ လိုအပ်ချက် သို့မဟုတ် ပြင်ပအခြေအနေကြောင့် မလွဲမသွေ လုပ်ဆောင်ရန် လိုအပ်သည်ကို ဖော်ပြသည်။"
        },
        examples: [
            { en: "I have to go to work now.", ja: "もう仕事に行かなければなりません。", my: "ကျွန်တော် အခု အလုပ်သွားရမယ်။" },
            { en: "I have to finish my homework tonight.", ja: "今夜、宿題を終わらせなければなりません。", my: "ကျွန်တော် ဒီည အိမ်စာ ပြီးအောင် လုပ်ရမယ်။" },
            { en: "I have to call my mother.", ja: "母に電話しなければなりません。", my: "ကျွန်တော် အမေဆီ ဖုန်းဆက်ရမယ်။" },
            { en: "I have to wake up early tomorrow.", ja: "明日は早く起きなければなりません。", my: "မနက်ဖြန် စောစော ထရမယ်။" },
            { en: "I have to study for the English exam.", ja: "英語の試験のために勉強しなければなりません。", my: "အင်္ဂလိပ်စာ စာမေးပွဲအတွက် စာကျက်ရမယ်။" },
            { en: "I have to drink more water every day.", ja: "毎日もっと水を飲まなければなりません。", my: "နေ့တိုင်း ရေပိုသောက်ရမယ်။" },
            { en: "I have to clean my room this weekend.", ja: "今週末、部屋を掃除しなければなりません。", my: "ဒီတစ်ပတ်ပိတ်ရက်မှာ အခန်းသန့်ရှင်းရေး လုပ်ရမယ်။" },
            { en: "I have to buy some groceries.", ja: "食料品を買わなければなりません。", my: "ကုန်စုံပစ္စည်းတချို့ ဝယ်ရမယ်။" },
            { en: "I have to return this book to the library.", ja: "この本を図書館に返さなければなりません。", my: "ဒီစာအုပ်ကို စာကြည့်တိုက်ကို ပြန်ပေးရမယ်။" },
            { en: "I have to pay the bills by Friday.", ja: "金曜日までに請求書を支払わなければなりません。", my: "သောကြာနေ့ နောက်ဆုံးထားပြီး ဘေလ်တွေ ဆောင်ရမယ်။" }
        ]
    },
    {
        id: 2,
        level: "Level 1",
        title: "Planning actions",
        formula: "I am going to + verb1",
        explanation: {
            en: "Used to express future intentions, calculated plans, or predictions based on evidence that are already decided.",
            ja: "すでに決定している未来の予定や、明確な意図、または現在の状況に基づく確実な予測を伝えます。",
            my: "ကြိုတင် ဆုံးဖြတ်ထားသော အနာဂတ် ရည်ရွယ်ချက်များ သို့မဟုတ် သေချာပေါက် လုပ်ဆောင်ရန် စီစဉ်ထားသည့် ကိစ္စများကို ဖော်ပြသည်။"
        },
        examples: [
            { en: "I am going to meet my friend tomorrow.", ja: "明日、友達に会う予定です。", my: "မနက်ဖြန် ကျွန်တော့်သူငယ်ချင်းနဲ့ တွေ့ဖို့ရှိတယ်။" },
            { en: "I am going to buy a new laptop soon.", ja: "近いうちに新しいノートパソコンを買うつもりです。", my: "မကြာခင် လက်ပ်တော့အသစ်တစ်လုံး ဝယ်တော့မယ်။" },
            { en: "I am going to travel to Japan next year.", ja: "来年、日本へ旅行に行く予定です。", my: "နောက်နှစ် ဂျပန်နိုင်ငံကို ခရီးသွားဖို့ စီစဉ်ထားတယ်။" },
            { en: "I am going to cook dinner for the family.", ja: "家族のために夕食を作る予定です。", my: "မိသားစုအတွက် ညစာ ချက်ပေးမလို့ပါ။" },
            { en: "I am going to learn how to drive a car.", ja: "車の運転を習うつもりです。", my: "ကားမောင်းသင်ဖို့ စိတ်ကူးထားတယ်။" },
            { en: "I am going to watch a movie tonight.", ja: "今夜は映画を観る予定です。", my: "ဒီည ရုပ်ရှင်ကြည့်မလို့။" },
            { en: "I am going to start a workout routine.", ja: "トレーニングの日課を始めるつもりです。", my: "ကိုယ်လက်လှုပ်ရှားမှု လေ့ကျင့်ခန်း လုပ်တော့မယ်။" },
            { en: "I am going to read this novel this week.", ja: "今週はこの小説を読むつもりです。", my: "ဒီတစ်ပတ် ဒီဝတ္ထုစာအုပ်ကို ဖတ်မလို့။" },
            { en: "I am going to join an online class.", ja: "オンライン授業に参加する予定です。", my: "အွန်လိုင်းအတန်းတစ်ခု တက်မလို့ စီစဉ်ထားတယ်။" },
            { en: "I am going to call you when I arrive.", ja: "到着したら電話しますね。", my: "ရောက်ရင် ဖုန်းလှမ်းဆက်လိုက်မယ်။" }
        ]
    },
    {
        id: 3,
        level: "Level 2",
        title: "Eager anticipation",
        formula: "I am looking forward to + noun/verb-ing",
        explanation: {
            en: "Used to describe feeling excited or happy about something that is definitely going to happen in the future.",
            ja: "将来起こる楽しい予定や嬉しい出来事について、ワクワクしながら待つ気持ちを伝える定番フレーズです。toの後ろは名詞かing形が来ます。",
            my: "အနာဂတ်တွင် ဖြစ်လာမည့် ပျော်ရွှင်စရာ ကိစ္စရပ်တစ်ခုခုကို စိတ်လှုပ်ရှားစွာ မျှော်လင့်စောင့်စားနေကြောင်း ဖော်ပြသည်။ to ၏နောက်တွင် noun (သို့) ing ပါသော verb ကို သုံးရသည်။"
        },
        examples: [
            { en: "I am looking forward to meeting you soon.", ja: "近いうちにお会いできるのを楽しみにしています。", my: "မကြာခင် မင်းနဲ့ တွေ့ဆုံရဖို့ မျှော်လင့်နေပါတယ်။" },
            { en: "I am looking forward to our trip next week.", ja: "来週の私たちの旅行を楽しみにしています。", my: "နောက်အပတ် ကျွန်တော်တို့ ခရီးစဉ်အတွက် စိတ်လှုပ်ရှားနေမိတယ်။" },
            { en: "I am looking forward to hearing from you.", ja: "お返事をお待ちしております。", my: "မင်းဆီက အကြောင်းပြန်စာကို စောင့်မျှော်နေပါတယ်။" },
            { en: "I am looking forward to eating Japanese food.", ja: "日本食を食べるのを楽しみにしています。", my: "ဂျပန်စာ စားရဖို့ မျှော်လင့်နေပါတယ်။" },
            { en: "I am looking forward to starting my new job.", ja: "新しい仕事を始めるのをワクワクして待っています。", my: "အလုပ်သစ် စတင်ရမယ့်အရေးကို စောင့်မျှော်နေပါတယ်။" },
            { en: "I am looking forward to the music festival.", ja: "音楽フェスティバルを楽しみにしています。", my: "ဂီတပွဲတော်ကြီးကို စောင့်မျှော်နေမိတယ်။" },
            { en: "I am looking forward to reading your book.", ja: "あなたのご本を読むのを楽しみにしています。", my: "မင်းရဲ့ စာအုပ်ကို ဖတ်ရဖို့ မျှော်လင့်နေပါတယ်။" },
            { en: "I am looking forward to seeing the results.", ja: "結果が出るのを楽しみにしています。", my: "ရလဒ်တွေကို မြင်တွေ့ရဖို့ စောင့်မျှော်နေပါတယ်။" },
            { en: "I am looking forward to relaxing this weekend.", ja: "今週末にリラックスできるのを楽しみにしています。", my: "ဒီတစ်ပတ် ပိတ်ရက်မှာ အပန်းဖြေရဖို့ မျှော်လင့်နေပါတယ်။" },
            { en: "I am looking forward to celebrating your birthday.", ja: "あなたの誕生日をお祝いするのを楽しみにしています。", my: "မင်းရဲ့ မွေးနေ့ကို ကျင်းပပေးဖို့ မျှော်လင့်နေပါတယ်။" }
        ]
    },
    {
        id: 4,
        level: "Level 3",
        title: "Hypothetical wishes",
        formula: "I wish I could + verb1",
        explanation: {
            en: "Used to express regret or desire about things in the present that are impossible, highly unlikely, or out of our current control.",
            ja: "現在実現不可能なこと、あるいは非常に可能性が低い望みについて、「できたらいいのに」と残念に思う気持ちを表します。",
            my: "လက်ရှိတွင် မဖြစ်နိုင်သော သို့မဟုတ် ဖြစ်နိုင်ခြေ အလွန်နည်းပါးသော အခြေအနေများအပေါ် \"လုပ်နိုင်ရင် ကောင်းမှာပဲ\" ဟု နှမြောတသ တောင့်တမိကြောင်း ဖော်ပြသည်။"
        },
        examples: [
            { en: "I wish I could speak English fluently.", ja: "英語を流暢に話せたらいいのに。", my: "အင်္ဂလိပ်လို ညက်ညက်ညောညော ပြောနိုင်ရင် ကောင်းမှာပဲ။" },
            { en: "I wish I could play the piano well.", ja: "ピアノを上手に弾けたらいいのに。", my: "ပီယာနို ကောင်းကောင်း တီးနိုင်ရင် ကောင်းမှာပဲ။" },
            { en: "I wish I could travel around the world.", ja: "世界一周旅行ができたらいいのに。", my: "ကမ္ဘာအနှံ့ ခရီးသွားနိုင်ရင် သိပ်ကောင်းမှာပဲ။" },
            { en: "I wish I could buy that expensive car.", ja: "あの高い車を買えたらいいのに。", my: "အဲဒီ ဈေးကြီးတဲ့ကားကို ဝယ်နိုင်ရင် ကောင်းမှာပဲ။" },
            { en: "I wish I could stay here a bit longer.", ja: "ここもうちょっと長く滞在できたらいいのに。", my: "ဒီမှာ နည်းနည်းလောက် ပိုနေနိုင်ရင် ကောင်းမှာပဲ။" },
            { en: "I wish I could meet the famous artist.", ja: "あの有名なアーティストに会えたらいいのに。", my: "နာမည်ကြီး အနုပညာရှင်နဲ့ တွေ့ခွင့်ရရင် ကောင်းမှာပဲ။" },
            { en: "I wish I could fly like a bird.", ja: "鳥のように空を飛べたらいいのに。", my: "ငှက်တစ်ကောင်လို ပျံသန်းနိုင်ရင် ကောင်းမှာပဲ။" },
            { en: "I wish I could find my lost key.", ja: "失くした鍵が見つかればいいのに。", my: "ပျောက်သွားတဲ့ သော့ကို ပြန်ရှာတွေ့ရင် ကောင်းမှာပဲ။" },
            { en: "I wish I could help you with this project.", ja: "このプロジェクトで力になれたらいいのに。", my: "ဒီပရောဂျက်မှာ မင်းကို ကူညီပေးနိုင်ရင် ကောင်းမှာပဲ။" },
            { en: "I wish I could sleep without setting an alarm.", ja: "目覚ましをかけずに眠れたらいいのに。", my: "နှိုးစက်မပေးဘဲ အိပ်ပျော်နိုင်ရင် ကောင်းမှာပဲ。" }
        ]
    },
    {
        id: 5,
        level: "Level 1",
        title: "Subject + have/has + something to + verb1",
        formula: "I have something to + verb1",
        explanation: {
            en: "Used to express that you possess an item, action, or message that requires or is intended for a specific action.",
            ja: "伝えるべき内容や、実行すべき行動、または具体的な目的を持った「何か（物や事）」があることを表現します。",
            my: "ပြုလုပ်ရန်၊ ပြောရန် သို့မဟုတ် ဆောင်ရွက်ရန် အရာတစ်ခုခု ရှိနေကြောင်းကို ဖော်ပြရာတွင် သုံးသည်။"
        },
        examples: [
            { en: "I have something to tell you.", ja: "あなたに話したいことがあります。", my: "မင်းကို ပြောစရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to show you.", ja: "あなたに見せたいものがあります。", my: "မင်းကို ပြစရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to do this afternoon.", ja: "今日の午後、することがあります。", my: "ဒီနေ့မွန်းလွဲပိုင်း လုပ်စရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to eat in the fridge.", ja: "冷蔵庫の中に食べるものがあります。", my: "ရေခဲသေတ္တာထဲမှာ စားစရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to ask the teacher.", ja: "先生に質問したいことがあります。", my: "ဆရာ့ကို မေးစရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to read on the train.", ja: "電車の中で読む本（もの）があります。", my: "ရထားပေါ်မှာ ဖတ်စရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to buy at the mall.", ja: "ショッピングモールで買うものがあります。", my: "မောလ်မှာ ဝယ်စရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to write down.", ja: "メモしておきたいことがあります。", my: "ချရေးစရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to wear for the party.", ja: "パーティーに着ていく服（もの）があります。", my: "ပါတီအတွက် ဝတ်စရာ တစ်ခုခုရှိတယ်။" },
            { en: "I have something to share with the group.", ja: "グループでシェアしたい話があります。", my: "အဖွဲ့နဲ့ မျှဝေစရာ တစ်ခုခုရှိတယ်။" }
        ]
    }
];


// System Dom Reference elements
const langSelector = document.getElementById('lang-selector');
const searchInput = document.getElementById('pattern-search');
const resetBtn = document.getElementById('btn-reset');
const patternsListContainer = document.getElementById('patterns-list-container');
const patternCount = document.getElementById('pattern-count');
const levelBtns = document.querySelectorAll('.level-filter-btn');

const detailCard = document.getElementById('detail-card');
const noSelectionCard = document.getElementById('no-selection-card');
const detailBadgeLevel = document.getElementById('detail-badge-level');

// Updated reference for gamified button
const detailBadgeStatusBtn = document.getElementById('detail-badge-status-btn');
const detailBadgeStatusEdge = document.getElementById('detail-badge-status-edge');
const detailBadgeStatusFront = document.getElementById('detail-badge-status-front');

const detailTitle = document.getElementById('detail-title');
const detailFormula = document.getElementById('detail-formula');
const detailExplanation = document.getElementById('detail-explanation');

const examplesCardsContainer = document.getElementById('examples-cards-container');
const voiceSpeedInput = document.getElementById('voice-speed');
const voiceSpeedVal = document.getElementById('voice-speed-val');
const voiceSelect = document.getElementById('voice-select');

// Scramble logic elements
const scrambleIndex = document.getElementById('scramble-index');
const scrambleTranslation = document.getElementById('scramble-translation');
const scrambleTarget = document.getElementById('scramble-target');
const scrambleSource = document.getElementById('scramble-source');
const scrambleSkipBtn = document.getElementById('scramble-skip-btn');
const scrambleResetBtn = document.getElementById('scramble-reset-btn');
const scrambleCheckBtn = document.getElementById('scramble-check-btn');
const scrambleToast = document.getElementById('scramble-toast');

// Speech recognition DOM elements
const speechSentenceSelect = document.getElementById('speech-sentence-select');
const speechTargetText = document.getElementById('speech-target-text');
const speechRecordBtn = document.getElementById('speech-record-btn');
const speechStatus = document.getElementById('speech-status');
const speechResultBox = document.getElementById('speech-result-box');
const speechTranscript = document.getElementById('speech-transcript');
const speechScore = document.getElementById('speech-score');
const speechFeedback = document.getElementById('speech-feedback');
const speechWebWarning = document.getElementById('speech-webapi-warning');
const recordRing = document.getElementById('record-ring');
const statsMastered = document.getElementById('stats-mastered');

// Initialize application elements
// window.onload = function() {
//     console.log("Initializing Speaking Patterns App...");
//     initApp();
//     initVoiceEngine();
// };
initApp();
initVoiceEngine();

function initApp() {
    updateUIStrings();
    renderPatternsList();
    updateMasteredCountDisplay();

    // Event hooks
    langSelector.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        updateUIStrings();
        renderPatternsList();
        if (activePatternId) loadPatternDetails(activePatternId);
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderPatternsList();
    });

    levelBtns.forEach(btn => {
        console.log(`Setting up level filter button for: ${btn.getAttribute('data-level')}`);
        btn.addEventListener('click', () => {
            levelBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'active');
                b.classList.add('bg-canvas', 'text-slate-600');
            });
            
            btn.classList.remove('bg-canvas', 'text-slate-600');
            btn.classList.add('bg-primary', 'text-white', 'shadow-md', 'active');
            
            selectedLevelFilter = btn.getAttribute('data-level');
            renderPatternsList();
        });
    });

    voiceSpeedInput.addEventListener('input', (e) => {
        voiceSpeedVal.innerText = parseFloat(e.target.value).toFixed(1) + 'x';
    });

    // Tab selection click handler
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/20', 'scale-105');
                b.classList.add('bg-white', 'text-slate-500', 'border-canvas-dark', 'hover:bg-canvas', 'hover:text-primary');
                b.querySelector('i').classList.remove('text-accent');
            });
            btn.classList.remove('bg-white', 'text-slate-500', 'border-canvas-dark', 'hover:bg-canvas', 'hover:text-primary');
            btn.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/20', 'scale-105');
            btn.querySelector('i').classList.add('text-accent');

            const targetTab = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`tab-content-${targetTab}`).classList.remove('hidden');

            if (targetTab === 'unscramble') initScrambleDeck();
            else if (targetTab === 'speech') initSpeechPracticeDeck();
        });
    });

    // Unscramble control hooks
    scrambleSkipBtn.addEventListener('click', () => {
        currentQuizIndex = currentQuizIndex < 9 ? currentQuizIndex + 1 : 0;
        renderQuizQuestion();
    });

    scrambleResetBtn.addEventListener('click', () => {
        selectedWordBlocks = [];
        renderUnscrambleTargetAndSources();
    });

    scrambleCheckBtn.addEventListener('click', checkUnscrambleAnswer);

    resetBtn.addEventListener('click', () => {
        masteredPatterns = [];
        localStorage.setItem('ps_mastered', JSON.stringify([]));
        updateMasteredCountDisplay();
        renderPatternsList();
        if (activePatternId) loadPatternDetails(activePatternId);
        showSystemToast(localization[currentLanguage]["toast-reset"], "info");
    });

    setupSpeechEngine();
}

function updateUIStrings() {
    const dict = localization[currentLanguage];
    document.querySelectorAll('[data-ui]').forEach(el => {
        const key = el.getAttribute('data-ui');
        if (dict[key]) el.innerText = dict[key];
    });

    if (currentLanguage === 'ja') searchInput.placeholder = "パターンや単語を検索...";
    else if (currentLanguage === 'my') searchInput.placeholder = "ပုံစံများ သို့မဟုတ် စကားလုံးများ ရှာရန်...";
    else searchInput.placeholder = "Search patterns or words...";
}

// Render left list of patterns dynamically based on selection filters
function renderPatternsList() {
    console.log(`Rendering patterns list with filter: ${selectedLevelFilter}, search query: "${searchQuery}"`);
    patternsListContainer.innerHTML = '';
    
    const filteredPatterns = speakingPatterns.filter(pat => {
        const matchesLevel = (selectedLevelFilter === 'all' || pat.level === selectedLevelFilter);
        const matchesSearch = (
            pat.title.toLowerCase().includes(searchQuery) ||
            pat.formula.toLowerCase().includes(searchQuery) ||
            pat.explanation[currentLanguage].toLowerCase().includes(searchQuery)
        );
        return matchesLevel && matchesSearch;
    });

    filteredPatterns.sort((a, b) => {
        const levelOrder = { "Level 1": 1, "Level 2": 2, "Level 3": 3 };
        const orderA = levelOrder[a.level] || 99;
        const orderB = levelOrder[b.level] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return a.id - b.id;
    });

    patternCount.innerText = filteredPatterns.length;

    if (filteredPatterns.length === 0) {
        patternsListContainer.innerHTML = `
            <div class="text-center py-12 text-slate-300">
                <i class="fa-solid fa-ghost text-5xl mb-4 block"></i>
                <p class="text-sm font-bold font-heading">No patterns found</p>
            </div>
        `;
        return;
    }

    filteredPatterns.forEach(pat => {
        const isMastered = masteredPatterns.includes(pat.id);
        const levelMap = {
            'Level 1': { bg: 'bg-accent/10', text: 'text-accent', emoji: '🐣' },
            'Level 2': { bg: 'bg-accent/20', text: 'text-accent-dark', emoji: '🐥' },
            'Level 3': { bg: 'bg-accent/30', text: 'text-accent-dark', emoji: '🦅' }
        };
        const levelData = levelMap[pat.level] || { bg: 'bg-canvas-dark', text: 'text-slate-700', emoji: '📚' };
        
        const card = document.createElement('div');
        // Make the active state stand out with the primary color
        card.className = `p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer transform hover:-translate-y-1 ${
            activePatternId === pat.id 
            ? 'bg-indigo-50 border-primary shadow-md shadow-primary/10' 
            : 'bg-white hover:bg-canvas border-canvas-dark shadow-sm'
        }`;

        card.innerHTML = `
            <div class="flex justify-between items-start gap-2 mb-2">
                <span class="text-xs font-black px-2.5 py-0.5 rounded-lg ${levelData.bg} ${levelData.text} uppercase tracking-wide flex items-center gap-1">
                    ${pat.level} ${levelData.emoji}
                </span>
                ${isMastered ? '<span class="text-accent text-lg"><i class="fa-solid fa-star"></i></span>' : ''}
            </div>
            <h3 class="font-bold font-heading text-primary-dark text-base leading-snug">${pat.title}</h3>
            <p class="text-xs font-mono font-bold text-slate-400 mt-1">${pat.formula}</p>
        `;

        card.addEventListener('click', () => {
            activePatternId = pat.id;
            renderPatternsList();
            loadPatternDetails(pat.id);
        });

        patternsListContainer.appendChild(card);
    });
}

function loadPatternDetails(id) {
    const pat = speakingPatterns.find(p => p.id === id);
    if (!pat) return;

    noSelectionCard.classList.add('hidden');
    detailCard.classList.remove('hidden');

    // Level pill coloring mapping to Soft Purple (Accent)
    const levelMap = {
        'Level 1': { bg: 'bg-accent/10', text: 'text-accent' },
        'Level 2': { bg: 'bg-accent/20', text: 'text-accent-dark' },
        'Level 3': { bg: 'bg-accent/30', text: 'text-accent-dark' }
    };
    const lData = levelMap[pat.level] || { bg: 'bg-canvas-dark', text: 'text-slate-800' };
    
    detailBadgeLevel.className = `text-sm font-black px-3 py-1 rounded-xl uppercase tracking-widest ${lData.bg} ${lData.text}`;
    detailBadgeLevel.innerText = pat.level;

    // Gamified Status pill
    const isMastered = masteredPatterns.includes(pat.id);
    if (isMastered) {
        detailBadgeStatusEdge.className = "btn-edge bg-action-dark";
        detailBadgeStatusFront.className = "btn-front bg-action text-white px-4 py-2 font-bold text-sm font-heading";
        detailBadgeStatusFront.innerHTML = `<i class="fa-solid fa-star text-accent-light"></i> <span data-ui="mastered">${localization[currentLanguage]["mastered"]}</span>`;
    } else {
        detailBadgeStatusEdge.className = "btn-edge bg-canvas-dark";
        detailBadgeStatusFront.className = "btn-front bg-canvas text-slate-600 px-4 py-2 font-bold text-sm font-heading hover:bg-white";
        detailBadgeStatusFront.innerHTML = `<i class="fa-regular fa-circle text-slate-400"></i> <span data-ui="in-progress">${localization[currentLanguage]["in-progress"]}</span>`;
    }

    detailBadgeStatusBtn.onclick = () => togglePatternMastered(pat.id);

    detailTitle.innerText = pat.title;
    detailFormula.innerText = pat.formula;
    detailExplanation.innerText = pat.explanation[currentLanguage];

    renderExampleSentences(pat.examples);
    
    currentQuizIndex = 0;
    initScrambleDeck();
    initSpeechPracticeDeck();
}

function togglePatternMastered(id) {
    const idx = masteredPatterns.indexOf(id);
    if (idx > -1) {
        masteredPatterns.splice(idx, 1);
        showSystemToast(localization[currentLanguage]["toast-unmastered"], "info");
    } else {
        masteredPatterns.push(id);
        showSystemToast(localization[currentLanguage]["toast-mastered"], "success");
    }
    localStorage.setItem('ps_mastered', JSON.stringify(masteredPatterns));
    updateMasteredCountDisplay();
    renderPatternsList();
    loadPatternDetails(id);
}

function updateMasteredCountDisplay() {
    statsMastered.innerText = masteredPatterns.length;
    const statsTotal = document.getElementById('stats-total');
    if (statsTotal) statsTotal.innerText = speakingPatterns.length;
}

function renderExampleSentences(examples) {
    examplesCardsContainer.innerHTML = '';
    
    examples.forEach((ex, idx) => {
        const row = document.createElement('div');
        row.className = "group relative p-5 bg-white hover:bg-canvas rounded-[24px] border-2 border-canvas-dark hover:border-primary-light hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transform hover:-translate-y-1";
        
        row.innerHTML = `
            <div class="flex items-start gap-4 flex-1">
                <span class="flex-shrink-0 w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-heading font-black text-lg border border-primary/20">
                    ${idx + 1}
                </span>
                <div>
                    <p class="font-heading font-bold text-primary-dark text-xl group-hover:text-primary transition duration-150">${ex.en}</p>
                    <p class="text-base text-slate-500 font-semibold mt-1">${ex[currentLanguage]}</p>
                </div>
            </div>
            <div class="flex items-center self-end md:self-auto">
                <button class="speak-btn w-12 h-12 bg-white text-action border-2 border-canvas-dark hover:bg-action hover:border-action-dark hover:text-white rounded-full flex items-center justify-center shadow-sm transition-all transform hover:scale-110 active:scale-95" title="Listen Pronunciation">
                    <i class="fa-solid fa-volume-high text-xl"></i>
                </button>
            </div>
        `;

        row.querySelector('.speak-btn').addEventListener('click', () => speakText(ex.en));
        examplesCardsContainer.appendChild(row);
    });
}

function initVoiceEngine() {
    if (!('speechSynthesis' in window)) return;

    function populateVoiceList() {
        synthVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en-') || v.lang === 'en');
        voiceSelect.innerHTML = '';
        if (synthVoices.length === 0) {
            const opt = document.createElement('option');
            opt.value = "";
            opt.innerText = "System English";
            voiceSelect.appendChild(opt);
            return;
        }

        synthVoices.forEach((voice, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.innerText = `${voice.name} (${voice.lang})`;
            if (voice.lang === 'en-US' && (voice.name.includes('Natural') || voice.name.includes('Google'))) opt.selected = true;
            else if (voice.lang === 'en-US' && !voiceSelect.querySelector('[selected]')) opt.selected = true;
            voiceSelect.appendChild(opt);
        });
    }

    populateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }
}

function speakText(text) {
    if (!('speechSynthesis' in window)) {
        showSystemToast("Speech synthesis is not supported on this device/browser.", "error");
        return;
    }
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    const rate = parseFloat(voiceSpeedInput.value);
    utterance.rate = isNaN(rate) ? 1.0 : rate;

    if (voiceSelect && voiceSelect.value !== "") {
        const selectedIndex = parseInt(voiceSelect.value);
        if (synthVoices[selectedIndex]) {
            utterance.voice = synthVoices[selectedIndex];
            utterance.lang = synthVoices[selectedIndex].lang;
        }
    }
    window.speechSynthesis.speak(utterance);
}

function initScrambleDeck() {
    scrambleIndex.innerText = `${currentQuizIndex + 1}/10`;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const pat = speakingPatterns.find(p => p.id === activePatternId);
    if (!pat) return;

    const currentEx = pat.examples[currentQuizIndex];
    scrambleTranslation.innerText = currentEx[currentLanguage];

    let rawWords = currentEx.en.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(/\s+/);
    selectedWordBlocks = [];
    
    let shuffled = [...rawWords];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    window.activeQuizWords = rawWords;
    window.activeShuffledWords = shuffled;
    scrambleToast.classList.add('hidden');
    renderUnscrambleTargetAndSources();
}

function renderUnscrambleTargetAndSources() {
    scrambleTarget.innerHTML = '';
    scrambleSource.innerHTML = '';

    if (selectedWordBlocks.length === 0) {
        scrambleTarget.innerHTML = `<span class="text-sm text-slate-400 font-bold py-2 font-heading border-b-2 border-dashed border-canvas-dark">Tap blocks below to build here</span>`;
    } else {
        selectedWordBlocks.forEach((word, index) => {
            // Gamified target block - Deep Blue
            const btn = document.createElement('button');
            btn.className = "btn-pushable h-10";
            btn.innerHTML = `
                <span class="btn-shadow"></span>
                <span class="btn-edge bg-primary-dark"></span>
                <span class="btn-front bg-primary text-white px-4 py-2 font-heading font-black text-sm w-full h-full flex items-center gap-2 border border-primary-light">
                    ${word} <i class="fa-solid fa-xmark text-primary-light text-xs"></i>
                </span>
            `;
            btn.addEventListener('click', () => {
                selectedWordBlocks.splice(index, 1);
                renderUnscrambleTargetAndSources();
            });
            scrambleTarget.appendChild(btn);
        });
    }

    window.activeShuffledWords.forEach((word) => {
        const targetCount = selectedWordBlocks.filter(w => w === word).length;
        const sourceCount = window.activeShuffledWords.filter(w => w === word).length;
        
        if (targetCount >= sourceCount) {
            // Render a depressed placeholder so layout doesn't jump
            const placeholder = document.createElement('div');
            placeholder.className = "h-10 px-4 py-2 bg-canvas border-2 border-canvas-dark rounded-[0.8rem] opacity-50";
            scrambleSource.appendChild(placeholder);
            return;
        }

        // Gamified source block - White/Neutral
        const btn = document.createElement('button');
        btn.className = "btn-pushable h-10";
        btn.innerHTML = `
            <span class="btn-shadow"></span>
            <span class="btn-edge bg-canvas-dark"></span>
            <span class="btn-front bg-white border-2 border-canvas-dark text-slate-700 hover:text-primary px-4 py-2 font-heading font-black text-sm w-full h-full">
                ${word}
            </span>
        `;
        
        btn.addEventListener('click', () => {
            selectedWordBlocks.push(word);
            renderUnscrambleTargetAndSources();
        });
        scrambleSource.appendChild(btn);
    });
}

function checkUnscrambleAnswer() {
    if(selectedWordBlocks.length === 0) return;

    const correctStr = window.activeQuizWords.join(" ").toLowerCase();
    const compiledStr = selectedWordBlocks.join(" ").toLowerCase();

    scrambleToast.classList.remove('hidden', 'bg-action/10', 'text-action-dark', 'border-action-light', 'bg-red-50', 'text-red-800', 'border-red-200');

    if (compiledStr === correctStr) {
        scrambleToast.className = "mt-6 p-5 rounded-2xl border-2 bg-action/10 text-action-dark border-action-light flex items-center gap-4 shadow-lg shadow-action/5";
        scrambleToast.innerHTML = `
            <div class="bg-action text-white p-2 rounded-full"><i class="fa-solid fa-star text-2xl"></i></div>
            <div class="text-base font-heading font-black">${localization[currentLanguage]["scramble-correct"]}</div>
        `;
        speakText(window.activeQuizWords.join(" "));
    } else {
        scrambleToast.className = "mt-6 p-5 rounded-2xl border-2 bg-red-50 text-red-800 border-red-200 flex items-center gap-4 shadow-lg shadow-red-100/50";
        scrambleToast.innerHTML = `
            <div class="bg-red-200 p-2 rounded-full"><i class="fa-solid fa-face-frown-open text-2xl text-red-600"></i></div>
            <div class="text-base font-heading font-black">${localization[currentLanguage]["scramble-incorrect"]}</div>
        `;
    }
}

function initSpeechPracticeDeck() {
    const pat = speakingPatterns.find(p => p.id === activePatternId);
    if (!pat) return;

    speechSentenceSelect.innerHTML = '';
    pat.examples.forEach((ex, idx) => {
        const opt = document.createElement('option');
        opt.value = ex.en;
        opt.innerText = `${idx + 1}. ${ex.en}`;
        speechSentenceSelect.appendChild(opt);
    });

    speechTargetText.innerText = speechSentenceSelect.value;
    speechSentenceSelect.addEventListener('change', (e) => {
        speechTargetText.innerText = e.target.value;
        speechResultBox.classList.add('hidden');
    });
}

function setupSpeechEngine() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognitionObj = null;
    let isRecording = false;
    if (!SpeechRecognition) {
        speechWebWarning.classList.remove('hidden');
    } else {
        recognitionObj = new SpeechRecognition();
        console.log("SpeechRecognition initialized successfully.");
        recognitionObj.continuous = false;
        recognitionObj.lang = 'en-US';
        recognitionObj.interimResults = false;
        recognitionObj.maxAlternatives = 1;

        recognitionObj.onstart = function() {
            isRecording = true;
            speechStatus.innerText = localization[currentLanguage]["record-listening"];
            speechStatus.classList.replace('text-canvas', 'text-accent');
            recordRing.classList.remove('opacity-0');
        };

        recognitionObj.onend = function() {
            isRecording = false;
            speechStatus.innerText = localization[currentLanguage]["record-idle"];
            speechStatus.classList.replace('text-accent', 'text-canvas');
            recordRing.classList.add('opacity-0');
        };

        recognitionObj.onerror = function(event) {
            isRecording = false;
            speechStatus.innerText = "ERROR. RETRY MIC.";
            speechStatus.classList.replace('text-accent', 'text-red-400');
            recordRing.classList.add('opacity-0');
            showSystemToast("Speech input failed: " + event.error, "error");
        };

        recognitionObj.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            processSpeechAnalysis(speechResult);
        };
    }

    speechRecordBtn.addEventListener('click', () => {
        if (!SpeechRecognition) {
            const mockSpeech = prompt("Speech API not fully compatible. Simulate reading this phrase by typing it:", speechTargetText.innerText);
            if (mockSpeech !== null && mockSpeech.trim() !== '') {
                processSpeechAnalysis(mockSpeech);
            }
            return;
        }

        if (isRecording) {
            recognitionObj.stop();
        } else {
            speechResultBox.classList.add('hidden');
            recognitionObj.start();
        }
    });
}

function calculateLevenshteinDistance(str1, str2) {
    const s1 = str1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();
    const s2 = str2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();

    const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
    for (let j = 1; j <= s2.length; j += 1) {
        for (let i = 1; i <= s1.length; i += 1) {
            const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1,
                track[j - 1][i] + 1,
                track[j - 1][i - 1] + indicator
            );
        }
    }
    return track[s2.length][s1.length];
}

function processSpeechAnalysis(spokenText) {
    const target = speechTargetText.innerText;
    
    const distance = calculateLevenshteinDistance(spokenText, target);
    const maxLen = Math.max(spokenText.length, target.length);
    let accuracyPercent = 100;
    if (maxLen > 0) accuracyPercent = Math.round(((maxLen - distance) / maxLen) * 100);
    if (accuracyPercent < 0) accuracyPercent = 0;

    speechResultBox.classList.remove('hidden');
    speechTranscript.innerText = `"${spokenText}"`;
    speechScore.innerText = `${accuracyPercent}%`;

    speechScore.classList.remove('text-action', 'text-accent', 'text-red-400');
    if (accuracyPercent >= 85) {
        speechScore.classList.add('text-action');
        speechFeedback.innerText = localization[currentLanguage]["speech-great"];
    } else if (accuracyPercent >= 60) {
        speechScore.classList.add('text-accent');
        speechFeedback.innerText = localization[currentLanguage]["speech-good"];
    } else {
        speechScore.classList.add('text-red-400');
        speechFeedback.innerText = localization[currentLanguage]["speech-try-again"];
    }
}

function showSystemToast(msg, type = "success") {
    const toast = document.getElementById('system-toast');
    const toastIcon = document.getElementById('system-toast-icon');
    const toastMsg = document.getElementById('system-toast-msg');

    toastMsg.innerText = msg;
    
    if (type === "success") {
        toastIcon.innerHTML = `<i class="fa-solid fa-circle-check text-action"></i>`;
    } else if (type === "error") {
        toastIcon.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-red-400"></i>`;
    } else {
        toastIcon.innerHTML = `<i class="fa-solid fa-circle-info text-primary-light"></i>`;
    }

    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 3500);
}