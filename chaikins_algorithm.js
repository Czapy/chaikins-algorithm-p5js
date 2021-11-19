let controlPoints = [];

let iterationsSlider;
let iterationsDisplay;
let closedShapeCheckbox;
let clearControlPointsButton;

let colorPalette;

function setup() {
  createElement("h1", "Chaikin's algorithm for high speed curve generation");
  createP(`Chaikin specified a simple scheme by which curves could be generated from a given control polygon.
  The idea is unique in that the underlying mathematical description is ignored in favor of a geometric algorithm
  that just selects new control points along the line segments of the original control polygon.
  `);
  createP(`Chaikin’s method avoids the analytical definition of
  B-splines and provides a simple, elegant curve drawing mechanism that has been shown to be equivalent to a 
  quadratic B-spline curve.`);
  createCanvas(windowWidth - 50, windowHeight - 170);
  createSpan("Number of iterations");
  iterationsSlider = createSlider(0, 5, 1, 1);
  iterationsSlider.changed(draw);
  iterationsDisplay = createSpan();
  let div = createDiv();
  closedShapeCheckbox = createCheckbox("Closed shape", false);
  closedShapeCheckbox.changed(draw);
  closedShapeCheckbox.parent(div);
  clearControlPointsButton = createButton("Clear");
  clearControlPointsButton.size(60, 30);
  clearControlPointsButton.mousePressed((e) => {
    controlPoints = [];
    draw();
  });
  clearControlPointsButton.addClass("control-btn");
  clearControlPointsButton.parent(closedShapeCheckbox);

  frameRate(10);

  noFill();

  colorPalette = [
    color("#020419"),
    color("#4c1c4a"),
    color("#911c5b"),
    color("#ed513e"),
    color("#f5956c"),
    color("#faeadc"),
  ];
}

function windowResized() {
  resizeCanvas(windowWidth - 50, windowHeight - 170);
}

function mouseReleased(e) {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (e.cancelable) {
      e.preventDefault();
    }
    controlPoints.push(createVector(mouseX, mouseY));
    draw();
  }
}

function splitSegment(A, B) {
  return [p5.Vector.lerp(A, B, 0.25), p5.Vector.lerp(A, B, 0.75)];
}

function chaikinsAlgorithm(points, iterations) {
  if (iterations == 0) {
    return points;
  }

  let result = [];
  for (let i = 1; i < points.length; i++) {
    result = result.concat(splitSegment(points[i - 1], points[i]));
  }
  return chaikinsAlgorithm(result, iterations - 1);
}

function draw() {
  iterationsDisplay.html(iterationsSlider.value());

  background(240);

  // Draw control points
  stroke(0, 0, 0, 100);
  strokeWeight(6);
  noStrokeDashed();
  beginShape(POINTS);
  controlPoints.forEach((p) => {
    vertex(p.x, p.y);
  });
  endShape();

  if (controlPoints.length > 1) {
    // Draw control lines
    stroke(0, 0, 0, 50);
    strokeWeight(2);
    strokeDashed();
    for (let i = 1; i < controlPoints.length; i++) {
      line(
        controlPoints[i - 1].x,
        controlPoints[i - 1].y,
        controlPoints[i].x,
        controlPoints[i].y
      );
    }
    if (closedShapeCheckbox.checked()) {
      line(
        controlPoints[controlPoints.length - 1].x,
        controlPoints[controlPoints.length - 1].y,
        controlPoints[0].x,
        controlPoints[0].y
      );
    }

    // Calculate Chaikin's points for number of iterations based on slider
    let pointsToIterate;
    if (closedShapeCheckbox.checked() && controlPoints.length > 1) {
      pointsToIterate = [...controlPoints, controlPoints[0], controlPoints[1]];
    } else {
      pointsToIterate = [
        controlPoints[0],
        ...controlPoints,
        controlPoints[controlPoints.length - 1],
      ];
    }
    const iterations = iterationsSlider.value();
    const chaikinsPoints = chaikinsAlgorithm(pointsToIterate, iterations);

    // Draw Chaikin's lines
    // stroke(50, 50, 200);
    strokeWeight(4);
    noStrokeDashed();
    colorMode(RGB);
    for (let i = 1; i < chaikinsPoints.length; i++) {
      let progress =
        ((i - 1) / chaikinsPoints.length) * (colorPalette.length - 1);
      stroke(
        lerpColor(
          colorPalette[Math.floor(progress)],
          colorPalette[Math.floor(progress) + 1],
          progress % 1
        )
      );

      line(
        chaikinsPoints[i - 1].x,
        chaikinsPoints[i - 1].y,
        chaikinsPoints[i].x,
        chaikinsPoints[i].y
      );
    }

    // Draw Chaikin's points
    stroke(255, 0, 0, 100);
    strokeWeight(6);
    beginShape(POINTS);
    chaikinsPoints.forEach((p) => {
      vertex(p.x, p.y);
    });
    endShape();
  }
}

function strokeDashed() {
  drawingContext.setLineDash([10, 10]);
}

function noStrokeDashed() {
  drawingContext.setLineDash([]);
}
