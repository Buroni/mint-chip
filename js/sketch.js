const WIDTH = 600;
const HEIGHT = 600;
const R = 50;
const DELTA = 0.0001;
const STROKE_WEIGHT = 3;
const NUM_DOTS = 3;

const rand = (max, min = 0) => min + (Math.random() * max);

let cursorOverCanvas = false;
let anchorPoints = [];

const randomPointInSegment = (p1, p2, lim = 1) => {
  /* Returns a random point between p1 and p2 with maximum lim % distance from p1 */
  const u = rand(lim);
  return [
    (1 - u) * p1[0] + u * p2[0],
    (1 - u) * p1[1] + u * p2[1]
  ];
};

const createWalk = () => {
  const n = 10;
  const points = [];

  for (let i = 0; i < n; i++) {
    if (rand(1) > 0.7 && (i !== n - 1 || points.length >= 3)) {
      continue; // Skip point in the locus with some chance
    }
    const w = rand(-30, 30); // Wobble factor
    const point = [
      (WIDTH / 2) + w + R * Math.cos(2 * i * Math.PI / n),
      (HEIGHT / 2) + w + R * Math.sin(2 * i * Math.PI / n)
    ];
    points.push(point);
  }

  if (cursorOverCanvas) {
    // Reach out to cursor on canvas hover
    const reachPoint = randomPointInSegment([WIDTH / 2, HEIGHT / 2], [mouseX, mouseY]);
    points.splice(Math.floor(Math.random() * (points.length + 1)), 0, reachPoint);
  }

  for (p of anchorPoints) {
    // Include vertices that the user has anchored
    points.splice(Math.floor(Math.random() * (points.length + 1)), 0, p);
  }

  return points;
};

const createBlob = (fillColour) => {
  const walk = createWalk();
  const points = [walk[walk.length - 1], ...walk, walk[0]];

  for (let i = 0; i < NUM_DOTS; i++) {
    circle(rand(WIDTH), rand(HEIGHT), 0.5);
  }

  fill(fillColour);
  beginShape();
  for (let p of points) {
    point(p[0], p[1]);
    curveVertex(p[0], p[1]);
  }
  curveVertex(walk[0][0], walk[0][1]);
  endShape();
};

function setup() {
  frameRate(6);

  const c = createCanvas(WIDTH, HEIGHT);
  c.mouseOut(() => (cursorOverCanvas = false));
  c.mouseOver(() => (cursorOverCanvas = true));
  c.mouseClicked(() =>  anchorPoints.push([mouseX, mouseY]));
  c.doubleClicked(() => (anchorPoints = []));
}

function draw() {
  background(210);
  curveTightness(-0.5);
  strokeWeight(STROKE_WEIGHT);
  createBlob("#FFF");
  createBlob("#ddffd9");
}

