// Select elements
const volumeControl = document.querySelector("#volume");
const wavePicker = document.querySelector("#waveformPicker");

// Create audio context
let context = new (window.AudioContext || window.webkitAudioContext)();

// Create gain node (amplitude/volume)
let gainNode = context.createGain();

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

// Connect oscillators to gain node
osc1.connect(gainNode);
osc2.connect(gainNode);
osc3.connect(gainNode);

// Connect gain to destination (speakers/output) & volume
gainNode.connect(context.destination);
gainNode.gain.value = volumeControl.value;

volumeControl.addEventListener("input", () => {
  gainNode.gain.value = volumeControl.value;
});

// Start tone on load
osc1.start();
osc2.start();
osc3.start();
