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