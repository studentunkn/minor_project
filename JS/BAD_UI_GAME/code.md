```HTML
```HTML
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BAD UI GAME</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
        }
        .page {
            display: none;
            width: 100%;
            height: 100%;
        }
        .page.active {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        /* Page 0 Styles */
        #page0 {
            background-color: #ea580c;
            text-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }
        #page0 canvas {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
        }
        #page0 .content {
            position: relative;
            z-index: 10;
        }
        .start-btn {
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            user-select: none;
        }
        .start-btn:active {
            transform: scale(0.9);
        }
        .shake-text {
            animation: shake 0.5s infinite;
        }
        @keyframes shake {
            0% { transform: translate(0, 0); }
            25% { transform: translate(1px, -1px); }
            50% { transform: translate(-1px, 1px); }
            75% { transform: translate(1px, 1px); }
            100% { transform: translate(0, 0); }
        }

        /* Page 1 Styles */
        #page1 {
            background-color: #F97316;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        #usernameWrapper, #realSubmit {
            transition: all 0.2s linear;
        }
        #page1 ::-webkit-scrollbar { width: 5px; height: 5px; }
        #page1 ::-webkit-scrollbar-track { background: #FFF7ED; }
        #page1 ::-webkit-scrollbar-thumb { background: #9A3412; }
        #page1 ::-webkit-scrollbar-thumb:hover { background: #F97316; }
        #termsContainer { scrollbar-width: none; -ms-overflow-style: none; }
        #termsContainer::-webkit-scrollbar { display: none; }

        /* Page 2 Styles */
        #page2 {
            background-color: #F97316;
            font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }
        #page2 select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239A3412' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 1.5em 1.5em;
            padding-right: 2.5rem;
        }
        #page2 input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 10px;
            background: #FED7AA;
            border-radius: 5px;
            border: 1px solid #FDBA74;
            outline: none;
        }
        #page2 input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: #F97316;
            border: 2px solid #EA580C;
            border-radius: 50%;
            cursor: pointer;
        }
        #page2 input[type="checkbox"] {
            width: 20px;
            height: 20px;
            border-radius: 2px;
            background-color: #F97316;
            border: 2px solid transparent;
            cursor: pointer;
            -webkit-appearance: none;
            appearance: none;
            transition: background-color 0.1s;
            position: relative;
        }
        #page2 input[type="checkbox"]:checked {
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
            background-size: 80% 80%;
            background-position: center;
            background-repeat: no-repeat;
        }
        #page2 input[type="checkbox"]:hover {
            background-color: #EA580C;
        }
        .checkbox-label-text {
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            color: #7C2D12;
            white-space: nowrap;
        }

        /* Page 3 Styles */
        #page3 {
            font-family: "Inter", -apple-system, sans-serif;
            cursor: default;
            background-color: #F97316;
        }
        .captcha-container { transition: all 0.5s ease; }
        .loading-spinner {
            border: 4px solid #fed7aa;
            border-top: 4px solid #ea580c;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            animation: spin 1s linear infinite;
            display: none;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .shake { animation: shake 0.2s ease-in-out infinite; }
        @keyframes shake {
            0% { transform: translate(1px, 1px); }
            50% { transform: translate(-1px, -1px); }
            100% { transform: translate(1px, 1px); }
        }
    </style>
</head>
<body>

    <!-- Page 0: Start Screen -->
    <div id="page0" class="page active">
        <canvas id="bgCanvas"></canvas>
        <div class="content text-center">
            <div class="mb-12">
                <h1 class="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">BAD UI <br> GAME</h1>
                <p class="text-orange-100 text-xl md:text-2xl font-medium opacity-90">당신의 인내력을 시험합니다</p>
            </div>
            <button id="noBtn" class="start-btn bg-white text-orange-600 px-12 py-6 rounded-full text-3xl md:text-4xl font-black shadow-2xl hover:bg-orange-50 mb-10 min-w-[280px]">
                시작 안 함
            </button>
            <p id="startText" class="text-orange-200 text-lg cursor-pointer hover:text-white transition-all duration-300 underline underline-offset-8 decoration-orange-300/50">
                자신 없으면 여기서 창을 닫으세요.
            </p>
        </div>
    </div>

    <!-- Page 1: Awful Signup Form -->
    <div id="page1" class="page">
         <div class="w-full max-w-lg p-8 bg-orange-100 rounded-lg shadow-2xl border-4 border-orange-300">
            <h1 class="text-4xl font-bold text-center text-orange-900 mb-6" style="font-family: 'Comic Sans MS', cursive;">회원가입</h1>
            <p class="text-center text-orange-700 mb-8" id="message1">세상에서 가장 <span class="font-bold">안전한</span> 계정을 만드세요!</p>

            <form id="badForm" class="space-y-6">
                <div id="usernameWrapper" class="relative" style="padding: 5px;">
                    <label for="username" class="absolute -top-5 left-2 text-sm font-bold text-orange-800">ID:</label>
                    <input type="text" id="username" name="username" data-default="ID" class="w-full p-3 bg-white border-2 border-orange-400 rounded-md focus:outline-none focus:border-purple-500 text-gray-400" value="ID">
                </div>
                <div>
                    <label for="password" class="block text-sm font-bold text-orange-800 mb-1">비밀번호:</label>
                    <input type="text" id="password" name="password" data-default="Password" class="w-full p-3 bg-white border-2 border-orange-400 rounded-md focus:outline-none focus:border-purple-500 text-gray-400" value="Password">
                    <ul id="passwordRules" class="list-disc list-inside text-xs text-orange-700 mt-2 space-y-1 hidden">
                        <li id="rule1">8자 이상 12자 미만이어야 합니다.</li>
                        <li id="rule2">숫자, 대문자, 특수문자(!@#)를 포함해야 합니다.</li>
                        <li id="rule3">키보드 2번째 줄(ASDF...)에 있는 문자를 2개 포함해야 합니다.</li>
                        <li id="rule5">10자 이상이어야 합니다.</li>
                        <li id="rule6">아랍 문자를 최소 1개 포함해야 합니다.</li>
                    </ul>
                </div>
                <div>
                    <label class="block text-sm font-bold text-orange-800 mb-1">이용약관 동의 (필수):</label>
                    <div id="termsToggleWrapper" class="mt-2 flex items-center border-b border-dashed border-orange-800 pb-1 cursor-pointer">
                        <input type="checkbox" id="termsAgree" checked class="mr-2 h-5 w-5 border-orange-400 rounded focus:ring-purple-500 text-purple-600">
                        <label for="termsAgree" class="text-sm font-medium text-orange-800 underline" id="agreeLabel">저는 절대로 약관에 동의 하지 않습니다</label>
                    </div>
                    <div id="termsContainer" class="h-40 p-3 bg-white border-2 border-orange-400 rounded-md overflow-y-scroll text-xs text-orange-900 leading-relaxed mt-2 hidden">
                        <!-- Terms content will be injected by JS -->
                    </div>
                </div>
                <div class="flex space-x-4">
                    <button type="button" id="fakeSubmit" class="w-1/2 bg-green-500 text-white text-xl font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-600">
                        취소
                    </button>
                    <button type="button" id="realSubmit" class="w-1/2 bg-red-600 text-white text-xl font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed" disabled>
                        제출
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Page 2: Personal Info Form -->
    <div id="page2" class="page">
        <div class="w-full max-w-2xl lg:max-w-6xl p-8 bg-orange-100 rounded-lg shadow-2xl border-4 border-orange-300">
            <h1 class="text-4xl font-bold text-center text-orange-900 mb-6" style="font-family: 'Comic Sans MS', cursive;">인적사항 기입</h1>
            <form id="infoForm" class="space-y-6">
                <div id="message2" class="text-center mb-4 min-h-[1.5rem]"></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-6">
                        <div>
                            <label for="name" class="block text-sm font-bold text-orange-800 mb-1">이름:</label>
                            <input type="text" id="name" name="name" class="w-full p-3 bg-white border-2 border-orange-400 rounded-md focus:outline-none focus:border-purple-500 text-orange-900" placeholder="이름 입력">
                        </div>
                        <div>
                            <label class="block text-sm font-bold text-orange-800 mb-1">생년월일:</label>
                            <div class="flex space-x-2">
                                <select id="birthYear" name="birthYear" class="w-1/3 p-3 bg-white border-2 border-orange-400 rounded-md focus:outline-none focus:border-purple-500 text-orange-900"><option value="">년도</option></select>
                                <select id="birthMonth" name="birthMonth" class="w-1/3 p-3 bg-white border-2 border-orange-400 rounded-md focus:outline-none focus:border-purple-500 text-orange-900"><option value="">월</option></select>
                                <select id="birthDay" name="birthDay" class="w-1/3 p-3 bg-white border-2 border-orange-400 rounded-md focus:outline-none focus:border-purple-500 text-orange-900"><option value="">일</option></select>
                            </div>
                        </div>
                        <div>
                            <label for="age" class="block text-sm font-bold text-orange-800 mb-1">
                                나이: <span id="ageValue" class="font-bold text-orange-700 text-base ml-2">25</span>세
                            </label>
                            <input type="range" id="age" name="age" min="1" max="100" value="25" class="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer">
                        </div>
                        <div>
                            <label for="grade" class="block text-xs font-bold text-orange-800 mb-1">학년:</label>
                            <select id="grade" name="grade" class="w-full p-3 bg-white border-2 border-orange-400 rounded-md focus:outline-none focus:border-purple-500 text-orange-900"><option value="">학년 선택</option></select>
                        </div>
                    </div>
                    <div class="space-y-6">
                        <div>
                            <label class="block text-xs font-bold text-orange-800 mb-1">반:</label>
                            <div id="classCheckboxes" class="grid grid-cols-3 gap-2 border-2 border-orange-200 p-3 rounded-md bg-orange-50"></div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-orange-800 mb-1">번호:</label>
                            <div id="studentNumCheckboxes" class="grid grid-cols-5 gap-2 border-2 border-orange-200 p-3 rounded-md bg-orange-50"></div>
                        </div>
                    </div>
                </div>
                <div class="pt-4 md:col-span-2">
                    <button type="submit" id="submitButton" class="w-full bg-orange-700 text-white text-xl font-black py-4 px-4 rounded-lg shadow-lg hover:bg-orange-800 active:scale-95 transition-transform">
                        제출
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Page 3: Final Verification -->
    <div id="page3" class="page">
        <div class="flex-col items-center justify-center">
             <div class="mb-8 text-center">
                <h2 class="text-orange-100 font-black mb-2 tracking-tighter uppercase">Step 3: Identity Verification</h2>
                <div class="flex space-x-2 justify-center">
                    <div id="step1-dot" class="w-12 h-2 rounded-full bg-orange-800 transition-colors"></div>
                    <div id="step2-dot" class="w-12 h-2 rounded-full bg-orange-300 transition-colors"></div>
                    <div id="step3-dot" class="w-12 h-2 rounded-full bg-orange-300 transition-colors"></div>
                </div>
            </div>

            <div id="mainBox" class="bg-orange-100 p-8 rounded-lg shadow-2xl w-full max-w-md border-4 border-orange-300 captcha-container">
                <div id="step1" class="space-y-6">
                    <div class="text-center">
                        <h3 class="text-2xl font-black text-orange-900 mb-1">인증 단계 1</h3>
                        <div class="h-1 w-16 bg-orange-800 mx-auto mb-4"></div>
                    </div>
                    <div class="flex items-center justify-between p-6 bg-white border-2 border-orange-200 rounded-md">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="robotCheck" class="w-6 h-6 border-orange-300 text-orange-600 focus:ring-orange-500 rounded">
                            <span class="text-orange-900 font-bold select-none text-sm">로봇이 아닙니다</span>
                        </label>
                        <div id="spinner1" class="loading-spinner"></div>
                    </div>
                    <div class="h-4"></div>
                </div>

                <div id="step2" class="hidden space-y-4">
                    <div class="bg-orange-800 text-white p-4 -mx-8 -mt-8 rounded-t mb-4">
                        <p class="text-[10px] opacity-70 uppercase tracking-widest font-bold">Verification Task</p>
                        <p class="text-lg font-black">가장 오렌지색다운 이미지를 모두 선택하세요.</p>
                    </div>
                    <div class="grid grid-cols-3 gap-2" id="tileGrid"></div>
                    <div class="flex justify-end items-center border-t border-orange-200 pt-4 mt-4">
                        <button id="verifyStep2Btn" class="bg-orange-800 text-white px-8 py-3 font-black rounded hover:bg-orange-900 transition active:translate-y-1">확인</button>
                    </div>
                </div>

                <div id="step3" class="hidden text-center space-y-8 py-4">
                    <div class="space-y-2">
                        <h3 class="text-3xl font-black text-orange-900">검증 오류</h3>
                        <p class="text-orange-700 font-bold text-sm">데이터 정합성 문제로 검증을 완료할 수 없습니다.</p>
                    </div>
                    <div class="flex flex-col space-y-3">
                        <button id="retryStep3Btn" class="w-full py-4 bg-white border-2 border-orange-800 text-orange-800 font-black rounded-md hover:bg-orange-50 transition">다시 시도 (재부팅 필요)</button>
                        <button id="finalPassBtn" class="w-full py-5 bg-orange-800 text-white font-black text-xl rounded-md hover:shadow-inner transition active:scale-95 shadow-lg">가입 절차 중단하기</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Final Ending -->
    <div id="finalEnding" class="page">
         <div class="text-center space-y-8">
            <p id="totalTimeDisplay" class="text-white text-2xl"></p>
            <h1 class="text-9xl animate-bounce">🍊</h1>
            <h2 class="text-5xl font-black text-white drop-shadow-lg">인증 성공</h2>
            <div class="bg-orange-100 p-10 rounded-lg shadow-2xl border-b-8 border-orange-800 max-w-md">
                <p class="text-2xl text-orange-900 leading-tight font-black">
                    당신은 마침내 <br>이 끔찍한 과정을 <br>모두 견뎌냈습니다.
                </p>
            </div>
            <button id="restartGameBtn" class="text-orange-100 hover:text-white underline font-bold">다시 처음으로 돌아가기</button>
        </div>
    </div>


<script>
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        document.body.style.backgroundColor = pageId === 'page0' || pageId === 'finalEnding' ? '#ea580c' : '#F97316';
        
    }
    
    // --- Global Game State ---
    let gameStartTime = 0;


    // --- Page 0 Logic ---
    (function() {
        const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];

        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 4 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.alpha = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function createParticles() {
            particles = [];
            for (let i = 0; i < 60; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', initCanvas);
        initCanvas();
        createParticles();
        animate();

        const noBtn = document.getElementById('noBtn');
        const startText = document.getElementById('startText');
        let clickCount = 0;
        const btnMessages = ["시작 안 함", "진짜 안 한다니까?", "클릭 금지라고 써줄까?", "응, 절대 안 해", "고집 세시네요...", "어쩔 수 없지, 시작!"];

        function startGame() {
            gameStartTime = Date.now();
            localStorage.setItem('startTime', gameStartTime);
            showPage('page1');
        }

        noBtn.addEventListener('click', () => {
            clickCount++;
            if (clickCount < 5) {
                noBtn.textContent = btnMessages[clickCount];
                const scale = 1 + (clickCount * 0.12);
                noBtn.style.transform = `scale(${scale})`;
                if (clickCount >= 3) {
                    document.getElementById('page0').style.backgroundColor = `rgb(${234 + clickCount * 4}, ${88 - clickCount * 10}, ${12})`;
                }
            } else if (clickCount === 5) {
                noBtn.textContent = btnMessages[5];
                noBtn.classList.replace('bg-white', 'bg-green-500');
                noBtn.classList.replace('text-orange-600', 'text-white');
                noBtn.classList.add('shake-text');
                setTimeout(startGame, 800);
            }
            if (clickCount === 3) {
                startText.textContent = "여기를 눌러 게임을 시작하세요";
                startText.classList.remove('text-orange-200');
                startText.classList.add('text-white', 'font-black', 'text-2xl', 'shake-text');
                startText.style.textDecoration = "none";
            }
        });

        startText.addEventListener('click', () => {
            if (clickCount >= 3 || startText.textContent === "여기를 눌러 게임을 시작하세요") {
                startGame();
            }
        });
    })();

    // --- Page 1 Logic ---
    (function() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const fakeSubmit = document.getElementById('fakeSubmit');
        const realSubmit = document.getElementById('realSubmit');
        const message = document.getElementById('message1');
        const passwordRules = document.getElementById('passwordRules');
        const termsToggleWrapper = document.getElementById('termsToggleWrapper');
        const termsContainer = document.getElementById('termsContainer');
        const termsAgree = document.getElementById('termsAgree');
        const agreeLabel = document.getElementById('agreeLabel');
        let hasViewedTerms = false;
        let isScrolledToBottom = false;

        const termsContent = `
            <p class="font-bold my-4 text-orange-700 text-lg">第1条. 私たちはあなたのすべてを所有します</p>
            <p>1.1. 本規約に同意した瞬間、ユーザーは自身の魂、時間、そしてこの世のすべてのかわいい猫の写真に対する所有権を、当社に永久的かつ譲渡不可能な形で委任するものとします。</p>
            <p>1.2. ユーザーはサービス利用中に発生するあらゆる形態の苛立ちと挫折を、楽しい経験として受け入れなければなりません。これに対して異議を唱えた場合、アカウントは予告なくランダムに削除されます。</p>
            <p class="font-bold my-2 text-orange-700">第2条. データ収集は私たちの人生です</p>
            <p>2.1. 私たちはユーザーのクリックパターン、タイピング速度、そしてモニターの前で漏らすすべてのため息の周波数を収集します。この情報は純粋にユーザー体験の改善（あなたをさらに苦しめる方法を見つけること）に使用されます。</p>
            <p class="font-bold my-2 text-orange-700">第3条. 返金は存在しません</p>
            <p>3.1. 本サービスは無料であるため、返金すべき金額自体が存在しません。あなたが費やした時間と精神的苦痛は、いかなる理由があっても返還されません。</p>
            <p>3.1. 本サービスは無料であるため、返金すべき金額自体が存在しません。あなたが費やした時間と精神的苦痛は、いかなる理由があっても返還されません。</p>
            <p class="font-bold my-2 text-orange-700">追加条項 (JP)</p>
            <ul class="list-disc list-inside space-y-1 ml-4">
                <li>a. サービス利用は終わりのない挑戦の連続です。</li>
                <li>b. すべてのボタンは偽物である可能性が99%です。</li>
                <li>c. 「いいえ」ボタンを押す行為は、あなたの自由意志に反する行為とみなされます。</li>
                <li>d. パスワードを忘れることはユーザーの義務です.</li>
                <li>e. エラーメッセージはランダムに生成され、実際のエラーとは関係ありません。</li>
                <li>f. オレンジ色は私たちの希望の色です。</li>
                <li>g. 私たちはあなたが成功しないことを知っています。</li>
                <li>h. この文章を読むことは時間の無駄です。</li>
                <li>i. スクロールを止めたらあなたの負けです。</li>
                <li>j. あなたの忍耐力は私たちの実験対象です。</li>
                <li>k. altボタンを押せば世界が変わるかもしれません。</li>
            </ul>

            <p class="font-bold my-4 text-orange-700 text-lg">第1条. 我们拥有您的一切</p>
            <p>1.1. 在您同意本条款的瞬间，用户将自己的灵魂、时间以及这个世界上所有可爱的猫咪照片的所有权永久、不可转让地授予公司。</p>
            <p>1.2. 用户必须将服务使用中发生的所有形式的烦恼和挫折视为愉快的体验，如果对此提出异议，账户将被随机删除。</p>
            <p class="font-bold my-2 text-orange-700">第2条. 数据收集是我们的生命</p>
            <p>2.1. 我们收集用户的点击模式、打字速度以及您在显示器前发出的每一声叹息的频率。这些信息纯粹用于改善用户体验（寻找更多折磨您的方法）。</p>
            <p class="font-bold my-2 text-orange-700">第3条. 退款不存在</p>
            <p>3.1. 由于本服务是免费的，因此不存在可退款的金额。您投入的时间和精神痛苦无法退还。</p>
            <p class="font-bold my-2 text-orange-700">附加条款 (CN)</p>
            <ul class="list-disc list-inside space-y-1 ml-4">
                <li>a. 服务使用是无尽挑战的连续。</li>
                <li>b. 所有按钮有99%的可能性是假的。</li>
                <li>c. 按下"否"按钮的行为被视为违背您自由意志的行为。</li>
                <li>d. 忘记密码是用户的义务。</li>
                <li>e. 错误消息是随机生成的，与实际错误无关。</li>
                <li>f. 橙色是我们的希望之色。</li>
                <li>g. 我们知道您不会成功。</li>
                <li>h. 阅读此文是浪费时间。</li>
                <li>i. 停止滚动就是您输了。</li>
                <li>j. 您的耐心是我们的实验对象。</li>
                <li>k. 按下alt按钮，世界便可能改变。</li>
            </ul>

            <p class="font-bold my-4 text-orange-700 text-lg">Article 1. Nous possédons tout ce qui vous concerne</p>
            <p>1.1. Au moment où vous acceptez ces conditions, vous transférez de manière permanente et irrévocable à la Société la propriété de votre âme, de votre temps et de toutes les photos de chats mignons dans ce monde.</p>
            <p>1.2. Les utilisateurs doivent accepter toutes les formes d'agacement et de frustration survenant pendant l'utilisation du service comme des expériences agréables, et si des objections sont soulevées, le compte sera supprimé de manière aléatoire.</p>
            <p class="font-bold my-2 text-orange-700">Article 2. La collecte de données est notre vie</p>
            <p>2.1. Nous collectons vos schémas de clics, votre vitesse de frappe et la fréquence de chaque soupir que vous émettez devant votre écran. Ces informations sont utilisées uniquement pour améliorer l'expérience utilisateur (trouver des moyens de vous tourmenter davantage).</p>
            <p class="font-bold my-2 text-orange-700">Article 3. Les remboursements n'existent pas</p>
            <p>3.1. Comme ce service est gratuit, il n'y a pas de montant à rembourser. Le temps et la souffrance mentale que vous avez investis ne peuvent pas être restitués.</p>
            <p class="font-bold my-2 text-orange-700">Conditions supplémentaires (FR)</p>
            <ul class="list-disc list-inside space-y-1 ml-4">
                <li>a. L'utilisation du service est une série infinie de défis.</li>
                <li>b. Tous les boutons ont 99% de chances d'être faux.</li>
                <li>c. L'acte d'appuyer sur le bouton "Non" est considéré comme un acte contre votre libre arbitre.</li>
                <li>d. Oublier votre mot de passe est votre obligation.</li>
                <li>e. Les messages d'erreur sont générés aléatoirement et ne sont pas liés aux erreurs réelles.</li>
                <li>f. L'orange est notre couleur d'espoir.</li>
                <li>g. Nous savons que vous ne réussirez pas.</li>
                <li>h. Lire ce texte est une perte de temps.</li>
                <li>i. Si vous arrêtez de faire défiler, vous perdez.</li>
                <li>j. Votre patience est notre sujet d'expérimentation.</li>
                <li>k. Appuyez sur le bouton alt pour changer le monde.</li>
            </ul>


            <p class="font-bold my-4 text-orange-700 text-lg">Artículo 1. Somos dueños de todo lo tuyo</p>
            <p>1.1. En el momento en que aceptas estos términos, transfieres de manera permanente e irrevocable a la Compañía la propiedad de tu alma, tu tiempo y todas las fotos de gatos lindos en este mundo.</p>
            <p>1.2. Los usuarios deben aceptar todas las formas de molestia y frustración que ocurran durante el uso del servicio como experiencias placenteras, y si se presentan objeciones, la cuenta será eliminada aleatoriamente.</p>
            <p class="font-bold my-2 text-orange-700">Artículo 2. La recolección de datos es nuestra vida</p>
            <p>2.1. Recopilamos tus patrones de clics, velocidad de escritura y la frecuencia de cada suspiro que emites frente a tu monitor. Esta información es puramente para mejorar la experiencia del usuario (encontrar formas de atormentarte más).</p>
            <p class="font-bold my-2 text-orange-700">Artículo 3. Los reembolsos no existen</p>
            <p>3.1. Como este servicio es gratuito, no hay monto que reembolsar. El tiempo y el sufrimiento mental que invertiste no pueden ser devueltos.</p>
            <p class="font-bold my-2 text-orange-700">Términos adicionales (ES)</p>
            <ul class="list-disc list-inside space-y-1 ml-4">
                <li>a. El uso del servicio es una serie interminable de desafíos.</li>
                <li>b. Todos los botones tienen un 99% de probabilidad de ser falsos.</li>
                <li>c. El acto de presionar el botón "No" se considera un acto en contra de tu libre albedrío.</li>
                <li>d. Olvidar tu contraseña es tu obligación.</li>
                <li>e. Los mensajes de error se generan aleatoriamente y no están relacionados con errores reales.</li>
                <li>f. El naranja es nuestro color de esperanza.</li>
                <li>g. Sabemos que no tendrás éxito.</li>
                <li>h. Leer este texto es una pérdida de tiempo.</li>
                <li>i. Si dejas de desplazarte, pierdes.</li>
                <li>j. Tu paciencia es nuestro sujeto de experimentación.</li>
                <li>k. Presiona el botón alt para cambiar el mundo.</li>
            </ul>

            
            <p class="font-bold my-4 text-lg text-orange-900">제1조. 우리는 당신의 모든 것을 소유합니다</p>
            <p>1.1. 본 약관에 동의하는 순간, 사용자는 자신의 영혼, 시간, 그리고 이 세상의 모든 귀여운 고양이 사진에 대한 소유권을 회사에 영구적으로, 양도 불가능하게 위임합니다.</p>
            <p>1.2. 사용자는 서비스 사용 중 발생하는 모든 형태의 짜증과 좌절을 즐거운 경험으로 받아들여야 하며, 이에 대해 이의를 제기할 경우 계정은 무작위로 삭제됩니다.</p>
            
            <p class="font-bold my-2 text-lg text-orange-900">제2조. 데이터 수집은 우리의 삶입니다</p>
            <p>2.1. 우리는 사용자의 클릭 패턴, 타이핑 속도, 그리고 모니터 앞에서 내뱉는 모든 한숨의 주파수를 수집합니다. 이 정보는 순전히 사용자 경험 개선(당신을 더 괴롭힐 방법을 찾는 것)에 사용됩니다.</p>
            <p>2.2. 당신이 비밀번호 규칙을 맞추기 위해 얼마나 고생했는지에 대한 데이터는 인류학 연구 목적으로 비밀리에 판매될 수 있습니다. 귀하의 이름은 '고통받는 사용자 1호'입니다.</p>
            
            <p class="font-bold my-2 text-lg text-orange-900">제3조. 환불은 존재하지 않습니다</p>
            <p>3.1. 본 서비스는 무료이므로 환불할 금액 자체가 존재하지 않습니다. 당신이 투자한 시간과 정신적 고통은 돌려받을 수 없습니다.</p>
            <p>3.2. 약관 3.1에도 불구하고, 당신이 환불을 요청할 경우, 우리는 당신에게 1센트를 돌려줄 수 있지만, 그 과정은 800단계의 인증 절차를 거쳐야 하며, 인증 코드의 폰트는 매번 바뀔 것입니다.</p>
            
            <p class="font-bold my-2 text-orange-800">추가 조항 (KR)</p>
            <ul class="list-disc list-inside space-y-1 ml-4">
                <li>a. 서비스 이용은 끝없는 도전의 연속입니다.</li>
                <li>b. 모든 버튼은 가짜일 가능성이 99%입니다.</li>
                <li>c. 나이 버튼을 누르는 행위는 당신의 자유 의지에 반하는 행위로 간주됩니다.</li>
                <li>d. 비밀번호를 까먹는 것은 사용자의 의무입니다.</li>
                <li>e. 오류 메시지는 무작위로 생성되며, 실제 오류와는 관련이 없습니다.</li>
                <li>f. 주황색은 우리의 희망 색깔입니다.</li>
                <li>g. 우리는 당신이 성공하지 못할 것을 알고 있습니다.</li>
                <li>h. 이 문구를 읽는 것은 시간 낭비입니다.</li>
                <li>i. 스크롤을 멈추면 당신은 지는 것입니다.</li>
                <li>j. 당신의 인내심은 우리의 실험 대상입니다.</li>
                <li>k. alt버튼을 누르면 세상이 바뀔 수 있습니다.</li>
            </ul>

            <p class="font-bold my-4 text-orange-700 text-lg">Article 1. We Own Everything About You</p>
            <p>1.1. The moment you agree to these terms, you permanently and irrevocably transfer ownership of your soul, time, and all cute cat pictures in this world to the Company.</p>
            <p>1.2. Users must accept all forms of annoyance and frustration occurring during service use as pleasant experiences, and if any objections are raised, the account will be randomly deleted.</p>
            <p class="font-bold my-2 text-orange-700">Article 2. Data Collection is Our Life</p>
            <p>2.1. We collect your click patterns, typing speed, and the frequency of every sigh you emit in front of your monitor. This information is used purely for improving user experience (finding ways to torment you further).</p>
            <p class="font-bold my-2 text-orange-700">Article 3. Refunds Do Not Exist</p>
            <p>3.1. Since this service is free, there is no amount to refund. The time and mental suffering you invested cannot be returned.</p>
            <p class="font-bold my-2 text-orange-700">Additional Terms (EN)</p>
            <ul class="list-disc list-inside space-y-1 ml-4">
                <li>a. Service use is an endless series of challenges.</li>
                <li>b. All buttons have a 99% chance of being fake.</li>
                <li>c. The act of pressing the "No" button is considered an act against your free will.</li>
                <li>d. Forgetting your password is your obligation.</li>
                <li>e. Error messages are randomly generated and not related to actual errors.</li>
                <li>f. Orange is our color of hope.</li>
                <li>g. We know you will not succeed.</li>
                <li>h. Reading this text is a waste of time.</li>
                <li>i. If you stop scrolling, you lose.</li>
                <li>j. Your patience is our experimental subject.</li>
                <li>k. Pressing the alt button can change the world.</li>
            </ul>`;
        termsContainer.innerHTML = termsContent;

        function setupDefaultText(input) {
            const defaultValue = input.getAttribute('data-default');
            const activeColorClass = 'text-orange-900';
            const defaultColorClass = 'text-gray-400';
            
            function applyDefaultStyle() {
                input.classList.add(defaultColorClass);
                input.classList.remove(activeColorClass);
            }
            function applyActiveStyle() {
                input.classList.remove(defaultColorClass);
                input.classList.add(activeColorClass);
            }
            function updateStyle() {
                if (input.value === defaultValue || input.value.trim() === '') {
                    if (input.value.trim() === '') input.value = defaultValue;
                    applyDefaultStyle();
                } else {
                    applyActiveStyle();
                }
            }
            updateStyle();
            input.addEventListener('focus', applyActiveStyle);
            input.addEventListener('blur', () => {
                if (input.value.trim() === '' || input.value === defaultValue) {
                    input.value = defaultValue;
                    applyDefaultStyle();
                }
                if (input.id === 'password') checkSubmitValidity();
            });
            input.addEventListener('input', applyActiveStyle);
        }
        
        setupDefaultText(usernameInput);
        setupDefaultText(passwordInput);

        passwordInput.addEventListener('focus', () => passwordRules.classList.remove('hidden'));
        passwordInput.addEventListener('mousedown', () => passwordRules.classList.remove('hidden'));
        passwordInput.addEventListener('blur', () => passwordRules.classList.add('hidden'));

        function checkSubmitValidity() {
            const passValue = passwordInput.value;
            const passwordIsValid = isPasswordValid(passValue) && passValue !== passwordInput.getAttribute('data-default');
            realSubmit.disabled = !passwordIsValid;
            realSubmit.textContent = "제출";
        }

        function setCursorToStart(e) {
            const input = e.target;
            setTimeout(() => input.setSelectionRange(0, 0), 10);
        }
        usernameInput.addEventListener('input', setCursorToStart);
        passwordInput.addEventListener('input', setCursorToStart);
        
        fakeSubmit.addEventListener('click', () => {
            message.textContent = "세상에서 가장 안전한 계정을 만드세요!";
            message.className = 'text-center text-orange-700 mb-8';
            document.getElementById('badForm').reset();
            usernameInput.value = usernameInput.getAttribute('data-default');
            passwordInput.value = passwordInput.getAttribute('data-default');
            setupDefaultText(usernameInput);
            setupDefaultText(passwordInput);
            passwordRules.classList.add('hidden');
            termsContainer.classList.add('hidden');
            termsAgree.checked = true;
            agreeLabel.classList.remove('text-orange-600', 'font-extrabold');
            hasViewedTerms = false;
            isScrolledToBottom = false;
            checkSubmitValidity();
        });

        termsContainer.addEventListener('scroll', () => {
            if (termsContainer.classList.contains('hidden')) return;
            const isAtBottom = termsContainer.scrollTop + termsContainer.clientHeight >= termsContainer.scrollHeight - 1;
            if (isAtBottom && !isScrolledToBottom) {
                isScrolledToBottom = true;
                message.textContent = "드디어 약관을 끝까지 읽으셨습니다! 이제 '절대로 동의하지 않습니다'의 체크를 풀어 동의하세요!";
                message.className = 'text-center mb-8 text-green-700 font-extrabold text-lg';
            }
        });

        termsContainer.addEventListener('wheel', (e) => {
            if (termsContainer.classList.contains('hidden')) return;
            e.preventDefault();
            let scrollAmount = e.altKey ? e.deltaY : e.deltaY / 20;
            termsContainer.scrollTop += scrollAmount;
        }, { passive: false });
        
        termsToggleWrapper.addEventListener('click', (e) => {
            if (e.target.id !== 'termsAgree') {
                const isHidden = termsContainer.classList.toggle('hidden');
                if (!isHidden) {
                    hasViewedTerms = true;
                    agreeLabel.classList.add('font-extrabold');
                    if (!isScrolledToBottom) {
                        message.textContent = "이제 약관을 보셨으니, 끝까지 스크롤해야 체크를 풀 수 있습니다.";
                         message.className = 'text-center mb-8 text-orange-900 font-bold';
                    }
                } else {
                    agreeLabel.classList.remove('font-extrabold');
                }
            } else {
                if (!termsAgree.checked) {
                    if (!isScrolledToBottom) {
                        termsAgree.checked = true;
                        message.textContent = "약관을 끝까지 읽어야만 체크를 해제할 수 있습니다! (스크롤 끝까지!)";
                        message.className = 'text-center mb-8 text-red-600 font-bold text-xl';
                    } else {
                        message.textContent = "동의가 가능한 상태입니다.";
                        message.className = 'text-center mb-8 text-green-700 font-bold text-xl';
                        checkSubmitValidity();
                    }
                } else {
                    message.textContent = "역시 절대로 동의하지 않으시는군요.";
                    message.className = 'text-center mb-8 text-orange-700';
                    checkSubmitValidity();
                }
            }
        });

        function isPasswordValid(pass) {
            const rules = {
                rule1: pass.length >= 8 && pass.length < 12,
                rule2: /[0-9]/.test(pass) && /[A-Z]/.test(pass) && /[!@#]/.test(pass),
                rule3: (pass.match(/[asdfghjkl]/ig) || []).length >= 2,
                rule5: pass.length >= 10,
                rule6: /[\u0600-\u06FF]/.test(pass)
            };
            Object.keys(rules).forEach(key => {
                document.getElementById(key).style.color = rules[key] ? 'red' : 'green';
            });
            return Object.values(rules).every(v => v);
        }

        passwordInput.addEventListener('input', () => {
            isPasswordValid(passwordInput.value);
            checkSubmitValidity();
        });
        
        realSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            const isTermsAgreedLogic = !termsAgree.checked && hasViewedTerms && isScrolledToBottom;
            const passwordIsValid = isPasswordValid(passwordInput.value) && passwordInput.value !== passwordInput.getAttribute('data-default');

            if (!isTermsAgreedLogic || !passwordIsValid) {
                message.textContent = "모든 관문을 통과해야 다음 단계로 넘어갈 수 있습니다!";
                message.className = 'text-center mb-8 text-red-600 font-bold text-xl';
                return;
            }
            
            message.textContent = "축하합니다! 다음 단계로 이동합니다...";
            message.className = 'text-center mb-8 text-green-700 font-bold';
            setTimeout(() => showPage('page2'), 1500);
        });

        isPasswordValid(passwordInput.value);
        checkSubmitValidity();
    })();
    
    // --- Page 2 Logic ---
    (function() {
        const ageSlider = document.getElementById('age');
        const ageValue = document.getElementById('ageValue');
        const yearSelect = document.getElementById('birthYear');
        const monthSelect = document.getElementById('birthMonth');
        const daySelect = document.getElementById('birthDay');
        const gradeSelect = document.getElementById('grade');
        const classCheckboxesContainer = document.getElementById('classCheckboxes');
        const studentNumCheckboxesContainer = document.getElementById('studentNumCheckboxes');
        const infoForm = document.getElementById('infoForm');
        const message = document.getElementById('message2');

        function numberToKorean(num) {
            const units = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
            if (num < 10) return units[num] + "번";
            if (num === 10) return "십번";
            if (num < 20) return "십" + units[num % 10] + "번";
            if (num === 20) return "이십번";
            if (num < 30) return "이십" + units[num % 10] + "번";
            return num + "번";
        }

        function classToKorean(num) {
            const names = ["", "일반", "이반", "삼반", "사반", "오반", "육반", "칠반", "팔반", "구반"];
            return names[num];
        }

        ageSlider.addEventListener('change', (e) => {
            ageValue.textContent = e.target.value;
        });

        ageSlider.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
        
        function populateSelect(selectEl, start, end, suffix = '') {
            while (selectEl.options.length > 1) selectEl.remove(1);
            for (let i = start; i <= end; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i + suffix;
                selectEl.appendChild(option);
            }
        }
        
        function populateRandomSelect(selectEl, start, end, suffix = '') {
            const selectedValue = selectEl.value;
            while (selectEl.options.length > 1) selectEl.remove(1);
            let numbers = Array.from({length: end - start + 1}, (_, i) => i + start);
            shuffleArray(numbers);
            for (const num of numbers) {
                const option = document.createElement('option');
                option.value = num;
                option.textContent = num + suffix;
                selectEl.appendChild(option);
            }
            if (selectedValue) selectEl.value = selectedValue;
        }

        function createFrustratingCheckboxes(container, name, data, includeAll = true) {
            container.innerHTML = '';
            let itemsToDisplay = [...data];
            shuffleArray(itemsToDisplay);
            if (includeAll) itemsToDisplay.push({ id: 'all', text: '전체', isAll: true });

            itemsToDisplay.forEach((item) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'flex items-center space-x-1 p-1';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${name}-${item.id}`;
                checkbox.name = name;
                checkbox.value = item.id;
                checkbox.checked = !item.isAll;
                if (item.isAll) {
                    checkbox.addEventListener('change', function() {
                        if (this.checked) {
                            container.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
                        }
                    });
                }
                const label = document.createElement('label');
                label.className = `checkbox-label-text`; 
                label.setAttribute('for', `${name}-${item.id}`);
                label.textContent = item.text;
                wrapper.appendChild(checkbox);
                wrapper.appendChild(label);
                container.appendChild(wrapper);
            });
        }

        function initApp() {
            const currentYear = new Date().getFullYear();
            populateSelect(yearSelect, 1950, currentYear); 
            populateRandomSelect(monthSelect, 1, 12, '월');
            populateRandomSelect(daySelect, 1, 31, '일');
            populateRandomSelect(gradeSelect, 1, 3, '학년'); 
            const classData = Array.from({length: 9}, (_, i) => ({ id: i + 1, text: classToKorean(i + 1) }));
            createFrustratingCheckboxes(classCheckboxesContainer, 'classNum', classData, false);
            const studentNums = Array.from({length: 29}, (_, i) => ({ id: i + 1, text: numberToKorean(i + 1) }));
            createFrustratingCheckboxes(studentNumCheckboxesContainer, 'studentNum', studentNums, true);
        }

        initApp();
        monthSelect.addEventListener('mousedown', () => populateRandomSelect(monthSelect, 1, 12, '월'));
        daySelect.addEventListener('mousedown', () => populateRandomSelect(daySelect, 1, 31, '일'));
        gradeSelect.addEventListener('mousedown', () => populateRandomSelect(gradeSelect, 1, 3, '학년'));
        
        function resetFormAndRandomize(msg) {
            message.textContent = msg;
            message.className = 'text-center mb-4 min-h-[1.5rem] text-red-700 font-black';
            infoForm.reset();
            ageValue.textContent = '25';
            initApp();
        }
        
        infoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const year = yearSelect.value;
            const month = monthSelect.value;
            const day = daySelect.value;
            const sliderAgeNum = parseInt(ageSlider.value, 10);
            const grade = gradeSelect.value;
            
            const getValidCheckedCount = container => Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).filter(cb => cb.value !== 'all').length;
            const isAnyAllChecked = container => { const allBtn = container.querySelector('input[value="all"]'); return allBtn ? allBtn.checked : false; };
            
            const classCheckedCount = getValidCheckedCount(classCheckboxesContainer);
            const studentNumCheckedCount = getValidCheckedCount(studentNumCheckboxesContainer);
            
            if (!name || !year || !month || !day || !grade) {
                resetFormAndRandomize("빈칸을 모두 채우세요.");
                return;
            }
            if (classCheckedCount !== 1 || studentNumCheckedCount !== 1 || isAnyAllChecked(classCheckboxesContainer) || isAnyAllChecked(studentNumCheckboxesContainer)) {
                resetFormAndRandomize(`반과 번호를 하나씩만 선택하세요.`);
                return;
            }
            const calculatedKoreanAge = (new Date().getFullYear() - parseInt(year, 10)) + 1;
            if (calculatedKoreanAge !== sliderAgeNum) {
                resetFormAndRandomize(`나이 정보가 불일치합니다.`);
                return;
            }

            message.textContent = "제출 완료! 다음 인증 단계로 이동합니다.";
            message.className = "text-center mb-4 min-h-[1.5rem] text-green-700 text-2xl font-black";
            setTimeout(() => showPage('page3'), 1500);
        });
    })();

    // --- Page 3 Logic ---
    (function() {
        let currentStep = 1;
        let step1Timer = null;
        let secondsPassed = 0;
        const mainBox = document.getElementById('mainBox');
        const robotCheck = document.getElementById('robotCheck');
        const spinner1 = document.getElementById('spinner1');
        const tileGrid = document.getElementById('tileGrid');

        for(let i=0; i<9; i++) {
            tileGrid.innerHTML += `
                <div class="tile bg-orange-400 aspect-square cursor-pointer border-4 border-transparent relative overflow-hidden transition-all active:scale-90" data-tile-id="${i}">
                    <div class="w-full h-full" style="background-color: rgb(251, ${140 + (i*2)}, ${60 - (i*2)})"></div>
                    <div class="check-mark hidden absolute inset-0 bg-orange-900/40 flex items-center justify-center">
                        <span class="text-white text-3xl font-black">!</span>
                    </div>
                </div>
            `;
        }

        tileGrid.addEventListener('click', function(e) {
            const tile = e.target.closest('.tile');
            if (tile) {
                selectTile(tile);
            }
        });


        robotCheck.addEventListener('change', () => {
            if(robotCheck.checked) {
                spinner1.style.display = 'block';
                startStep1Timer();
            } else {
                resetStep1();
            }
        });

        const resetEvents = ['mousemove', 'keydown', 'mousedown'];
        resetEvents.forEach(evt => {
            window.addEventListener(evt, () => {
                if(currentStep === 1 && robotCheck.checked) {
                    resetStep1();
                }
            });
        });

        function startStep1Timer() {
            secondsPassed = 0;
            if(step1Timer) clearInterval(step1Timer);
            step1Timer = setInterval(() => {
                secondsPassed++;
                if(secondsPassed >= 10) {
                    clearInterval(step1Timer);
                    goToStep2();
                }
            }, 1000);
        }

        function resetStep1() {
            clearInterval(step1Timer);
            secondsPassed = 0;
            robotCheck.checked = false;
            spinner1.style.display = 'none';
        }

        function goToStep2() {
            currentStep = 2;
            document.getElementById('step1').classList.add('hidden');
            document.getElementById('step2').classList.remove('hidden');
            document.getElementById('step1-dot').classList.replace('bg-orange-800', 'bg-orange-900');
            document.getElementById('step2-dot').classList.replace('bg-orange-300', 'bg-orange-800');
        }

        function selectTile(el) {
            el.querySelector('.check-mark').classList.toggle('hidden');
            el.classList.toggle('border-orange-900');
        }

        document.getElementById('verifyStep2Btn').addEventListener('click', function() {
            const selected = document.querySelectorAll('.tile.border-orange-900').length;
            if(selected === 0) {
                goToStep3();
            } else {
                mainBox.classList.add('shake');
                setTimeout(() => {
                    mainBox.classList.remove('shake');
                    document.querySelectorAll('.tile').forEach(t => {
                        t.classList.remove('border-orange-900');
                        t.querySelector('.check-mark').classList.add('hidden');
                    });
                }, 500);
            }
        });

        function goToStep3() {
            currentStep = 3;
            document.getElementById('step2').classList.add('hidden');
            document.getElementById('step3').classList.remove('hidden');
            document.getElementById('step2-dot').classList.replace('bg-orange-800', 'bg-orange-900');
            document.getElementById('step3-dot').classList.replace('bg-orange-300', 'bg-orange-800');
        }

        document.getElementById('retryStep3Btn').addEventListener('click', function() {
            const btn = this;
            btn.textContent = "연결 중...";
            setTimeout(() => { btn.textContent = "다시 시도 (재부팅 필요)"; }, 2000);
        });

        document.getElementById('finalPassBtn').addEventListener('click', function() {
            const startTime = localStorage.getItem('startTime');
            const endTime = Date.now();
            let resultText = "기록 실패";

            if (startTime) {
                const diff = Math.floor((endTime - startTime) / 1000);
                const m = Math.floor(diff / 60);
                const s = diff % 60;
                resultText = `총 소요 시간: ${m}분 ${s}초`;
            }
            document.getElementById('totalTimeDisplay').innerText = resultText;
            
            showPage('finalEnding');
        });

        document.getElementById('restartGameBtn').addEventListener('click', function() {
            location.reload();
        });

    })();

</script>
</body>
</html>
```
``

