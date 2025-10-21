const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");
const speakBtn = document.getElementById("speakBtn");

const OPENAI_API_KEY = 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;

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";
  addMessage("Thinking...", "bot");

  const reply = await getAIReply(text);
  const botMsg = chatBox.querySelector(".bot:last-child");
  botMsg.textContent = reply;

  speakText(reply);
}

async function getAIReply(question) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await res.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    return "?? Error connecting to AI.";
  }
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// ?? Voice input
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  voiceBtn.addEventListener("click", () => {
    recognition.start();
    voiceBtn.textContent = "???";
  });

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    userInput.value = text;
    sendMessage();
    voiceBtn.textContent = "??";
  };
} else {
  alert("Voice input not supported in this browser");
}

// ?? Speak AI reply
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

speakBtn.addEventListener("click", () => {
  const messages = chatBox.querySelectorAll(".bot");
  if (messages.length > 0) {
    const lastBot = messages[messages.length - 1].textContent;
    speakText(lastBot);
  }
});
