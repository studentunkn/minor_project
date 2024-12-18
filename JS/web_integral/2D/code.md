# 2D riemann-sum  
---
Using plotly.js it draw a graph and show the beautiful rectangle for the riemann-sum

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>riemann sum test</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.0/math.min.js"></script>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        input, button {
            margin: 5px;
        }
    </style>
</head>
<body>
    <div>
        <label for="equation">수식 (예: x**2): </label>
        <input id="equation" type="text" value="x**2">
        <label for="start">적분 시작점: </label>
        <input id="start" type="number" value="-5" step="0.1">
        <label for="end">적분 끝점: </label>
        <input id="end" type="number" value="5">
        <label for="dx">사각형 간격 (Delta x): </label>
        <input id="dx" type="number" step="0.1" value="1">
        <button onclick="toggleSumType()">Toggle: Lower Sum</button>
        <button onclick="plotRiemannSum()">그래프 그리기</button>
    </div>
    <div id="graph"></div>

    <script src="sketch.js"></script>
</body>
</html>`
```

`sketch.js`
```javascript
let sumType = "lower"; // Default sum type is lower

function toggleSumType() {
    sumType = sumType === "lower" ? "upper" : "lower";
    const button = document.querySelector("button[onclick='toggleSumType()']");
    button.textContent = `Toggle: ${sumType === "lower" ? "Lower Sum" : "Upper Sum"}`;
    plotRiemannSum();
}

function plotRiemannSum() {
    // 사용자 입력 값 가져오기
    const inputEquation = document.getElementById("equation").value;
    const start = parseFloat(document.getElementById("start").value);
    const end = parseFloat(document.getElementById("end").value);
    const dx = parseFloat(document.getElementById("dx").value);

    // 함수 생성
    let func;
    try {
        func = new Function("x", `return ${inputEquation};`);
    } catch (err) {
        alert("수식을 확인해주세요.");
        return;
    }

    // 그래프 데이터 생성 (연속적인 정의역)
    const xValues = [];
    const yValues = [];
    for (let x = start - 10; x <= end + 10; x += 0.1) {
        xValues.push(x);
        yValues.push(func(x));
    }

    // 리만 합 직사각형 데이터 생성
    const rectangles = [];
    const colors = ["#FF9999", "#FFCC99", "#FFFF99", "#CCFF99", "#99CCFF", "#CCCCFF"];
    for (let x = start; x < end; x += dx) {
        const height =
            sumType === "lower"
                ? Math.min(func(x), func(x + dx))
                : Math.max(func(x), func(x + dx)); // 하합/상합
        const colorIndex = Math.floor((x - start) / dx) % colors.length;
        rectangles.push({
            x: [x, x + dx, x + dx, x],
            y: [0, 0, height, height],
            type: "scatter",
            fill: "toself",
            mode: "lines",
            fillcolor: colors[colorIndex],
            line: { color: "black", width: 1 }
        });
    }

    // Plotly 데이터 배열
    const data = [
        {
            x: xValues,
            y: yValues,
            type: "scatter",
            mode: "lines",
            line: { color: "blue" },
            name: "입력된 함수"
        },
        ...rectangles // 리만 합 직사각형 추가
    ];

    // 레이아웃 설정
    const layout = {
        title: `Riemann Sum Visualization (${sumType === "lower" ? "Lower Sum" : "Upper Sum"})`,
        xaxis: { title: "x-axis", range: [start - 1, end + 1] },
        yaxis: { title: "y-axis", range: [Math.min(...yValues) - 5, Math.max(...yValues) + 5] },
        width: 900,
        height: 600
    };

    // 그래프 생성
    Plotly.newPlot("graph", data, layout);
}

// 초기 그래프 생성
plotRiemannSum();
```
