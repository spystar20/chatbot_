let msg = document.querySelector(".msg");
let box = document.querySelector(".container");
let img = document.querySelector(".image");
let imgInput = document.querySelector(".inputs");
let imgprint=document.querySelector(".image img")
let submit = document.querySelector('.send')
const apiKey =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDV_l9x93-EOaYie1fbiqGyjtbqQeDHXsM";
let user = {
  dat: null,
  file: { mime_type: null, data: null },
};

async function generateResonse(aiChatBox) {
  let text = aiChatBox.querySelector(".bot");
  let reqOpt = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: user.dat },(user.file.data?[{"inline_data":user.file}]:[])
    ] }],
    }),
  };

  try {
    let response = await fetch(apiKey, reqOpt);
    let data = await response.json();
    let apiResponse = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    text.innerHTML = apiResponse;
  } catch (error) {
    console.log(error);
  } finally {
    box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
    imgprint.src= `img.svg`
   imgprint.classList.remove("print")
   user.file={}
  }
}

function creatChat(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

function chatHandler(message) {
  user.dat = message;
  let html = `<div class="client">${user.dat}
  ${user.file.data?`<img src="data:${user.mime_type};base64,${user.file.data}" class="chooseimg"/>`:""}</div>
        <img id="user" src="user.png" alt="" />`;
  msg.value = "";
  let userChatBox = creatChat(html, "userchat");
  box.appendChild(userChatBox);
  box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  setTimeout(() => {
    let html = `<img id="ai" src="chatbot (1).png" alt="" />
     
        <div class="bot"> </div>`;
    let aiChatBox = creatChat(html, "ai-chat");
    box.appendChild(aiChatBox);
    generateResonse(aiChatBox);
  }, 400);
}
msg.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    chatHandler(msg.value);
  }
});
submit.addEventListener("click",()=>{
  chatHandler(msg.value);
})
imgInput.addEventListener("change", () => {
  const file = imgInput.files[0];
  if (!file) return;
  let reader = new FileReader();
  reader.onload = (e) => {
  let b64=e.target.result.split(",")[1]
  user.file = { mime_type: file.type, data: b64 }
   imgprint.src= `data:${user.mime_type};base64,${user.file.data}`
   imgprint.classList.add("print")

  };
 
  reader.readAsDataURL(file);
});
img.addEventListener("click", () => {
  img.querySelector(".inputs").click();
});

