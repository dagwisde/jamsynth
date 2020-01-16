// Select elements
const volumeControl = document.querySelector("#volume");
const wavePicker = document.querySelector("#waveformPicker");
const filterFreq = document.querySelector("#filterFreq");
const filterPicker = document.querySelector("#filterPicker");

// Create audio context
let context = new (window.AudioContext || window.webkitAudioContext)();

// Create gain node (amplitude/volume)
let gainNode = context.createGain();

// Create filter
let filter = context.createBiquadFilter();
filter.type = filterPicker.value;
filter.frequency.value = filterFreq.value;
filter.gain.value = gainNode.gain.value;

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

// Connect oscillators to filter node
osc1.connect(filter);
osc2.connect(filter);
osc3.connect(filter);

// Connect filter to gain node
filter.connect(gainNode);

// Connect gain to destination (speakers/output) & volume
gainNode.connect(context.destination);
gainNode.gain.value = volumeControl.value;

volumeControl.addEventListener("input", () => {
  gainNode.gain.value = volumeControl.value;
});

// Waveform selection
wavePicker.addEventListener("input", () => {
  osc1.type = wavePicker.value;
  osc2.type = wavePicker.value;
  osc3.type = wavePicker.value;
});

// Filter selection
filterPicker.addEventListener("change", () => {
  filter.type = filterPicker.value;
});

// Filter frequency range
filterFreq.addEventListener("input", () => {
  filter.frequency.value = filterFreq.value;
});

// Start tone on load
osc1.start();
osc2.start();
osc3.start();
