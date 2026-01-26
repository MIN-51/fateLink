
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
                    color: #f0c479;
                }
                input, select {
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #f0c479;
                    background-color: #1a233a;
                    color: #e0e0e0;
                    font-size: 1rem;
                }
                button {
                    padding: 12px;
                    border-radius: 5px;
                    border: none;
                    background-color: #f0c479;
                    color: #1a233a;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: #d4a660;
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
                    background-color: #1a233a;
                    color: #e0e0e0;
                    display: none; /* Initially hidden */
                }
                 h2, h3 {
                    color: #f0c479;
                    text-align: center;
                    margin-bottom: 20px;
                }
                p {
                    line-height: 1.6;
                }
            </style>
            <div id="result-container">
                <h2>사주 분석 결과</h2>
                <p id="result-text"></p>
            </div>
        `;
    }

    displayResult(result) {
        const resultContainer = this.shadowRoot.querySelector('#result-container');
        const resultText = this.shadowRoot.querySelector('#result-text');
        resultText.innerHTML = result; // Allow HTML for formatting
        resultContainer.style.display = 'block';
    }
}

customElements.define('saju-input-form', SajuInputForm);
customElements.define('saju-result-display', SajuResultDisplay);

document.addEventListener('sajuSubmit', (e) => {
    const sajuData = e.detail;
    const fortune = analyzeSaju(sajuData);
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

function analyzeSaju(sajuData) {
    const { year, month, day, time, gender } = sajuData;
    const zodiacs = ["원숭이", "닭", "개", "돼지", "쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양"];
    const zodiac = zodiacs[year % 12];

    let fortune = `당신은 ${year}년 ${month}월 ${day}일에 태어난 ${gender === 'male' ? '남성' : '여성'}이시군요.`;
    fortune += ` 당신의 띠는 ${zodiac}입니다.`;

    // Simplified fortune telling logic
    if (zodiac === "용") {
        fortune += " 당신은 큰 야망을 가지고 있으며, 리더십이 뛰어납니다. 용처럼 하늘을 나는 기상으로 큰 성공을 거둘 수 있습니다.";
    } else if (zodiac === "호랑이") {
        fortune += " 당신은 용감하고 정의로운 성격을 가지고 있습니다. 때로는 고독을 즐기기도 하지만, 주변 사람들에게 신뢰를 줍니다.";
    } else {
        fortune += " 당신은 성실하고 꾸준한 노력을 통해 목표를 달성하는 타입입니다. 주변 사람들과의 관계를 소중히 여기며, 안정적인 삶을 추구합니다.";
    }

    const timeNames = ["자시", "축시", "인시", "묘시", "진시", "사시", "오시", "미시", "신시", "유시", "술시", "해시"];
    fortune += ` 태어난 시간은 ${timeNames[time]}로, 이 시간에 태어난 사람은 지혜롭고 통찰력이 뛰어납니다.`;

    // Add monthly fortunes
    fortune += "<br><br><h3>월별 운세</h3>";
    for (let i = 1; i <= 12; i++) {
        fortune += getMonthlyFortune(i) + "<br>";
    }

    return fortune;
}
