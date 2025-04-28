const translatorLink = document.getElementById("translatorLink"),
      chatLink = document.getElementById("chatLink"),
      translatorSection = document.getElementById("translator"),
      chatSection = document.getElementById("chat");

translatorLink.addEventListener("click", () => {
  translatorSection.style.display = "block";
  chatSection.style.display = "none";
});

chatLink.addEventListener("click", () => {
  translatorSection.style.display = "none";
  chatSection.style.display = "block";
});

document.querySelectorAll(".lang-select").forEach(select => {
  for (let code in countries) {
    let option = `<option value="${code}">${countries[code]}</option>`;
    select.insertAdjacentHTML("beforeend", option);
  }
});

const fromText = document.querySelector(".from-text"),
      toText = document.querySelector(".to-text"),
      translateBtn = document.querySelector(".translate-btn"),
      exchangeIcon = document.querySelector(".exchange"),
      selectFrom = document.querySelector(".select-translator-from"),
      selectTo = document.querySelector(".select-translator-to"),
      icons = document.querySelectorAll(".row i");

selectFrom.value = "en-GB";
selectTo.value = "hi-IN";

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
      tempLang = selectFrom.value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectFrom.value = selectTo.value;
  selectTo.value = tempLang;
});

fromText.addEventListener("keyup", () => {
  if (!fromText.value) toText.value = "";
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  let fromLang = selectFrom.value;
  let toLang = selectTo.value;

  if (!text) {
    alert("Please enter text to translate!"); 
    return;
  }

  translateBtn.disabled = true;

  if (fromLang === toLang) {
    alert("The selected languages are the same. Please choose different languages.");
    return;
  }

  toText.setAttribute("placeholder", "Translating...");
  fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${selectFrom.value}|${selectTo.value}`)
    .then(res => res.json())
    .then(data => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach(match => {
        if (match.id === 0) {
          toText.value = match.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    })
    .catch(() => {
      toText.setAttribute("placeholder", "Error Translating...");
    });
});

icons.forEach(icon => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      let textToCopy = target.id === "from" ? fromText.value : toText.value;
      navigator.clipboard.writeText(textToCopy);
    }
  });
});

function addMessage(user, message, isUser1) {
  const messageBox = document.createElement("div");
  if (user === 'user1') {
    messageBox.className = isUser1 ? 'user1-message' : 'user1-message-box2';
  } else {
    messageBox.className = isUser1 ? 'user2-message-box2' : 'user2-message';
  }
  messageBox.textContent = message;

  const conversation = document.getElementById(`${user}-conversation`);
  conversation.appendChild(messageBox);
  conversation.scrollTop = conversation.scrollHeight;
}

function translateText(text, from, to) {
  return fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`)
    .then(res => res.json())
    .then(data => {
      const translatedText = data.responseData.translatedText;
      return translatedText;
    })
    .catch(() => "Translation error");
}

const sendUser1 = document.getElementById("send-user1");
const sendUser2 = document.getElementById("send-user2");

const sendMessage = (user, inputText, sourceLang, targetLang, isUser1) => {
  if (!inputText.trim()) return;

  addMessage(user, inputText, isUser1);

  translateText(inputText, sourceLang, targetLang)
    .then(translated => {
      addMessage(user === "user1" ? "user2" : "user1", translated, !isUser1);
    });
};


sendUser1.addEventListener("click", () => {
  const text = document.getElementById("user1-text").value.trim();
  const sourceLang = document.getElementById("user1-lang").value;
  const targetLang = document.getElementById("user2-lang").value;
  sendMessage("user1", text, sourceLang, targetLang, true);
  document.getElementById("user1-text").value = "";
});

sendUser2.addEventListener("click", () => {
  const text = document.getElementById("user2-text").value.trim();
  const sourceLang = document.getElementById("user2-lang").value;
  const targetLang = document.getElementById("user1-lang").value;
  sendMessage("user2", text, sourceLang, targetLang, false);
  document.getElementById("user2-text").value = "";
});
