let selectedVoice;
let voices = [];
let mediaRecorder;
let audioChunks = [];
let audioStream;

// Populate available voices
function populateVoices() {
    voices = speechSynthesis.getVoices();
    selectedVoice = voices[0]; // Default to the first available voice
}

speechSynthesis.onvoiceschanged = populateVoices;

// Start speaking the text and record the audio
function speak() {
    const input = document.getElementById('input').value;
    if (!input) return alert("Please enter some text.");

    // Clear any previous audio chunks
    audioChunks = [];

    const utterance = new SpeechSynthesisUtterance(input);
    utterance.voice = selectedVoice;

    // We need to create a new AudioContext to capture the speech synthesis output
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();

    // Create a MediaRecorder to capture audio from the SpeechSynthesisUtterance
    mediaRecorder = new MediaRecorder(destination.stream);

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "speech.wav"; // You can change the extension to mp3 if needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Start recording the audio
    mediaRecorder.start();
    speechSynthesis.speak(utterance);

    // When speech synthesis starts, connect it to the destination stream
    utterance.onstart = () => {
        const sourceNode = audioContext.createMediaElementSource(new Audio());
        sourceNode.connect(destination);
        sourceNode.start();
    };

    // Stop the recording once speech is finished
    utterance.onend = () => {
        mediaRecorder.stop();
    };
}

// Download Speech as Audio (for later use)
function downloadSpeech() {
    const text = document.getElementById("input").value;
    if (!text) return alert("Please enter some text to download.");

    // Create a SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;

    // Same process for capturing speech and recording it as a file
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();

    // Create a MediaRecorder to capture the audio from the speech
    mediaRecorder = new MediaRecorder(destination.stream);

    audioChunks = []; // Reset any old audio data
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "speech.wav";  // Change the extension to mp3 if needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Start recording the audio
    mediaRecorder.start();
    speechSynthesis.speak(utterance);

    // Connect the speech synthesis output to the destination
    utterance.onstart = () => {
        const sourceNode = audioContext.createMediaElementSource(new Audio());
        sourceNode.connect(destination);
        sourceNode.start();
    };

    // Stop recording once speech ends
    utterance.onend = () => {
        mediaRecorder.stop();
    };
}
