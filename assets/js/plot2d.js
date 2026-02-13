var canvas = document.querySelector("#canvas");

// Make the canvas square
canvas.height = canvas.width;

var gl = canvas.getContext("webgl");

if (!gl) {
  console.error("WebGL not supported");
}

const vertexShaderSource = 
`attribute vec4 a_position;
uniform vec2 u_resolution;
varying vec4 clip_position; 

void main() {
    gl_Position = a_position;
    clip_position = gl_Position;
}
`;

const historyLength = 160;

const fragmentShaderSource =
`precision mediump float;

uniform vec2 u_resolution;
varying vec4 clip_position; 

uniform vec2 p_0;
uniform vec2 trail[${historyLength}];

vec3 turbo_colormap(in float x) {
  // From https://gist.github.com/mikhailov-work/0d177465a8151eb6ede1768d51d476c7
  const vec4 kRedVec4 = vec4(0.13572138, 4.61539260, -42.66032258, 132.13108234);
  const vec4 kGreenVec4 = vec4(0.09140261, 2.19418839, 4.84296658, -14.18503333);
  const vec4 kBlueVec4 = vec4(0.10667330, 12.64194608, -60.58204836, 110.36276771);
  const vec2 kRedVec2 = vec2(-152.94239396, 59.28637943);
  const vec2 kGreenVec2 = vec2(4.27729857, 2.82956604);
  const vec2 kBlueVec2 = vec2(-89.90310912, 27.34824973);
  
  x = clamp(x, 0.0, 1.0);
  vec4 v4 = vec4( 1.0, x, x * x, x * x * x);
  vec2 v2 = v4.zw * v4.z;
  return vec3(
    dot(v4, kRedVec4)   + dot(v2, kRedVec2),
    dot(v4, kGreenVec4) + dot(v2, kGreenVec2),
    dot(v4, kBlueVec4)  + dot(v2, kBlueVec2)
  );
}

void main() {
    float x = clip_position.x;
    float y = clip_position.y;

    if(length(clip_position.xy - p_0) < 0.02) {
        gl_FragColor = vec4(1, 0, 1, 1);
        return;
    }

    float v = x * x + x * y + y * y;
    v /= 2.0;
    vec4 from = vec4(0, 0, 0.5, 1);
    vec4 to = vec4(0.5, 0, 0, 1);
    vec4 color = vec4(turbo_colormap(v), 1);

    float rad = 0.02;
    float trail_alpha = 0.0;
    float alpha_mult = 1.0;
    vec4 trail_color = vec4(0, 0, 0, 0);
    for (int i = ${historyLength - 1}; i >= 0; --i) {
        if(length(clip_position.xy - trail[i]) < rad) {
            trail_color = vec4(1, 0, 1, 1);
            trail_alpha = alpha_mult;
            break;
        }
        rad *= 0.98;
        alpha_mult *= 0.95;
    }

    gl_FragColor = mix(color, trail_color, trail_alpha);
}
`;

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

const program = createProgram(gl, vertexShader, fragmentShader);
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const positions = [
  -1, -1,
  -1, 1,
  1, -1,

  -1, 1,
  1, 1,
  1, -1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const dpr = window.devicePixelRatio;
  const displayWidth  = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
 
  // Check if the canvas is not the same size.
  const needResize = canvas.width  != displayWidth || 
                     canvas.height != displayHeight;
 
  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
 
  return needResize;
}

resizeCanvasToDisplaySize(gl.canvas);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);

var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

const start = { x: -0.5, y: 0.9 };
const pos = {...start};

var p0 = gl.getUniformLocation(program, "p_0");
gl.uniform2f(p0, pos.x, pos.y);

// Set trail uniform (array of vec2)
var trailLoc = gl.getUniformLocation(program, "trail");
var trailArray = [];
for (let i = 0; i < historyLength; ++i) {
  trailArray.push(pos.x, pos.y);
}
gl.uniform2fv(trailLoc, trailArray);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

var size = 2;
var type = gl.FLOAT;
gl.vertexAttribPointer(positionAttributeLocation, size, type, false, 0, 0)

var primitiveType = gl.TRIANGLES;
var offset = 0;
var count = 6;

const eta = 0.02;

function comp_grad(p) {
    // Compute gradient of x * x + x * y + y * y
    const dx = 2 * p.x + p.y;
    const dy = p.x + 2 * p.y;
    return { x: dx, y: dy };
}

const animationInterval = setInterval(() => {
  gl.useProgram(program);
  gl.uniform2f(p0, pos.x, pos.y);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(primitiveType, offset, count);

  trailArray.shift();
  trailArray.shift();
  trailArray.push(pos.x, pos.y);
  gl.uniform2fv(trailLoc, trailArray);

  const grad = comp_grad(pos);
  pos.x = pos.x - eta * grad.x;
  pos.y = pos.y - eta * grad.y;
}, 10);

function restartGD(x, y) {
  pos.x = parseFloat(x);
  pos.y = parseFloat(y);
}
