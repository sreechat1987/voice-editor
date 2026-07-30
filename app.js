// Check if your browser supports voice typing
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Voice typing is not supported in this browser. Please try using Google Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true; // Keeps typing until you click stop
  recognition.interimResults = true; // Shows words on screen while you are speaking

  const textArea = document.getElementById("transcription-box");
  const startBtn = document.getElementById("start-btn");
  const stopBtn = document.getElementById("stop-btn");
  const copyBtn = document.getElementById("copy-btn");

  let finalTranscript = "";

  // When the browser hears your voice, update the text box
  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + " ";
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    textArea.value = finalTranscript + interimTranscript;
  };

  // Button: Start listening
  startBtn.addEventListener("click", () => {
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  });

  // Button: Stop listening
  stopBtn.addEventListener("click", () => {
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

  // Button: Copy to clipboard
  copyBtn.addEventListener("click", () => {
    textArea.select();
    document.execCommand("copy");
    alert("Text copied successfully!");
  });
}