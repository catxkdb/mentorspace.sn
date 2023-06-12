document.addEventListener("DOMContentLoaded", () => {
    const fileSelector = document.querySelector("input");
    const start = document.getElementById('convert-button')
    const img = document.getElementById("image");
    const progress = document.querySelector(".progress");
    const textarea = document.querySelector("textarea");
    const copy = document.getElementById("copy");
    const form = document.getElementById("chat-form");
    const apiKey = "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";
  
    var voiceList = document.querySelector("#voiceList");
    var btnSpeak = document.querySelector("#btnSpeak");
    var synth = window.speechSynthesis;
    var voices = [];
    var test = "";
  
    let newClassButton = document.getElementById("new-class");
    let classNumber = 0;
    let classes = [];
    let inputTextArea = document.getElementById("input");
  
    function wordCounter(text) {
      var text = input.value;
      var wordCount = 0;
      for (var i = 0; i <= text.length; i++) {
        if (text.charAt(i) == " ") {
          wordCount++;
        }
      }
      document.getElementById("word-count").innerText = wordCount + " words";
    }
  
    inputTextArea.addEventListener("keyup", (e) => {
      wordCounter(e.target.value);
    });
  
    /*newClassButton.addEventListener("click", () => {
      const newButton = document.createElement("button");
      if (classNumber > 0) {
        let num = classNumber + 1;
        const node = document.createTextNode("Class " + num);
        let newClass = [(ClassName = "Class " + num)];
        newButton.appendChild(node);
        classNumber += 1;
        classes.push(newClass);
      } else {
        const node = document.createTextNode("Class 1");
        newButton.appendChild(node);
        classNumber += 1;
        let newClass = [(ClassName = "Class 1")];
        classes.push(newClass);
      }
      const element = document.getElementById("class-container");
      element.appendChild(newButton);
      newButton.setAttribute("class", "button");
      newButton.setAttribute("id", "class-button");
    });*/
  
    PopulateVoices();
    if (speechSynthesis !== undefined) {
      speechSynthesis.onvoiceschanged = PopulateVoices;
    }
  
    btnSpeak.addEventListener("click", () => {
      var toSpeak = new SpeechSynthesisUtterance(textarea.value);
      var selectedVoiceName =
        voiceList.selectedOptions[0].getAttribute("data-name");
      voices.forEach((voice) => {
        if (voice.name === selectedVoiceName) {
          toSpeak.voice = voice;
        }
      });
      synth.speak(toSpeak);
    });
  
    function PopulateVoices() {
      voices = synth.getVoices();
      var selectedIndex =
        voiceList.selectedIndex < 0 ? 0 : voiceList.selectedIndex;
      voiceList.innerHTML = "";
      voices.forEach((voice) => {
        var listItem = document.createElement("option");
        listItem.textContent = voice.name;
        listItem.setAttribute("data-lang", voice.lang);
        listItem.setAttribute("data-name", voice.name);
        voiceList.appendChild(listItem);
      });
  
      voiceList.selectedIndex = selectedIndex;
    }
  
    //new scanner
    async function getWebCam() {
      try {
        const videoSrc = await navigator.mediaDevices.getUserMedia({ video: true });
        var video = document.getElementById("video");
        video.srcObject = videoSrc
      }
      catch (e) {
        console.log(e);
      }
    }
    getWebCam();
    var capture = document.getElementById("capture");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    capture.addEventListener("click", function() {
      context.drawImage(video, 0, 0, 650, 490);
      const pngDataUrl = canvas.toDataURL("image/png")
      img.src = pngDataUrl;
  
      toDataURL(pngDataUrl)
        .then(dataUrl => {
          console.log('Here is Base64 Url', dataUrl)
          var fileData = dataURLtoFile(dataUrl, "image.png");
          console.log("Here is JavaScript File Object", fileData)
          // Get a reference to our file input
          const fileInput = document.querySelector('input[type="file"]');
  
          // Create a new File object
          const myFile = new File(['fileData'], 'essay.png', {
            type: 'image/png',
            lastModified: new Date(),
          });
  
          // Now let's create a DataTransfer to get a FileList
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(myFile);
          fileInput.files = dataTransfer.files;
          
  
        })
    })
  
    // ***Here is the code for converting "image source" (url) to "Base64".***
  
  
    const toDataURL = (url) => fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }))
  
  
  
  
    // ***Here is code for converting "Base64" to javascript "File Object".***
  
    function dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  
  
  
    /*let rubric = " Also, make it so it gives us 12 to 15 points if the text is well-structured,     cohesive and comprehensive, 8 to 11 points if the text is generally well-stuctured and comprehensive, 5 to 7 points if the text is structured but at times difficult to follow, and 0 to 4 points if the text lacks structure and is difficult to follow. Make sure to give us the points."
      let defaultMessage = "Tell me how to improve this text by adding feedback on how the grammar and content is good or bad."*/
  
    fileSelector.onchange = () => {
      var file = fileSelector.files[0];
      var imgUrl = window.URL.createObjectURL(
        new Blob([file], { type: "image/jpg" })
      );
      img.src = imgUrl;
      context.clearRect(0, 0, 650, 490);
    };
  
    start.onclick = () => {
      console.log('e');
      textarea.value = "";
  
      const rec = new Tesseract.TesseractWorker();
  
      rec
        .recognize(fileSelector.files[0])
        .progress(function(response) {
          if (response.status == "recognizing text") {
            progress.textContent = response.status + "   " + response.progress;
          } else {
            progress.textContent = response.status;
          }
        })
        .then(function(data) {
          textarea.value = data.text;
          progress.textContent = "Done";
        });
    };
  
    copy.onclick = () => {
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(textarea.value);
    };
  
    form.addEventListener("input", () => {
      let res = [];
      let str = this.value.replace(/[\t\n\r\.\?\!]/gm, " ").split(" ");
      str.map((s) => {
        let trimStr = s.trim();
        if (trimStr.length > 0) {
          res.push(trimStr);
        }
      });
      document.getElementById("word-count").textContent = res.length + " words";
      console.log(res.length);
    });
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const message = textarea.value;
      console.log(message)
      textarea.value = "";
  
      // Use axios library to make a POST request to the OpenAI API
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          prompt:
            "Hi ChatGPT, I have some text that I would like you to evaluate and improve based on the following rubric.\
                 Please ignore the weird names for the rubric. They are special terms. Give scores from 1-6 for each criterion.\
                  WAF1: 1-6 points.\
                  WAF2: 1-6 points\
                  WAF3: 1-6 points\
                  WAF4: 1-6 points\
                  For WAF1, it refers to as of how the writer has used imagination, and a variety of sentece structure.\
                  For WAF2, it refers to as of how the writer uses ambitious vocabulary.\
                  For WAF3, it refers to as af how the writer organises the information.\
                  For WAF4, it refers to as of how the writer uses appropriate grammar, spelling and punctuation. \
                  ABSOLUTLEY remember to add score of each criteria, the writer can know where to inprove!\
                  Make sure to add the scores for each of the individiual WAFS.\
                  AND ALSO SEPERATELY ADD A TOTAL SCORE OUT OF 24, BY ADDING ALL THE CRITERIION SCORES TOGETHER!\
                  Please provide specific feedback on each criterion in the rubric, and suggest ways to improve the text.\
                  Make sure to analyse every single word in the text to give an accurate score.\
                  If anything is wrong with the text, absolutely make sure to highlight that.\
                  Make sure that the feedback is actually accurate.\
                  For example, if the spelling is wrong, please do not say that is correct.\
                  you HAVE to respond in the language inputted. So, for example, if the user types in chinese, then you have to respond in chinese.\
                  You may also add ambitious vocabulary to the improved example to make it better.\
                  Here is the text:" + message,
          model: "text-davinci-003",
          temperature: 0,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const chatbotResponse = response.data.choices[0].text;
      console.log(response)
      console.log(chatbotResponse)
  
      textarea.value = message + chatbotResponse;
    });
  });
  