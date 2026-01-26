
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
                 h2 {
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
        resultText.textContent = result;
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

    return fortune;
}
