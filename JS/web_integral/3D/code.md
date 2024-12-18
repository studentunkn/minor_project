# 3D riemann-sum  
---
Using plotly.js it draw a graph and show the beautiful cubism for the riemann-sum

`index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Riemann Sum and Surface Graph</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <script src="sketch.js"></script>
</head>
<body>
    <h2>3D Riemann Sum and Surface Graph</h2>

    <label for="equation3D">Equation (e.g., x^2 + y^2):</label>
    <input type="text" id="equation3D" placeholder="x^2 + y^2"><br><br>

    <label for="dx">dx (x increment):</label>
    <input type="number" id="dx" step="0.1" value="1"><br><br>

    <label for="dy">dy (y increment):</label>
    <input type="number" id="dy" step="0.1" value="1"><br><br>

    <label for="sumType">Sum Type:</label>
    <select id="sumType">
        <option value="lower">Lower Sum</option>
        <option value="upper">Upper Sum</option>
    </select><br><br>

    <button onclick="plotCombinedGraph()">Plot Graphs</button>
    <div id="riemannSum" style="width:100%; height:600px;"></div>
</body>
</html>
```

`sketch.js`
```javascript
function plotCombinedGraph() {
    const equation = document.getElementById('equation3D').value;
    const dx = parseFloat(document.getElementById('dx').value);
    const dy = parseFloat(document.getElementById('dy').value);
    const sumType = document.getElementById('sumType').value;

    let func;
    try {
        func = new Function("x", "y", `return ${equation};`);
    } catch (err) {
        alert("Invalid equation syntax.");
        return;
    }

    const riemannTraces = [];
    const startX = -5, endX = 5, startY = -5, endY = 5;

    for (let x = startX; x < endX; x += dx) {
        for (let y = startY; y < endY; y += dy) {
            const evalX = sumType === 'lower' ? x : x + dx;
            const evalY = sumType === 'lower' ? y : y + dy;
            const z = func(evalX, evalY);  
            riemannTraces.push(createCuboid(x, y, z, dx, dy));
        }
    }

    const xValues = Array.from({ length: 50 }, (_, i) => -5 + i * 0.2);
    const yValues = Array.from({ length: 50 }, (_, i) => -5 + i * 0.2);
    const zValues = xValues.map(x => yValues.map(y => func(x, y)));

    const surfaceTrace = {
        type: 'surface',
        x: xValues,
        y: yValues,
        z: zValues,
        colorscale: 'Viridis',
        opacity: 0.5 // Set a slightly lower opacity for distinction
    };

    const layout = {
        scene: {
            aspectmode: 'cube',
            xaxis: { title: 'X Axis', range: [startX, endX] },
            yaxis: { title: 'Y Axis', range: [startY, endY] },
            zaxis: { title: 'Z Axis' }
        },
        height: 600,
        width: 800
    };

    Plotly.newPlot('riemannSum', [...riemannTraces, surfaceTrace], layout);
}

function createCuboid(x, y, z, dx, dy) {
    const xCorners = [x, x + dx, x + dx, x, x, x + dx, x + dx, x];
    const yCorners = [y, y, y + dy, y + dy, y, y, y + dy, y + dy];
    const zCorners = [0, 0, 0, 0, z, z, z, z];

    return {
        type: 'mesh3d',
        x: xCorners,
        y: yCorners,
        z: zCorners,
        i: [0, 0, 0, 4, 4, 4, 4, 5, 6, 7],
        j: [1, 2, 3, 5, 6, 7, 1, 6, 7, 2],
        k: [4, 5, 6, 0, 1, 2, 7, 2, 3, 6],
        opacity: 0.8,
        color: getRandomColor()  // Distinct colors for cuboids
    };
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
```
