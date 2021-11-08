const controlPoints = [];

let iterationsSlider;
let iterationsDisplay;

let closedShapeCheckbox;

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 160);
  createSpan("Number of iterations");
  iterationsSlider = createSlider(0, 7, 0, 1);
  iterationsDisplay = createSpan();
  closedShapeCheckbox = createCheckbox("Closed shape", false);

  noFill();
}

function mouseReleased(e) {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
     if (e.cancelable) {
      e.preventDefault();
    }
    controlPoints.push(createVector(mouseX, mouseY));
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
    pointsToIterate = [...controlPoints];
  }
  const iterations = iterationsSlider.value();
  const chaikinsPoints = chaikinsAlgorithm(pointsToIterate, iterations);

  // Draw Chaikin's points
  //stroke(255, 0, 0, 100);
  //strokeWeight(6);
  //beginShape(POINTS);
  //chaikinsPoints.forEach((p) => {
  //  vertex(p.x, p.y);
  //});
  //endShape();

  // Draw Chaikin's lines
  stroke(50, 50, 200);
  strokeWeight(2);
  noStrokeDashed();
  for (let i = 1; i < chaikinsPoints.length; i++) {
    line(
      chaikinsPoints[i - 1].x,
      chaikinsPoints[i - 1].y,
      chaikinsPoints[i].x,
      chaikinsPoints[i].y
    );
  }
}

function strokeDashed() {
  drawingContext.setLineDash([10, 10]);
}

function noStrokeDashed() {
  drawingContext.setLineDash([]);
}
