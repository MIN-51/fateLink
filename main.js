
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
                    padding: 8px 12px;
                    border-radius: 5px;
                    border: 1px solid var(--primary-color);
                    background-color: transparent;
                    color: var(--primary-color);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
                }
                .fortune-category-buttons button:hover, .fortune-category-buttons button.active {
                    background-color: var(--primary-color);
                    color: var(--button-text-color);
                }
                #general-fortune-text, #category-fortune-text {
                    text-align: center;
                    min-height: 40px;
                }
                #monthly-fortune-section {
                    margin-top: 30px; /* Space between general and monthly fortune */
                    border-top: 1px solid var(--component-border-color);
                    padding-top: 20px;
                }
                 #monthly-fortune-section .fortune-category-buttons button:hover, #monthly-fortune-section .fortune-category-buttons button.active {
                    background-color: var(--primary-color);
                    color: var(--button-text-color);
                }
            </style>
            <div id="result-container">
                <h2>사주 분석 결과</h2>
                <p id="general-fortune-text"></p>
                
                <div id="category-fortune-section">
                    <h3>오늘의 운세 / 주간 운세 / 월간 운세 / 연간 운세</h3>
                    <div class="fortune-category-buttons" id="time-period-buttons">
                        <button data-category="daily">오늘의 운세</button>
                        <button data-category="weekly">이번 주 운세</button>
                        <button data-category="monthly">이번 달 운세</button>
                        <button data-category="yearly">올해의 운세</button>
                    </div>
                    <p id="category-fortune-text"></p>
                </div>

                <div id="monthly-fortune-section">
                    <h3>월별 운세</h3>
                    <p>확인하고 싶은 월을 선택하세요.</p>
                    <div class="fortune-category-buttons" id="month-buttons"></div>
                    <p id="monthly-fortune-text"></p>
                </div>
            </div>
        `;

        this.generalFortuneText = this.shadowRoot.querySelector('#general-fortune-text');
        this.categoryFortuneText = this.shadowRoot.querySelector('#category-fortune-text');
        this.timePeriodButtonsContainer = this.shadowRoot.querySelector('#time-period-buttons');
        this.monthButtonsContainer = this.shadowRoot.querySelector('#month-buttons');
        this.monthlyFortuneText = this.shadowRoot.querySelector('#monthly-fortune-text');

        this._createMonthButtons();
        this._attachEventListeners();
        this.currentSajuData = null; // To store sajuData for dynamic fortunes if needed later
    }

    _createMonthButtons() {
        for (let i = 1; i <= 12; i++) {
            const button = document.createElement('button');
            button.textContent = `${i}월`;
            button.dataset.month = i;
            this.monthButtonsContainer.appendChild(button);
        }
    }

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

        // Event listener for monthly fortune buttons (specific month)
        this.monthButtonsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const month = e.target.dataset.month;
                this._showMonthlyFortune(month);

                this.monthButtonsContainer.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            }
        });
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

    _showMonthlyFortune(month) {
        this.monthlyFortuneText.textContent = getMonthlyFortune(parseInt(month, 10));
    }

    displayResult(generalSajuResult) {
        const resultContainer = this.shadowRoot.querySelector('#result-container');
        this.generalFortuneText.innerHTML = generalSajuResult; // Support HTML for basic formatting
        resultContainer.style.display = 'block';

        // Automatically click "이번 달 운세" button on display
        const currentMonthButton = this.timePeriodButtonsContainer.querySelector(`[data-category="monthly"]`);
        if (currentMonthButton) {
            currentMonthButton.click();
        }

        // Set default to current specific month
        const currentMonth = new Date().getMonth() + 1;
        const currentSpecificMonthButton = this.monthButtonsContainer.querySelector(`[data-month="${currentMonth}"]`);
        if (currentSpecificMonthButton) {
            currentSpecificMonthButton.click();
        }
    }
}

customElements.define('saju-input-form', SajuInputForm);
customElements.define('saju-result-display', SajuResultDisplay);

document.addEventListener('sajuSubmit', (e) => {
    const sajuData = e.detail;
    let fortune = ""; // Initialize to prevent reference error
    try {
        fortune = analyzeSaju(sajuData);
        console.log("Generated Fortune:", fortune); // Debugging line
    } catch (error) {
        console.error("Error analyzing Saju:", error); // Debugging error
        fortune = "<p style='color: red;'>운세 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>";
    }
    const resultDisplay = document.querySelector('saju-result-display');
    resultDisplay.displayResult(fortune);
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
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Apply saved theme on load
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
});
