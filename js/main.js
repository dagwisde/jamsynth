// Select elements
const volumeControl = document.querySelector("#volume");
const wavePicker = document.querySelector("#waveformPicker");
const filterFreq = document.querySelector("#filterFreq");
const filterQ = document.querySelector("#filterQ");
const filterPicker = document.querySelector("#filterPicker");
let filterDetune = document.querySelector("#filterDetune");
let canvas = document.querySelector("#visualizer");
let canvasCtx = canvas.getContext("2d");

// Create audio context
let context = new (window.AudioContext || window.webkitAudioContext)();

// Create gain node (amplitude/volume)
let gainNode = context.createGain();

// Create filter
let filter = context.createBiquadFilter();
filter.type = filterPicker.value;
filter.frequency.value = filterFreq.value;
filter.gain.value = gainNode.gain.value;
filter.detune.value = filterDetune.value;

// Oscillators (notes correspond to C major chord)
// 1
let osc1 = context.createOscillator();
osc1.type = wavePicker.value;
osc1.frequency.value = 261.626;
// 2
let osc2 = context.createOscillator();
osc2.type = wavePicker.value;
osc2.frequency.value = 329.995;
// 3
let osc3 = context.createOscillator();
osc3.type = wavePicker.value;
osc3.frequency.value = 391.995;

/*================
    Visualizer
==================*/

// Create analyser node
let analyser = context.createAnalyser();
// Capture audio data using specific frequency domain
analyser.fftSize = 2048;
// Set buffer length
let bufferLength = analyser.frequencyBinCount;
// Create a new array to receive audio data
let dataArray = new Uint8Array(bufferLength);

function draw() {
  // Keep looping draw function
  requestAnimationFrame(draw);

  // Copy time data to array
  analyser.getByteTimeDomainData(dataArray);

  // Responsive canvas
  canvas.width = document.documentElement.clientWidth * 0.75;
  canvas.height = document.documentElement.clientHeight * 0.3;

  // Canvas fill color
  canvasCtx.fillStyle = "#08143E";
  canvasCtx.fillRect(0, 0, 500, 150);

  // Stroke gradient
  let gradient = canvasCtx.createLinearGradient(0, 0, 170, 0);
  gradient.addColorStop("0", "#632351");
  gradient.addColorStop("0.5", "#D80545");
  gradient.addColorStop("1.0", "#F77276");

  // Set width and style of stroke
  canvasCtx.lineWidth = 3;
  canvasCtx.strokeStyle = gradient;
  canvasCtx.beginPath();

  // Width of each line segment
  let sliceWidth = (500 * 4.0) / bufferLength;
  // Position to draw each segment of the line from
  let x = 0;

  // Loop through buffer, defining each segment of the waveform
  for (let i = 0; i < bufferLength; i++) {
    let v = dataArray[i] / 128.0;
    let y = (v * 150) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }
  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}

// Begin drawing
draw();

/*================
    Routing
==================*/

// Connect oscillators to filter node
osc1.connect(filter);
osc2.connect(filter);
osc3.connect(filter);

// Connect filter to analyser node
filter.connect(analyser);

// Connect analyser node to gain
analyser.connect(gainNode);

// Connect gain to destination (speakers/output) & volume
gainNode.connect(context.destination);
gainNode.gain.value = volumeControl.value;

/*==================
    Gain & Waveform
====================*/

volumeControl.addEventListener("input", () => {
  gainNode.gain.value = volumeControl.value;
});

// Waveform selection
wavePicker.addEventListener("input", () => {
  osc1.type = wavePicker.value;
  osc2.type = wavePicker.value;
  osc3.type = wavePicker.value;
});

/*================
    Filters 
==================*/

// Filter selection
filterPicker.addEventListener("change", () => {
  filter.type = filterPicker.value;
});

// Filter frequency range
filterFreq.addEventListener("input", () => {
  filter.frequency.value = filterFreq.value;
});

// Filter Q range
filterQ.addEventListener("input", () => {
  filter.Q.value = filterQ.value;
});

// Filter detune range
filterDetune.addEventListener("input", () => {
  filter.detune.value = filterDetune.value;
});

// Start tone on load
osc1.start(0);
osc2.start(0);
osc3.start(0);
