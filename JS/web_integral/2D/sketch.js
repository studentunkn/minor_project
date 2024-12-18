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