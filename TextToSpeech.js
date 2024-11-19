const text = document.getElementById("textToConvert");
const convertBtn = document.getElementById("convertBtn");
const saveBtn = document.getElementById("saveBtn");
const languageSelect = document.getElementById("languageSelect");

convertBtn.addEventListener('click', function () {
    const speechSynth = window.speechSynthesis;
    const enteredText = text.value;
    const error = document.querySelector('.error-para');

    if (!speechSynth.speaking && !enteredText.trim().length) {
        error.textContent = `Nothing to Convert! Enter text in the text area.`;
        return;
    }
    
    if (!speechSynth.speaking && enteredText.trim().length) {
        error.textContent = "";
        const utterance = new SpeechSynthesisUtterance(enteredText);
        utterance.lang = languageSelect.value;  

        speechSynth.speak(utterance);
        convertBtn.textContent = "Sound is Playing...";
    }

    setTimeout(() => {
        convertBtn.textContent = "Play";
    }, 5000);
});

saveBtn.addEventListener('click', function () {
    const enteredText = text.value;

    if (!enteredText.trim()) {
        alert("Please enter text before saving.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(enteredText);
    utterance.lang = languageSelect.value;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioStream = audioContext.createMediaStreamDestination();
    const audioRecorder = new MediaRecorder(audioStream.stream);

    audioRecorder.ondataavailable = function (event) {
        const audioBlob = event.data;
        const url = URL.createObjectURL(audioBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'speech.wav'; 
        link.click();
    };

    audioRecorder.start();

    window.speechSynthesis.speak(utterance);

    utterance.onend = function () {
        audioRecorder.stop();
    };
});
