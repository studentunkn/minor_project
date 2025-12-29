```HTML
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>통합 화학 반응식 시뮬레이터</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        
        body { margin: 0; overflow: hidden; font-family: 'Pretendard', sans-serif; background: #121212; color: white; }
        #canvas-container { width: 100vw; height: 100vh; display: block; cursor: move; }
        
        .glass-panel {
            background: rgba(25, 25, 25, 0.9);
            backdrop-filter: blur(15px);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* 탭 스타일 */
        .tab-btn {
            position: relative;
            transition: all 0.3s;
            opacity: 0.5;
            cursor: pointer;
        }
        .tab-btn.active {
            color: #3b82f6;
            opacity: 1;
        }
        .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #3b82f6;
        }

        /* 아코디언 애니메이션 */
        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        .accordion-content.active {
            max-height: 1500px;
        }
        .rotate-icon {
            transition: transform 0.3s;
        }
        .rotated {
            transform: rotate(180deg);
        }

        .reaction-item:hover {
            background: rgba(59, 130, 246, 0.1);
        }
        .reaction-item.selected {
            background: rgba(59, 130, 246, 0.2);
            border-left: 4px solid #3b82f6;
        }

        #instruction {
            position: absolute; bottom: 20px; right: 20px;
            background: rgba(0,0,0,0.6); padding: 8px 15px; border-radius: 12px; font-size: 0.75rem;
            pointer-events: none; color: #ccc; z-index: 5;
        }

        /* 스크롤바 커스텀 */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
    </style>
</head>
<body>

    <nav id="sidebar" class="absolute top-0 left-0 h-full w-80 glass-panel z-20 flex flex-col transition-all duration-300">
        <div class="p-6 pb-2">
            <h1 class="text-xl font-bold text-blue-400 mb-1">화학 반응 실험실</h1>
            <p class="text-xs text-gray-500 mb-4">고등 화학 통합 시뮬레이터</p>

            <!-- 탭 메뉴 추가 -->
            <div class="flex gap-4 border-b border-white/10 text-sm font-bold text-gray-400 mb-2">
                <div id="tab-type" class="tab-btn active pb-2">종류별 반응식</div>
                <div id="tab-textbook" class="tab-btn pb-2">교과서</div>
            </div>
        </div>

        <div id="accordion-container" class="flex-1 overflow-y-auto px-4 pb-10">
            <!-- 자바스크립트로 생성됨 -->
        </div>

        <div class="p-4 border-t border-gray-800 bg-black/20">
            <div id="legendContainer" class="flex flex-wrap gap-2"></div>
        </div>
    </nav>

    <div id="control-hub" class="absolute top-5 left-[340px] right-5 flex justify-between items-start pointer-events-none transition-opacity duration-300">
        <div class="glass-panel p-4 rounded-xl pointer-events-auto border border-white/10 min-w-[300px]">
            <div id="current-category" class="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">카테고리</div>
            <div id="current-name" class="text-lg font-bold mb-3">반응을 선택하세요</div>
            <div class="bg-black/40 p-3 rounded-lg mb-4 text-center font-mono text-xl border border-white/5">
                <div id="equationDisplay">---</div>
            </div>
            <div class="flex gap-2">
                <button id="animateBtn" class="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg transition font-bold text-sm shadow-lg shadow-blue-500/20">반응 시작</button>
                <button id="resetBtn" class="px-4 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg transition text-sm">초기화</button>
            </div>
        </div>
    </div>

    <div id="instruction">WASD: 이동 | 드래그: 회전 | 휠: 확대/축소</div>
    <div id="canvas-container"></div>

    <script>
        // --- 1. 데이터 베이스 ---

        // temp.html의 데이터 (종류별)
        const dbType = [
            { category: "1. 연소 및 생성", name: "메테인의 연소", reactants: ["CH4", "2O2"], products: ["CO2", "2H2O"] },
            { category: "1. 연소 및 생성", name: "프로페인의 연소", reactants: ["C3H8", "5O2"], products: ["3CO2", "4H2O"] },
            { category: "1. 연소 및 생성", name: "뷰테인의 연소", reactants: ["2C4H10", "13O2"], products: ["8CO2", "10H2O"] },
            { category: "1. 연소 및 생성", name: "에탄올의 연소", reactants: ["C2H5OH", "3O2"], products: ["2CO2", "3H2O"] },
            { category: "1. 연소 및 생성", name: "메탄올의 연소", reactants: ["2CH3OH", "3O2"], products: ["2CO2", "4H2O"] },
            { category: "1. 연소 및 생성", name: "수소 연소 (물 생성)", reactants: ["2H2", "O2"], products: ["2H2O"] },
            { category: "1. 연소 및 생성", name: "암모니아 합성 (하버법)", reactants: ["N2", "3H2"], products: ["2NH3"] },
            { category: "1. 연소 및 생성", name: "과산화수소 분해", reactants: ["2H2O2"], products: ["2H2O", "O2"] },
            { category: "1. 연소 및 생성", name: "아자이드화 나트륨 분해", reactants: ["2NaN3"], products: ["2Na", "3N2"] },
            { category: "2. 산·염기/중화", name: "염산 + 수산화 나트륨", reactants: ["HCl", "NaOH"], products: ["H2O", "NaCl"] },
            { category: "2. 산·염기/중화", name: "황산 + 수산화 나트륨", reactants: ["H2SO4", "2NaOH"], products: ["2H2O", "Na2SO4"] },
            { category: "2. 산·염기/중화", name: "탄산 칼슘 + 염산", reactants: ["CaCO3", "2HCl"], products: ["CaCl2", "CO2", "H2O"] },
            { category: "2. 산·염기/중화", name: "염화 수소 + 암모니아", reactants: ["HCl", "NH3"], products: ["NH4Cl"] },
            { category: "2. 산·염기/중화", name: "물의 자동 이온화", reactants: ["2H2O"], products: ["H3O", "OH"] },
            { category: "3. 산화·환원", name: "철의 제련", reactants: ["Fe2O3", "3CO"], products: ["2Fe", "3CO2"] },
            { category: "3. 산화·환원", name: "마그네슘 + 염산", reactants: ["Mg", "2HCl"], products: ["MgCl2", "H2"] },
            { category: "3. 산화·환원", name: "나트륨 + 물", reactants: ["2Na", "2H2O"], products: ["2NaOH", "H2"] },
            { category: "3. 산화·환원", name: "구리 + 질산 은", reactants: ["Cu", "2AgNO3"], products: ["Cu(NO3)2", "2Ag"] },
            { category: "3. 산화·환원", name: "구리 + 묽은 질산", reactants: ["3Cu", "8HNO3"], products: ["3Cu(NO3)2", "2NO", "4H2O"] },
            { category: "4. 가역/평형", name: "염화 코발트 수화", reactants: ["CoCl2", "6H2O"], products: ["CoCl2(H2O)6"] },
            { category: "4. 가역/평형", name: "NO2 ↔ N2O4", reactants: ["2NO2"], products: ["N2O4"] },
            { category: "4. 가역/평형", name: "HI 생성", reactants: ["H2", "I2"], products: ["2HI"] },
            { category: "5. 기타/앙금", name: "염화 나트륨 + 질산 은", reactants: ["NaCl", "AgNO3"], products: ["AgCl", "NaNO3"] },
            { category: "5. 기타/앙금", name: "탄산수소 나트륨 열분해", reactants: ["2NaHCO3"], products: ["Na2CO3", "H2O", "CO2"] },
            { category: "5. 기타/앙금", name: "물의 전기 분해", reactants: ["2H2O"], products: ["2H2", "O2"] }
        ];

        // temp2.html의 데이터 (교과서)
        const dbTextbook = [
            { course: "1과: 화학의 첫걸음", name: "암모니아 합성 (하버-보슈법)", reactants: ["N2", "3H2"], products: ["2NH3"] },
            { course: "1과: 화학의 첫걸음", name: "메테인의 연소", reactants: ["CH4", "2O2"], products: ["CO2", "2H2O"] },
            { course: "1과: 화학의 첫걸음", name: "프로페인의 연소", reactants: ["C3H8", "5O2"], products: ["3CO2", "4H2O"] },
            { course: "1과: 화학의 첫걸음", name: "뷰테인의 연소", reactants: ["2C4H10", "13O2"], products: ["8CO2", "10H2O"] },
            { course: "1과: 화학의 첫걸음", name: "에탄올의 연소", reactants: ["C2H5OH", "3O2"], products: ["2CO2", "3H2O"] },
            { course: "1과: 화학의 첫걸음", name: "포도당 생성 (광합성)", reactants: ["6CO2", "6H2O"], products: ["C6H12O6", "6O2"] },
            { course: "1과: 화학의 첫걸음", name: "포도당 연소 (세포 호흡)", reactants: ["C6H12O6", "6O2"], products: ["6CO2", "6H2O"] },
            { course: "1과: 화학의 첫걸음", name: "포도당 발효", reactants: ["C6H12O6"], products: ["2C2H5OH", "2CO2"] },
            { course: "1과: 화학의 첫걸음", name: "탄산 칼슘 + 염산", reactants: ["CaCO3", "2HCl"], products: ["CaCl2", "CO2", "H2O"] },
            { course: "1과: 화학의 첫걸음", name: "아자이드화 나트륨 분해", reactants: ["2NaN3"], products: ["2Na", "3N2"] },
            { course: "1과: 화학의 첫걸음", name: "나트륨 + 물", reactants: ["2Na", "2H2O"], products: ["2NaOH", "H2"] },
            { course: "1과: 화학의 첫걸음", name: "탄산수소 나트륨 + 아세트산", reactants: ["NaHCO3", "CH3COOH"], products: ["CH3COONa", "CO2", "H2O"] },
            { course: "2과: 원자의 세계", name: "나트륨의 이온화", reactants: ["Na"], products: ["Na+", "e-"] },
            { course: "3과: 화학 결합", name: "물의 전기 분해", reactants: ["2H2O"], products: ["2H2", "O2"] },
            { course: "3과: 화학 결합", name: "암모늄 이온 생성", reactants: ["NH3", "H+"], products: ["NH4+"] },
            { course: "3과: 화학 결합", name: "염화 나트륨 용융 전기 분해", reactants: ["2NaCl"], products: ["2Na", "Cl2"] },
            { course: "4과: 역동적인 반응", name: "염화 코발트 수화물 평형", reactants: ["CoCl2", "6H2O"], products: ["CoCl2(H2O)6"] },
            { course: "4과: 역동적인 반응", name: "이산화 질소 평형", reactants: ["2NO2"], products: ["N2O4"] },
            { course: "4과: 역동적인 반응", name: "물의 자동 이온화", reactants: ["2H2O"], products: ["H3O+", "OH-"] },
            { course: "4과: 역동적인 반응", name: "아세트산의 이온화", reactants: ["CH3COOH", "H2O"], products: ["H3O+", "CH3COO-"] },
            { course: "4과: 역동적인 반응", name: "염산 + 수산화 나트륨", reactants: ["HCl", "NaOH"], products: ["NaCl", "H2O"] },
            { course: "4과: 역동적인 반응", name: "황산 + 수산화 나트륨", reactants: ["H2SO4", "2NaOH"], products: ["Na2SO4", "2H2O"] },
            { course: "4과: 역동적인 반응", name: "마그네슘 + 염산", reactants: ["Mg", "2HCl"], products: ["MgCl2", "H2"] },
            { course: "4과: 역동적인 반응", name: "철의 제련", reactants: ["Fe2O3", "3CO"], products: ["2Fe", "3CO2"] },
            { course: "4과: 역동적인 반응", name: "구리 + 질산 은", reactants: ["Cu", "2AgNO3"], products: ["Cu(NO3)2", "2Ag"] },
            { course: "4과: 역동적인 반응", name: "아연 + 황산 구리", reactants: ["Zn", "CuSO4"], products: ["ZnSO4", "Cu"] },
            { course: "4과: 역동적인 반응", name: "구리 + 묽은 질산", reactants: ["3Cu", "8HNO3"], products: ["3Cu(NO3)2", "2NO", "4H2O"] },
            { course: "4과: 역동적인 반응", name: "이산화 황 + 황화 수소", reactants: ["SO2", "2H2S"], products: ["2H2O", "3S"] },
            { course: "4과: 역동적인 반응", name: "탄산수소 나트륨 열분해", reactants: ["2NaHCO3"], products: ["Na2CO3", "H2O", "CO2"] },
            { course: "4과: 역동적인 반응", name: "수산화 바륨 + 질산 암모늄", reactants: ["Ba(OH)2·8H2O", "2NH4NO3"], products: ["Ba(NO3)2", "10H2O", "2NH3"] }
        ];

        // --- 2. 렌더링 및 로직 설정 (temp.html 기반) ---

        const atomDefs = {
            'H': { color: 0xFFFFFF, r: 0.25 }, 'C': { color: 0x505050, r: 0.6 },
            'N': { color: 0x3050F8, r: 0.65 }, 'O': { color: 0xFF0D0D, r: 0.6 },
            'F': { color: 0x90E050, r: 0.5 }, 'Na': { color: 0xAB5CF2, r: 0.8 },
            'Mg': { color: 0x8AFF00, r: 0.7 }, 'Al': { color: 0xBFA6A6, r: 0.75 },
            'S': { color: 0xFFFF30, r: 0.8 }, 'Cl': { color: 0x1FF01F, r: 0.8 },
            'K': { color: 0x8F40D4, r: 0.9 }, 'Ca': { color: 0x3DFF00, r: 0.9 },
            'Fe': { color: 0xE06633, r: 0.75 }, 'Co': { color: 0xF090A0, r: 0.75 },
            'Cu': { color: 0xC88033, r: 0.75 }, 'Zn': { color: 0x7D80B0, r: 0.75 },
            'Ag': { color: 0xC0C0C0, r: 0.8 }, 'Ba': { color: 0x00C900, r: 0.9 },
            'I': { color: 0x940094, r: 0.9 }, 'Br': { color: 0xA62929, r: 0.85 },
            'e': { color: 0xFFFF00, r: 0.15 } // temp2 호환을 위해 전자(e) 추가
        };

        let scene, camera, renderer, cameraGroup;
        let atomMeshes = []; 
        let isAnimating = false;
        let progress = 0;
        let currentTab = 'type'; // 'type' or 'textbook'
        
        let isDragging = false;
        let prevMouse = { x: 0, y: 0 };
        let targetRotation = { x: 0, y: 0 };
        let moveState = { w: false, a: false, s: false, d: false };
        const moveSpeed = 0.25;

        function init() {
            const container = document.getElementById('canvas-container');
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x111111);
            
            cameraGroup = new THREE.Group();
            scene.add(cameraGroup);

            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 0, 35);
            cameraGroup.add(camera);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 0.7));
            const light = new THREE.DirectionalLight(0xffffff, 0.8);
            light.position.set(10, 20, 15);
            scene.add(light);

            setupTabs();
            buildAccordion();
            
            // 초기 반응 로드
            loadReaction(dbType[0], '1. 연소 및 생성');

            // Controls
            container.addEventListener('mousedown', (e) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; });
            window.addEventListener('mouseup', () => isDragging = false);
            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                targetRotation.y += (e.clientX - prevMouse.x) * 0.01;
                targetRotation.x += (e.clientY - prevMouse.y) * 0.01;
                prevMouse = { x: e.clientX, y: e.clientY };
            });
            container.addEventListener('wheel', (e) => {
                camera.position.z += e.deltaY * 0.02;
                camera.position.z = Math.max(5, Math.min(100, camera.position.z));
            });
            
            window.addEventListener('keydown', (e) => {
                const key = e.key.toLowerCase();
                if (key in moveState) moveState[key] = true;
            });
            window.addEventListener('keyup', (e) => {
                const key = e.key.toLowerCase();
                if (key in moveState) moveState[key] = false;
            });

            window.addEventListener('resize', onWindowResize);
            
            document.getElementById('animateBtn').addEventListener('click', () => { 
                if(!isAnimating && progress < 1) { 
                    isAnimating = true; 
                    document.getElementById('sidebar').classList.add('opacity-0', 'pointer-events-none');
                    document.getElementById('control-hub').classList.add('opacity-0');
                } 
            });
            document.getElementById('resetBtn').addEventListener('click', () => { 
                progress = 0; isAnimating = false; 
                document.getElementById('sidebar').classList.remove('opacity-0', 'pointer-events-none');
                document.getElementById('control-hub').classList.remove('opacity-0');
                cameraGroup.position.set(0,0,0);
                updatePositions(); 
            });

            animateLoop();
        }

        function setupTabs() {
            const tabType = document.getElementById('tab-type');
            const tabTextbook = document.getElementById('tab-textbook');

            tabType.onclick = () => {
                if(currentTab === 'type') return;
                currentTab = 'type';
                tabType.classList.add('active');
                tabTextbook.classList.remove('active');
                buildAccordion();
            };

            tabTextbook.onclick = () => {
                if(currentTab === 'textbook') return;
                currentTab = 'textbook';
                tabTextbook.classList.add('active');
                tabType.classList.remove('active');
                buildAccordion();
            };
        }

        function buildAccordion() {
            const container = document.getElementById('accordion-container');
            container.innerHTML = '';
            
            // 현재 탭에 따라 데이터와 카테고리 키 선택
            const isType = currentTab === 'type';
            const data = isType ? dbType : dbTextbook;
            const categoryKey = isType ? 'category' : 'course';

            const categories = [...new Set(data.map(r => r[categoryKey]))];
            
            categories.forEach((cat, catIdx) => {
                const catEl = document.createElement('div');
                catEl.className = "mb-2";
                
                const header = document.createElement('button');
                header.className = "w-full flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition mb-1";
                header.innerHTML = `<span class="font-bold text-sm text-gray-300">${cat}</span>
                                    <svg class="w-4 h-4 rotate-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
                
                const content = document.createElement('div');
                content.className = "accordion-content px-1";
                if(catIdx === 0) {
                    content.classList.add('active');
                    header.querySelector('.rotate-icon').classList.add('rotated');
                }

                header.onclick = () => {
                    const icon = header.querySelector('.rotate-icon');
                    icon.classList.toggle('rotated');
                    content.classList.toggle('active');
                };

                data.forEach((rxn, idx) => {
                    if(rxn[categoryKey] === cat) {
                        const btn = document.createElement('div');
                        btn.className = "reaction-item cursor-pointer p-3 text-xs rounded-md mb-1 text-gray-400 transition flex items-center";
                        btn.id = `rxn-btn-${idx}`;
                        // temp2 데이터는 인덱스 번호가 섞일 수 있으므로 고유 ID 대신 데이터 객체 자체를 전달
                        btn.innerHTML = `<span class="opacity-50 mr-2">●</span> ${rxn.name}`;
                        btn.onclick = () => {
                            // 모든 선택 표시 제거 후 현재 것 추가
                            document.querySelectorAll('.reaction-item').forEach(el => el.classList.remove('selected', 'text-white'));
                            btn.classList.add('selected', 'text-white');
                            loadReaction(rxn, cat);
                        };
                        content.appendChild(btn);
                    }
                });

                catEl.appendChild(header);
                catEl.appendChild(content);
                container.appendChild(catEl);
            });
        }

        // temp.html의 파싱 로직 + temp2 호환을 위한 정제 로직 추가
        function getAtomsFromFormula(formula) {
            let count = 1;
            // temp2의 (s), (l), (aq), +/-, 이온 등을 처리하기 위해 정제
            // 1. (s), (l), (g), (aq) 제거
            // 2. 이온 부호 (+, -) 제거. 단, e-는 보존하고 싶지만 temp1 로직상 대문자가 필요하므로 처리 필요.
            // 여기서는 e-를 'e' 원소로 취급하기 위해 '-' 제거
            let pure = formula.replace(/\(s\)|\(l\)|\(g\)|\(aq\)/g, '').replace(/\+|\-/g, '');
            
            // 수화물 점(·) 처리 (단순화를 위해 앞부분만 취하거나, 분리해야함. temp1 로직 유지를 위해 단순 분리)
            if(pure.includes('·')) pure = pure.split('·')[0]; // 수화물 물 분자는 복잡하므로 일단 생략하거나 로직 개선 필요. 여기선 핵심 분자만.

            const match = pure.match(/^(\d+)(.*)/);
            if(match) { count = parseInt(match[1]); pure = match[2]; }
            
            let atoms = [];
            function parse(str, mult) {
                while (str.includes('(')) {
                    str = str.replace(/\(([A-Za-z0-9]+)\)(\d+)/g, (_, c, n) => c.repeat(parseInt(n)));
                    str = str.replace(/\(([A-Za-z0-9]+)\)/g, "$1");
                }
                const regex = /([A-Z][a-z]?|e)(\d*)/g; // 'e' (전자) 허용
                let m;
                while ((m = regex.exec(str)) !== null) {
                    const el = m[1];
                    const n = m[2] ? parseInt(m[2]) : 1;
                    for(let i=0; i<n*mult; i++) atoms.push(el);
                }
            }
            parse(pure, count);
            return atoms;
        }

        // temp.html의 핵심 구조 로직 (그대로 유지)
        function getStructureOffsets(formula) {
            // temp2 데이터와의 호환을 위해 입력값 정제
            let cleanFormula = formula.replace(/\(s\)|\(l\)|\(g\)|\(aq\)/g, '').replace(/\+|\-/g, '');
            if(cleanFormula === 'e') return [{t:'e', p:[0,0,0]}]; // 전자 예외 처리

            const atoms = getAtomsFromFormula(formula);
            const offsets = [];
            // 계수 제거한 순수 화학식
            const pure = cleanFormula.replace(/^\d+/, '');
            
            // 하드코딩된 구조들 (temp.html 원본)
            if (pure === "CO2") {
                offsets.push({t:'O', p:[-0.75, 0, 0]}, {t:'C', p:[0, 0, 0]}, {t:'O', p:[0.75, 0, 0]});
            } else if (pure === "H2O") {
                offsets.push({t:'O', p:[0, 0, 0]}, {t:'H', p:[0.4, 0.3, 0]}, {t:'H', p:[-0.4, 0.3, 0]});
            } else if (pure === "H2O2") {
                offsets.push({t:'O', p:[-0.45, 0, 0]}, {t:'O', p:[0.45, 0, 0]}, {t:'H', p:[-0.7, 0.4, 0.15]}, {t:'H', p:[0.7, 0.4, -0.15]});
            } else if (pure === "C2H5OH") {
                offsets.push({t:'C', p:[-0.7, 0, 0]}, {t:'C', p:[0.3, 0, 0]}, {t:'O', p:[0.8, 0.5, 0]}, {t:'H', p:[1.0, 0.25, 0]}); 
                offsets.push({t:'H', p:[-1.1, 0.5, 0]}, {t:'H', p:[-1.1, -0.3, 0.45]}, {t:'H', p:[-1.1, -0.3, -0.45]}); 
                offsets.push({t:'H', p:[0.3, -0.5, 0.35]}, {t:'H', p:[0.3, -0.5, -0.35]}); 
            } else if (pure === "CH3OH") {
                offsets.push({t:'C', p:[0, 0, 0]}, {t:'O', p:[0.6, 0.5, 0]}, {t:'H', p:[0.85, 0.25, 0]}); 
                offsets.push({t:'H', p:[-0.4, -0.35, 0.5]}, {t:'H', p:[-0.4, -0.35, -0.5]}, {t:'H', p:[-0.35, 0.6, 0]});
            } else if (pure === "NH3" || pure === "NH4" || pure === "H3O" || pure === "NH4Cl") {
                const center = atoms[0] === 'N' || atoms[0] === 'O' ? atoms[0] : (atoms.includes('N') ? 'N' : atoms[0]);
                offsets.push({t:center, p:[0, 0, 0]});
                const r = 0.5;
                const hAtoms = atoms.filter(a => a === 'H');
                const others = atoms.filter(a => a !== 'H' && a !== center);
                const tet = [[1, 1, 1], [-1, -1, 1], [1, -1, -1], [-1, 1, -1]].map(v => v.map(c => c * r * 0.577));
                hAtoms.forEach((t, i) => { if(i < 4) offsets.push({t, p: tet[i]}); });
                others.forEach((t, i) => { offsets.push({t, p: [0, -1, 0]}); });
            } else if (pure === "CH4") {
                offsets.push({t:'C', p:[0, 0, 0]});
                const r = 0.65;
                const tet = [[1, 1, 1], [-1, -1, 1], [1, -1, -1], [-1, 1, -1]].map(v => v.map(c => c * r * 0.577));
                tet.forEach(p => offsets.push({t:'H', p}));
            } else if (pure === "NaOH") {
                offsets.push({t:'Na', p:[-0.7, 0, 0]}, {t:'O', p:[0.45, 0, 0]}, {t:'H', p:[0.75, 0, 0]});
            } else if (pure.match(/^[A-Z][a-z]?2$/)) {
                const r = pure === "H2" ? 0.3 : 0.5;
                offsets.push({t:atoms[0], p:[-r/2, 0, 0]}, {t:atoms[1], p:[r/2, 0, 0]});
            } else if (pure === "HCl" || pure === "NaCl") {
                offsets.push({t:atoms[0], p:[-0.4, 0, 0]}, {t:atoms[1], p:[0.4, 0, 0]});
            } else {
                // 일반적인 경우 (temp2의 포도당 등 복잡한 분자도 여기서 처리됨)
                atoms.forEach((t, i) => {
                    if (atoms.length === 1) offsets.push({t, p:[0,0,0]});
                    else {
                        const phi = Math.acos(-1 + (2 * i) / (atoms.length - 1));
                        const theta = Math.sqrt(atoms.length * Math.PI) * phi;
                        offsets.push({t, p:[Math.cos(theta)*Math.sin(phi)*0.7, Math.sin(theta)*Math.sin(phi)*0.7, Math.cos(phi)*0.7]});
                    }
                });
            }
            return offsets;
        }

        function loadReaction(data, categoryName) {
            // UI Update
            document.getElementById('current-category').innerText = categoryName;
            document.getElementById('current-name').innerText = data.name;
            document.getElementById('equationDisplay').innerText = data.reactants.join(" + ") + " → " + data.products.join(" + ");

            // Engine Update
            atomMeshes.forEach(a => scene.remove(a.mesh));
            atomMeshes = []; progress = 0; isAnimating = false;
            
            const rData = [];
            data.reactants.forEach((f, idx) => {
                // temp2 데이터 호환을 위해 숫자 파싱 강화
                const count = parseInt(f.match(/^\d+/)?.[0] || 1);
                const pure = f.replace(/^\d+/, '');
                for(let c=0; c<count; c++) {
                    const base = new THREE.Vector3(-10 + idx*6, (c - (count-1)/2)*5, 0);
                    getStructureOffsets(pure).forEach(off => rData.push({ type: off.t, pos: new THREE.Vector3().addVectors(base, new THREE.Vector3(...off.p)) }));
                }
            });

            const pData = [];
            data.products.forEach((f, idx) => {
                const count = parseInt(f.match(/^\d+/)?.[0] || 1);
                const pure = f.replace(/^\d+/, '');
                for(let c=0; c<count; c++) {
                    const base = new THREE.Vector3(8 + idx*7, (c - (count-1)/2)*5, 0);
                    getStructureOffsets(pure).forEach(off => pData.push({ type: off.t, pos: new THREE.Vector3().addVectors(base, new THREE.Vector3(...off.p)) }));
                }
            });

            const types = [...new Set(rData.map(d => d.type))];
            updateLegend(types);

            types.forEach(type => {
                const rList = rData.filter(d => d.type === type);
                const pList = pData.filter(d => d.type === type);
                
                // temp2 데이터는 원자 개수가 완벽히 맞지 않는 경우(이온화 등)가 있을 수 있으므로 방어 코드 추가
                const max = Math.max(rList.length, pList.length);
                
                for(let i=0; i<max; i++) {
                     // 짝이 없으면 화면 밖에서 날아오거나 화면 밖으로 사라지게 처리
                    const startPos = rList[i] ? rList[i].pos : pList[i].pos.clone().add(new THREE.Vector3(0, -20, 0));
                    const endPos = pList[i] ? pList[i].pos : rList[i].pos.clone().add(new THREE.Vector3(0, 20, 0));

                    const def = atomDefs[type] || { color: 0xffffff, r: 0.5 };
                    const mesh = new THREE.Mesh(
                        new THREE.SphereGeometry(def.r, 32, 32),
                        new THREE.MeshPhysicalMaterial({ color: def.color, metalness: 0.1, roughness: 0.2, clearcoat: 0.6 })
                    );
                    mesh.position.copy(startPos);
                    scene.add(mesh);
                    atomMeshes.push({ mesh, start: startPos, end: endPos });
                }
            });
        }

        function updateLegend(types) {
            const container = document.getElementById('legendContainer');
            container.innerHTML = '';
            types.sort().forEach(t => {
                const def = atomDefs[t] || { color: 0x888888 };
                const div = document.createElement('div');
                div.className = "flex items-center text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5";
                div.innerHTML = `<div class="w-2 h-2 rounded-full mr-2" style="background-color: #${new THREE.Color(def.color).getHexString()}"></div>${t}`;
                container.appendChild(div);
            });
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function updatePositions() {
            const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            const t = ease(progress);
            atomMeshes.forEach(a => {
                a.mesh.position.lerpVectors(a.start, a.end, t);
                if (progress > 0 && progress < 1) {
                    a.mesh.position.y += Math.sin(Date.now() * 0.005 + a.mesh.id) * 0.015;
                }
            });
        }

        function handleCameraMove() {
            if (moveState.w) cameraGroup.position.y += moveSpeed;
            if (moveState.s) cameraGroup.position.y -= moveSpeed;
            if (moveState.a) cameraGroup.position.x -= moveSpeed;
            if (moveState.d) cameraGroup.position.x += moveSpeed;
        }

        function animateLoop() {
            requestAnimationFrame(animateLoop);
            if(isAnimating) {
                progress += 0.005;
                if(progress >= 1) { 
                    progress = 1; 
                    isAnimating = false; 
                    document.getElementById('sidebar').classList.remove('opacity-0', 'pointer-events-none');
                    document.getElementById('control-hub').classList.remove('opacity-0');
                }
            }
            updatePositions();
            handleCameraMove();
            cameraGroup.rotation.y += (targetRotation.y - cameraGroup.rotation.y) * 0.1;
            cameraGroup.rotation.x += (targetRotation.x - cameraGroup.rotation.x) * 0.1;
            renderer.render(scene, camera);
        }

        init();
    </script>
</body>
</html>
```
