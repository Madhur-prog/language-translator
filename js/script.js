const inputLanguage =
  document.getElementById("input-language");

const outputLanguage =
  document.getElementById("output-language");

const inputText =
  document.getElementById("input-text");

const outputText =
  document.getElementById("output-text");

const inputChars =
  document.getElementById("input-chars");

const swapBtn =
  document.querySelector(".swap-position");

const uploadDocument =
  document.getElementById("upload-document");

const uploadTitle =
  document.getElementById("upload-title");

const downloadBtn =
  document.getElementById("download-btn");

const darkModeBtn =
  document.getElementById("dark-mode-btn");

function createDropdown(dropdown, selectedCode) {

  const menu =
    dropdown.querySelector(".dropdown-menu");

  menu.innerHTML = "";

  Object.entries(languages).forEach(([code, name]) => {

    const li = document.createElement("li");

    li.classList.add("option");

    if (code === selectedCode) {
      li.classList.add("active");
    }

    li.innerText = name;

    li.dataset.value = code;

    menu.appendChild(li);
  });
}


createDropdown(inputLanguage, "auto");

createDropdown(outputLanguage, "en");



document.querySelectorAll(".dropdown-container")
.forEach(dropdown => {

  const toggle =
    dropdown.querySelector(".dropdown-toggle");

  toggle.addEventListener("click", () => {

    dropdown.classList.toggle("active");
  });
});

document.querySelectorAll(".dropdown-container")
.forEach(dropdown => {

  const options =
    dropdown.querySelectorAll(".option");

  options.forEach(option => {

    option.addEventListener("click", () => {

      options.forEach(opt => {
        opt.classList.remove("active");
      });

      option.classList.add("active");

      const selected =
        dropdown.querySelector(".selected");

      selected.innerText =
        option.innerText;

      selected.dataset.value =
        option.dataset.value;

      dropdown.classList.remove("active");
    });
  });
});

inputText.addEventListener("input", () => {

  inputChars.innerText =
    inputText.value.length;
});


async function translateText() {

  const text = inputText.value.trim();

  const source =
    document.getElementById("source-language").value;

  const target =
    document.getElementById("target-language").value;

  if (text === "") {
    alert("Please enter text");
    return;
  }

  outputText.value = "Translating...";

  try {

    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;

    const response = await fetch(url);

    const data = await response.json();

    outputText.value =
      data.responseData.translatedText;

  } catch (error) {

    console.log(error);

    outputText.value =
      "Translation failed.";
  }
}

swapBtn.addEventListener("click", () => {

  const inputSelected =
    inputLanguage.querySelector(".selected");

  const outputSelected =
    outputLanguage.querySelector(".selected");

  const tempText =
    inputSelected.innerText;

  const tempValue =
    inputSelected.dataset.value;

  inputSelected.innerText =
    outputSelected.innerText;

  inputSelected.dataset.value =
    outputSelected.dataset.value;

  outputSelected.innerText =
    tempText;

  outputSelected.dataset.value =
    tempValue;

  const tempInput =
    inputText.value;

  inputText.value =
    outputText.value;

  outputText.value =
    tempInput;
});


uploadDocument.addEventListener("change", () => {

  const file =
    uploadDocument.files[0];

  if (!file) return;

  uploadTitle.innerText =
    file.name;

  const reader = new FileReader();

  reader.onload = async (e) => {

    inputText.value =
      e.target.result;

    inputChars.innerText =
      inputText.value.length;

    await translateText();
  };

  reader.readAsText(file);
});


downloadBtn.addEventListener("click", () => {

  const text =
    outputText.value;

  if (text === "") {

    alert("Nothing to download");

    return;
  }

  const blob = new Blob(
    [text],
    { type: "text/plain" }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = "translation.txt";

  a.click();

  URL.revokeObjectURL(url);
});


darkModeBtn.addEventListener("change", () => {

  document.body.classList.toggle("dark");
});



document.addEventListener("click", (e) => {

  document.querySelectorAll(".dropdown-container")
  .forEach(dropdown => {

    if (!dropdown.contains(e.target)) {

      dropdown.classList.remove("active");
    }
  });
});