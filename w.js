
let selectedVoice;
let voices = [];

function populateVoices() {
    voices = speechSynthesis.getVoices();
    selectedVoice = voices[0];
}

speechSynthesis.onvoiceschanged = populateVoices;

function speak() {
    const input = document.getElementById('input').value;
    if (!input) return alert("Please enter some text.");
    const utterance = new SpeechSynthesisUtterance(input);
    utterance.voice = selectedVoice;
    speechSynthesis.speak(utterance);
}

function downloadSpeech() {
    const text = document.getElementById("input").value;
    if (!text) return alert("Please enter some text to download.");
    const audioBlob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "speech.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
