
class SajuInputForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                label {
                    font-size: 1.1rem;
                    color: var(--primary-color);
                }
                input, select {
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid var(--primary-color);
                    background-color: var(--input-bg-color);
                    color: var(--text-color);
                    font-size: 1rem;
                    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
                }
                button {
                    padding: 12px;
                    border-radius: 5px;
                    border: none;
                    background-color: var(--primary-color);
                    color: var(--button-text-color);
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: background-color 0.3s, color 0.3s;
                }
                button:hover {
                    background-color: var(--primary-color-hover);
                }
            </style>
            <form id="saju-form">
                <label for="gender">성별</label>
                <select id="gender" name="gender">
                    <option value="male">남자</option>
                    <option value="female">여자</option>
                </select>

                <label for="year">태어난 년도</label>
                <input type="number" id="year" name="year" placeholder="예: 1990" required>

                <label for="month">태어난 월</label>
                <input type="number" id="month" name="month" min="1" max="12" required>

                <label for="day">태어난 일</label>
                <input type="number" id="day" name="day" min="1" max="31" required>

                <label for="time">태어난 시간</label>
                <select id="time" name="time">
                    <option value="0">00:00 - 01:29 (자시)</option>
                    <option value="1">01:30 - 03:29 (축시)</option>
                    <option value="2">03:30 - 05:29 (인시)</option>
                    <option value="3">05:30 - 07:29 (묘시)</option>
                    <option value="4">07:30 - 09:29 (진시)</option>
                    <option value="5">09:30 - 11:29 (사시)</option>
                    <option value="6">11:30 - 13:29 (오시)</option>
                    <option value="7">13:30 - 15:29 (미시)</option>
                    <option value="8">15:30 - 17:29 (신시)</option>
                    <option value="9">17:30 - 19:29 (유시)</option>
                    <option value="10">19:30 - 21:29 (술시)</option>
                    <option value="11">21:30 - 23:29 (해시)</option>
                </select>

                <button type="submit">운세 분석하기</button>
            </form>
        `;

        this.shadowRoot.querySelector('#saju-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const sajuData = {
                gender: formData.get('gender'),
                year: parseInt(formData.get('year'), 10),
                month: parseInt(formData.get('month'), 10),
                day: parseInt(formData.get('day'), 10),
                time: parseInt(formData.get('time'), 10),
            };
            this.dispatchEvent(new CustomEvent('sajuSubmit', { detail: sajuData, bubbles: true, composed: true }));
        });
    }
}

class SajuResultDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                #result-container {
                    padding: 20px;
                    border-radius: 10px;
                    background-color: var(--component-bg-color);
                    color: var(--text-color);
                    display: none; /* Initially hidden */
                    transition: background-color 0.3s, color 0.3s;
                }
                h2, h3 {
                    color: var(--primary-color);
                    text-align: center;
                    margin-bottom: 20px;
                    transition: color 0.3s;
                }
                p {
                    line-height: 1.6;
                }
                .fortune-category-buttons {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .fortune-category-buttons button {
                    padding: 10px 15px; /* Adjusted padding */
                    border-radius: 8px; /* More rounded */
                    border: 1px solid var(--primary-color);
                    background-color: transparent;
                    color: var(--primary-color);
                    font-size: 1rem; /* Slightly larger font */
                    cursor: pointer;
                    transition: background-color 0.3s, color 0.3s, border-color 0.3s, transform 0.2s;
                    min-width: 100px; /* Ensure consistent button width */
                }
                .fortune-category-buttons button:hover {
                    transform: translateY(-2px); /* Slight lift on hover */
                }
                .fortune-category-buttons button.active {
                    background-color: var(--primary-color);
                    color: var(--button-text-color);
                    box-shadow: 0 0 10px var(--primary-color-hover); /* Added shadow for active */
                }
                #general-fortune-text, #category-fortune-text {
                    text-align: center;
                    min-height: 40px;
                    padding: 10px;
                    margin-top: 20px;
                    border: 1px dashed var(--component-border-color); /* Added border for definition */
                    border-radius: 8px;
                }
                #category-fortune-section {
                    margin-top: 30px; /* Space above section */
                    padding-top: 20px;
                    border-top: 1px solid var(--component-border-color); /* Separator line */
                }
            </style>
            <div id="result-container">
                <h2>사주 분석 결과</h2>
                <p id="general-fortune-text"></p>
                
                <div id="category-fortune-section">
                    <h3>오늘 / 주간 / 월간 / 연간 운세</h3>
                    <div class="fortune-category-buttons" id="time-period-buttons">
                        <button data-category="daily">오늘의 운세</button>
                        <button data-category="weekly">이번 주 운세</button>
                        <button data-category="monthly">이번 달 운세</button>
                        <button data-category="yearly">올해의 운세</button>
                    </div>
                    <p id="category-fortune-text"></p>
                </div>
            </div>
        `;

        this.generalFortuneText = this.shadowRoot.querySelector('#general-fortune-text');
        this.categoryFortuneText = this.shadowRoot.querySelector('#category-fortune-text');
        this.timePeriodButtonsContainer = this.shadowRoot.querySelector('#time-period-buttons');
        // Removed month-specific elements
        this._attachEventListeners();
        this.currentSajuData = null; // To store sajuData for dynamic fortunes if needed later
    }

    // Removed _createMonthButtons()

    _attachEventListeners() {
        // Event listener for daily/weekly/monthly/yearly fortune buttons
        this.timePeriodButtonsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const category = e.target.dataset.category;
                this._showCategoryFortune(category);

                this.timePeriodButtonsContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
        // Removed event listener for monthly fortune buttons (specific month)
    }

    _showCategoryFortune(category) {
        let fortuneText = "";
        switch (category) {
            case 'daily':
                fortuneText = getDailyFortune();
                break;
            case 'weekly':
                fortuneText = getWeeklyFortune();
                break;
            case 'monthly': // This is for 'current month' general fortune
                fortuneText = getMonthlyFortune(new Date().getMonth() + 1); // Get current month's generic fortune
                break;
            case 'yearly':
                fortuneText = getYearlyFortune();
                break;
            default:
                fortuneText = "운세를 불러올 수 없습니다.";
        }
        this.categoryFortuneText.textContent = fortuneText;
    }

    // Removed _showMonthlyFortune()

    displayResult(generalSajuResult) {
        const resultContainer = this.shadowRoot.querySelector('#result-container');
        this.generalFortuneText.innerHTML = generalSajuResult; // Support HTML for basic formatting
        resultContainer.style.display = 'block';

        // Automatically click "이번 달 운세" button on display
        const currentMonthButton = this.timePeriodButtonsContainer.querySelector(`[data-category="monthly"]`);
        if (currentMonthButton) {
            currentMonthButton.click();
        }

        // Removed default click for specific month
    }
}

customElements.define('saju-input-form', SajuInputForm);
customElements.define('saju-result-display', SajuResultDisplay);

document.addEventListener('sajuSubmit', (e) => {
    const sajuData = e.detail;
    const resultDisplay = document.querySelector('saju-result-display'); // Moved outside try/catch
    let fortune = ""; // Initialize to prevent reference error
    try {
        fortune = analyzeSaju(sajuData);
        console.log("Generated Fortune:", fortune); // Debugging line
        resultDisplay.displayResult(fortune);

    } catch (error) {
        console.error("Error during Saju processing or display:", error); // Debugging error
        resultDisplay.displayResult("<p style='color: red;'>운세 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>");
    }
});

function getMonthlyFortune(month) {
    switch (month) {
        case 1: return "1월: 새로운 시작의 달입니다. 계획을 세우고 실천에 옮기기 좋은 시기입니다.";
        case 2: return "2월: 인간관계에 좋은 기운이 깃듭니다. 새로운 인연을 만나거나 기존 관계가 깊어질 수 있습니다.";
        case 3: return "3월: 창의적인 활동에 좋은 성과가 기대됩니다. 예술적인 영감을 발휘해 보세요.";
        case 4: return "4월: 따뜻한 봄기운과 함께 활동적인 에너지가 넘칩니다. 야외 활동을 즐기세요.";
        case 5: return "5월: 금전적인 행운이 따를 수 있습니다. 신중한 투자는 좋은 결과로 이어질 수 있습니다.";
        case 6: return "6월: 학업이나 업무에 집중하기 좋은 시기입니다. 꾸준한 노력이 결실을 맺을 것입니다.";
        case 7: return "7월: 여행을 떠나기 좋은 달입니다. 새로운 경험을 통해 재충전의 시간을 가지세요.";
        case 8: return "8월: 건강에 유의해야 할 시기입니다. 충분한 휴식과 규칙적인 생활 습관이 중요합니다.";
        case 9: return "9월: 풍성한 결실의 계절, 그동안의 노력이 좋은 결과로 나타날 것입니다.";
        case 10: return "10월: 마음의 안정이 필요한 시기입니다. 명상이나 독서를 통해 내면을 돌보세요.";
        case 11: return "11월: 변화의 기운이 강합니다. 새로운 도전을 두려워하지 마세요.";
        case 12: return "12월: 한 해를 마무리하며 주변 사람들에게 감사의 마음을 전하기 좋은 시기입니다.";
        default: return "";
    }
}

function getDailyFortune() {
    return `오늘의 운세: 오늘은 새로운 아이디어가 샘솟는 하루가 될 것입니다. 주변 사람들과 공유하며 긍정적인 에너지를 만들어 보세요.`;
}

function getWeeklyFortune() {
    return `이번 주 운세: 이번 주는 당신의 노력이 빛을 발하는 시기입니다. 꾸준히 해왔던 일에서 좋은 결과를 기대할 수 있습니다.`;
}

function getYearlyFortune() {
    return `올해의 운세: 올해는 당신에게 성장과 변화의 기회가 가득한 한 해가 될 것입니다. 새로운 도전을 두려워 말고 적극적으로 임하세요.`;
}

function analyzeSaju(sajuData) {
    const { year, month, day, time, gender } = sajuData;
    const zodiacs = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];
    const timeNames = ["자시", "축시", "인시", "묘시", "진시", "사시", "오시", "미시", "신시", "유시", "술시", "해시"];
    const zodiac = zodiacs[year % 12];

    let fortune = `<h3>${year}년 ${month}월 ${day}일 ${timeNames[time]}에 태어난 당신의 사주를 분석해 드립니다.</h3><br>`;
    fortune += `<p>심오한 동양 철학의 지혜를 담아, 당신의 사주를 깊이 있게 풀어드립니다. 타고난 운명의 흐름과 잠재된 기운을 이해하는 것은 스스로를 알아가고 더 나은 미래를 설계하는 첫걸음이 될 것입니다.</p>`;
    fortune += `<p>당신은 ${year}년 ${month}월 ${day}일에 태어난 ${gender === 'male' ? '남성' : '여성'}이시군요.</p>`;
    fortune += `<p>당신의 띠는 <strong>${zodiac}</strong>입니다. ${zodiac}띠는 일반적으로 다음과 같은 특성을 가집니다:</p>`;

    // Expanded fortune telling logic
    if (zodiac === "용") {
        fortune += "<p><strong>용띠</strong>인 당신은 강한 리더십과 진취적인 기상을 타고났습니다. 탁월한 지략과 용맹함으로 어떤 어려움도 극복하며, 항상 높은 이상을 추구합니다. 주변 사람들에게 영감을 주고 큰 영향력을 행사할 수 있는 운명을 지녔습니다. 때로는 고집이 세다는 평가를 받을 수 있으나, 이는 목표를 향한 강한 의지의 표현입니다. 변화를 두려워하지 않고 새로운 도전을 즐기는 당신은 끊임없이 발전하며 사회에 큰 기여를 할 것입니다.</p>";
    } else if (zodiac === "호랑이") {
        fortune += "<p><strong>호랑이띠</strong>인 당신은 용감하고 정의로우며, 불의를 보면 참지 못하는 강직한 성품을 지녔습니다. 타고난 카리스마와 결단력으로 어떤 조직에서든 중심적인 역할을 합니다. 독립적인 성향이 강하며, 때로는 고독을 즐기기도 하지만, 한번 마음을 연 사람에게는 한없이 따뜻하고 의리 있는 모습을 보여줍니다. 자신의 신념을 굽히지 않고 뚝심 있게 나아가는 당신의 기백은 많은 사람들에게 귀감이 될 것입니다.</p>";
    } else {
        fortune += `<p><strong>${zodiac}띠</strong>인 당신은 성실하고 꾸준한 노력을 통해 목표를 달성하는 타입입니다. 안정적인 삶을 추구하며, 주변 사람들과의 관계를 소중히 여깁니다. 긍정적이고 온화한 성품으로 어디에서든 환영받으며, 역경에도 굴하지 않는 끈기로 결국 원하는 바를 이룰 것입니다. 꾸준함 속에서 빛나는 당신의 잠재력은 시간이 지날수록 더욱 크게 발현될 것입니다.</p>`;
    }

    fortune += `<p>태어난 시간은 <strong>${timeNames[time]}</strong>로, 이 시간에 태어난 사람은 대체로 지혜롭고 통찰력이 뛰어나며, 깊은 사색을 즐기는 경향이 있습니다. 예리한 직관력과 분석적인 사고력을 바탕으로 복잡한 문제도 명쾌하게 해결하는 능력이 있습니다. 이러한 특성은 당신의 삶의 여러 영역에서 긍정적인 영향을 미칠 것입니다.</p>`;
    fortune += `<p>이 사주 풀이를 통해 자신을 이해하고 미래를 계획하는 데 작은 도움이 되기를 바랍니다. 모든 운명은 정해진 것이 아니라 스스로 개척해나가는 것이라는 점을 기억하세요.</p>`;

    return fortune;
}

// Theme switching logic
// MBTI Test Questions and Logic
const mbtiQuestions = [
    {
        question: "1. 주로 에너지를 어디에서 얻습니까?",
        options: [
            { text: "사람들과의 교류 (외향 E)", type: "E" },
            { text: "혼자만의 시간 (내향 I)", type: "I" }
        ]
    },
    {
        question: "2. 세상을 인식하는 방법은 무엇입니까?",
        options: [
            { text: "오감에 의존한 현실적 정보 (감각 S)", type: "S" },
            { text: "직관에 의존한 가능성, 의미 (직관 N)", type: "N" }
        ]
    },
    {
        question: "3. 판단이나 결정을 내릴 때 주로 무엇에 의존합니까?",
        options: [
            { text: "논리와 분석, 객관적인 사실 (사고 T)", type: "T" },
            { text: "상황과의 조화, 사람과의 관계 (감정 F)", type: "F" }
        ]
    },
    {
        question: "4. 삶의 방식이 어떻습니까?",
        options: [
            { text: "계획적이고 체계적 (판단 J)", type: "J" },
            { text: "유연하고 자율적 (인식 P)", type: "P" }
        ]
    }
];

const mbtiResults = {
    "ISTJ": "청렴결백한 논리주의자, 세상의 소금형",
    "ISFJ": "용감한 수호자, 이타주의의 표본",
    "INFJ": "선의의 옹호자, 비전을 제시하는 예언가",
    "INTJ": "용의주도한 전략가, 가장 독립적인 사색가",
    "ISTP": "만능 재주꾼, 백과사전형",
    "ISFP": "호기심 많은 예술가, 성인군자형",
    "INFP": "열정적인 중재자, 이상을 꿈꾸는 잔다르크",
    "INTP": "논리적인 사색가, 아이디어 뱅크형",
    "ESTP": "모험을 즐기는 사업가, 수완 좋은 활동가",
    "ESFP": "자유로운 영혼의 연예인, 분위기 메이커",
    "ENFP": "재기발랄한 활동가, 분위기 조성자",
    "ENTP": "뜨거운 논쟁을 즐기는 변론가, 지적인 탐험가",
    "ESTJ": "엄격한 관리자, 타고난 리더",
    "ESFJ": "사교적인 외교관, 친선도모형",
    "ENFJ": "정의로운 사회운동가, 카리스마 넘치는 지도자",
    "ENTJ": "대담한 통솔자, 비전을 가지고 진두지휘하는 리더"
};

// Tarot Cards and Meanings (Major Arcana for simplicity)
const majorArcanaTarotCards = [
    { name: "0. 바보 (The Fool)", meaning: "새로운 시작, 자유, 모험, 순수함, 잠재력" },
    { name: "I. 마법사 (The Magician)", meaning: "능력, 의지력, 창조성, 숙련된 기술, 행동" },
    { name: "II. 고위 여사제 (The High Priestess)", meaning: "직관, 신비, 잠재의식, 지혜, 비밀" },
    { name: "III. 여황제 (The Empress)", meaning: "풍요, 모성, 자연, 아름다움, 창조력" },
    { name: "IV. 황제 (The Emperor)", meaning: "권위, 통제, 구조, 리더십, 안정성" },
    { name: "V. 교황 (The Hierophant)", meaning: "전통, 종교, 신념, 교육, 조언" },
    { name: "VI. 연인 (The Lovers)", meaning: "사랑, 관계, 선택, 조화, 가치" },
    { name: "VII. 전차 (The Chariot)", meaning: "승리, 의지, 통제, 결단력, 진전" },
    { name: "VIII. 힘 (Strength)", meaning: "용기, 인내, 자기 통제, 부드러운 힘" },
    { name: "IX. 은둔자 (The Hermit)", meaning: "성찰, 고독, 탐구, 내면의 지혜" },
    { name: "X. 운명의 수레바퀴 (Wheel of Fortune)", meaning: "운명, 전환점, 행운, 변화, 주기" },
    { name: "XI. 정의 (Justice)", meaning: "정의, 균형, 진실, 공정함, 원인과 결과" },
    { name: "XII. 매달린 남자 (The Hanged Man)", meaning: "희생, 관점 전환, 새로운 시각, 인내" },
    { name: "XIII. 죽음 (Death)", meaning: "끝, 변화, 변형, 재생, 놓아줌" },
    { name: "XIV. 절제 (Temperance)", meaning: "균형, 조화, 인내, 중용, 목적" },
    { name: "XV. 악마 (The Devil)", meaning: "속박, 물질주의, 유혹, 중독, 그림자 자아" },
    { name: "XVI. 탑 (The Tower)", meaning: "붕괴, 파괴, 계시, 갑작스러운 변화" },
    { name: "XVII. 별 (The Star)", meaning: "희망, 영감, 평온, 재생, 영성" },
    { name: "XVIII. 달 (The Moon)", meaning: "환상, 직관, 잠재의식, 혼란, 불확실성" },
    { name: "XIX. 태양 (The Sun)", meaning: "성공, 기쁨, 활력, 진실, 깨달음" },
    { name: "XX. 심판 (Judgement)", meaning: "회복, 재생, 자기 평가, 각성, 새로운 시작" },
    { name: "XXI. 세계 (The World)", meaning: "완성, 성취, 통합, 여행, 만족" }
];

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });

    // MBTI Test Logic
    const mbtiTestSection = document.getElementById('mbti-test-section');
    if (mbtiTestSection) {
        console.log("MBTI Test logic initiated."); // Debug log
        const mbtiQuestionsContainer = document.getElementById('mbti-questions');
        const mbtiStartButton = document.getElementById('mbti-start-button');
        const mbtiSubmitButton = document.getElementById('mbti-submit-button');
        const mbtiResultDiv = document.getElementById('mbti-result');
        const mbtiRestartButton = document.getElementById('mbti-restart-button');

        let userSelections = {}; // Store selected type for each question index
        let score = { "E": 0, "I": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0 };

        function renderQuestions() {
            console.log("renderQuestions called."); // Debug log
            mbtiQuestionsContainer.innerHTML = '';
            mbtiQuestions.forEach((qData, qIndex) => {
                const questionElement = document.createElement('div');
                questionElement.classList.add('mbti-question-item');
                questionElement.innerHTML = `<p>${qData.question}</p>`;
                const optionsContainer = document.createElement('div');
                optionsContainer.classList.add('mbti-options');

                qData.options.forEach((option, oIndex) => {
                    const button = document.createElement('button');
                    button.textContent = option.text;
                    button.classList.add('mbti-option-button');
                    button.dataset.questionIndex = qIndex;
                    button.dataset.optionIndex = oIndex;
                    if (userSelections[qIndex] === oIndex) {
                        button.classList.add('selected');
                    }
                    button.addEventListener('click', () => selectOption(qIndex, oIndex, option.type, button));
                    optionsContainer.appendChild(button);
                });
                questionElement.appendChild(optionsContainer);
                mbtiQuestionsContainer.appendChild(questionElement);
            });
            mbtiSubmitButton.style.display = 'none'; // Hide submit until all answered
            checkAllQuestionsAnswered(); // Initial check
            console.log("renderQuestions completed."); // Debug log
        }

        function selectOption(qIndex, oIndex, type, clickedButton) {
            console.log(`selectOption called: qIndex=${qIndex}, oIndex=${oIndex}, type=${type}`); // Debug log
            // Reset score for previous selection for this question
            if (userSelections[qIndex] !== undefined) {
                const prevType = mbtiQuestions[qIndex].options[userSelections[qIndex]].type;
                score[prevType]--;
                console.log(`Deselected previous: ${prevType}, new score:`, score); // Debug log
            }

            // Set current selection and update score
            userSelections[qIndex] = oIndex;
            score[type]++;
            console.log(`Selected: ${type}, new score:`, score, "UserSelections:", userSelections); // Debug log

            // Update button visual state
            clickedButton.closest('.mbti-options').querySelectorAll('.mbti-option-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            clickedButton.classList.add('selected');

            // Check if all questions are answered
            checkAllQuestionsAnswered();
            console.log("selectOption completed."); // Debug log
        }

        function checkAllQuestionsAnswered() {
            console.log("checkAllQuestionsAnswered called. Answered count:", Object.keys(userSelections).length, "Total questions:", mbtiQuestions.length); // Debug log
            if (Object.keys(userSelections).length === mbtiQuestions.length) {
                mbtiSubmitButton.style.display = 'block';
                console.log("All questions answered. Submit button shown."); // Debug log
            } else {
                mbtiSubmitButton.style.display = 'none';
                console.log("Not all questions answered. Submit button hidden."); // Debug log
            }
        }

        function calculateMBTI() {
            let result = "";
            result += score["E"] > score["I"] ? "E" : "I";
            result += score["S"] > score["N"] ? "S" : "N";
            result += score["T"] > score["F"] ? "T" : "F";
            result += score["J"] > score["P"] ? "J" : "P";
            console.log("Calculated MBTI:", result, "Final Score:", score); // Debug log
            return result;
        }

        function showResult() {
            console.log("showResult called."); // Debug log
            const mbtiType = calculateMBTI();
            const description = mbtiResults[mbtiType] || "결과를 알 수 없습니다.";
            mbtiResultDiv.innerHTML = `
                <h3>당신의 MBTI 유형은 <strong>${mbtiType}</strong> 입니다!</h3>
                <p>(${description})</p>
                <p>이 결과는 간이 테스트이며, 심층적인 분석과는 다를 수 있습니다. MBTI는 자신을 이해하는 도구로 활용해 보세요.</p>
                <h4>${mbtiType} 유형에 대한 추가 정보:</h4>
                <p><strong>연애 스타일:</strong> ${mbtiType} 유형은 연애에서 ... (이 부분에 'MBTI 유형별 연애가 힘든 이유와 해결책' 글의 핵심 내용을 요약하거나 링크를 추가)</p>
                <p><strong>직업 적합성:</strong> ${mbtiType} 유형은 ... (직업 관련 내용 요약)</p>
                <p><strong>강점 및 약점:</strong> ${mbtiType} 유형은 ... (강점/약점 요약)</p>
                <p>더 자세한 정보는 <a href="mbti-love.html">MBTI 유형별 연애가 힘든 이유와 해결책</a> 글을 참조하세요.</p>
            `;
            mbtiQuestionsContainer.style.display = 'none';
            mbtiSubmitButton.style.display = 'none';
            mbtiResultDiv.style.display = 'block';
            mbtiRestartButton.style.display = 'block';
            mbtiStartButton.style.display = 'none'; // Ensure start button is hidden
            console.log("Result displayed."); // Debug log
        }

        function resetTest() {
            console.log("resetTest called."); // Debug log
            userSelections = {};
            score = { "E": 0, "I": 0, "S": 0, "N": 0, "T": 0, "F": 0, "J": 0, "P": 0 };
            mbtiResultDiv.style.display = 'none';
            mbtiRestartButton.style.display = 'none';
            mbtiQuestionsContainer.innerHTML = '';
            mbtiQuestionsContainer.style.display = 'block';
            mbtiStartButton.style.display = 'block';
            mbtiSubmitButton.style.display = 'none';
            console.log("Test reset."); // Debug log
        }

        mbtiStartButton.addEventListener('click', () => {
            console.log("Start button clicked."); // Debug log
            mbtiStartButton.style.display = 'none';
            renderQuestions();
        });
        mbtiSubmitButton.addEventListener('click', showResult);
        mbtiRestartButton.addEventListener('click', resetTest);

        // Initial state: show start button
        mbtiStartButton.style.display = 'block';
        mbtiQuestionsContainer.style.display = 'none';
    }

    // Tarot Reading Logic
    const tarotReadingSection = document.getElementById('tarot-reading-section');
    if (tarotReadingSection) {
        const tarotCardsContainer = document.getElementById('tarot-cards-container');
        const tarotReadButton = document.getElementById('tarot-read-button');
        const tarotResultDiv = document.getElementById('tarot-result');
        const tarotResultText = document.getElementById('tarot-result-text');
        const tarotResetButton = document.getElementById('tarot-reset-button');

        let selectedCards = [];
        const numCardsToSelect = 3;

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        function renderTarotCards() {
            tarotCardsContainer.innerHTML = '';
            const shuffledCards = shuffleArray([...majorArcanaTarotCards]); // Shuffle a copy
            selectedCards = []; // Reset selected cards

            shuffledCards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('tarot-card', 'face-down');
                cardElement.dataset.cardIndex = index;
                cardElement.dataset.cardName = card.name;
                cardElement.innerHTML = `<div class="card-inner"><div class="card-back"></div><div class="card-front"><p>${card.name}</p></div></div>`;
                cardElement.addEventListener('click', (event) => selectTarotCard(event.currentTarget, card));
                tarotCardsContainer.appendChild(cardElement);
            });
            tarotReadButton.style.display = 'none';
            tarotResultDiv.style.display = 'none';
            tarotResetButton.style.display = 'none';
        }

        function selectTarotCard(cardElement, cardData) {
            if (cardElement.classList.contains('revealed')) return; // Cannot select revealed cards

            if (selectedCards.length < numCardsToSelect && !cardElement.classList.contains('selected')) {
                cardElement.classList.add('selected');
                selectedCards.push(cardData);

                if (selectedCards.length === numCardsToSelect) {
                    tarotReadButton.style.display = 'block';
                    tarotCardsContainer.querySelectorAll('.tarot-card:not(.selected)').forEach(card => {
                        card.classList.add('disabled'); // Disable unselected cards
                    });
                }
            } else if (cardElement.classList.contains('selected')) {
                // Deselect card
                cardElement.classList.remove('selected');
                selectedCards = selectedCards.filter(c => c.name !== cardData.name);
                tarotReadButton.style.display = 'none';
                tarotCardsContainer.querySelectorAll('.tarot-card.disabled').forEach(card => {
                    card.classList.remove('disabled'); // Re-enable cards if deselecting
                });
            }
        }

        function readTarot() {
            let resultHtml = '<h4>당신이 선택한 카드들:</h4><ul>';
            const positions = ["과거의 흐름", "현재의 상황", "미래의 조언"];

            selectedCards.forEach((card, index) => {
                const cardElement = tarotCardsContainer.querySelector(`.tarot-card[data-card-name="${card.name}"]`);
                if (cardElement) {
                    cardElement.classList.remove('face-down');
                    cardElement.classList.add('revealed');
                }
                resultHtml += `<li><strong>${index + 1}. ${positions[index]}: ${card.name}</strong> - ${card.meaning}</li>`;
            });
            resultHtml += '</ul><p>이 해석은 당신의 현재 상황과 미래의 가능성에 대한 깊은 통찰을 제공합니다. 카드의 메시지를 통해 현명한 선택을 하시길 바랍니다.</p>';
            
            tarotResultText.innerHTML = resultHtml;
            tarotResultDiv.style.display = 'block';
            tarotReadButton.style.display = 'none';
            tarotResetButton.style.display = 'block';
            tarotCardsContainer.querySelectorAll('.tarot-card').forEach(card => {
                card.removeEventListener('click', selectTarotCard); // Disable further selection
                card.classList.remove('disabled'); // Ensure all cards are clickable for reset
            });
        }

        function resetTarot() {
            renderTarotCards(); // Re-render to reset state
        }

        tarotReadButton.addEventListener('click', readTarot);
        tarotResetButton.addEventListener('click', resetTarot);

        renderTarotCards(); // Initial render of cards
    }
});
