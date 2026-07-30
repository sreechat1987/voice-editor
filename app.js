// Paste your Cloudflare Worker URL inside the quotes below
const WORKER_URL = "YOUR_CLOUDFLARE_WORKER_URL_HERE";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  alert("Voice typing is not supported in this browser. Please try using Google Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  const textArea = document.getElementById("transcription-box");
  const startBtn = document.getElementById("start-btn");
  const stopBtn = document.getElementById("stop-btn");
  const fixBtn = document.getElementById("fix-btn");
  const copyBtn = document.getElementById("copy-btn");

  let finalTranscript = "";

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

  startBtn.addEventListener("click", () => {
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  });

  stopBtn.addEventListener("click", () => {
    recognition.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });

  copyBtn.addEventListener("click", () => {
    textArea.select();
    document.execCommand("copy");
    alert("Text copied successfully!");
  });

  // Call the Cloudflare AI to fix grammar mistakes
  fixBtn.addEventListener("click", async () => {
    const originalText = textArea.value.trim();
    if (!originalText) {
      alert("Please record or type some text first!");
      return;
    }

    fixBtn.textContent = "Correcting mistakes...";
    fixBtn.disabled = true;

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText })
      });

      const data = await response.json();
      
      if (response.ok) {
        textArea.value = data.correctedText;
        finalTranscript = data.correctedText + " "; // Keep speaking aligned with corrected text
      } else {
        alert("Error: " + (data.error || "Failed to fix grammar."));
      }
    } catch (err) {
      alert("Could not connect to Cloudflare AI. Double check your Worker URL.");
    } finally {
      fixBtn.textContent = "Fix Grammar & Punctuation";
      fixBtn.disabled = false;
    }
  });
}
