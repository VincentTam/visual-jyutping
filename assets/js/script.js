// URL to your raw JSON file on GitHub
const jsonUrl = './assets/js/mandarin_cantonese_data.json';

// Load JSON dict & return 2D array [[chinChar, jyut6ping3, jyutˍ₆ping-₃]]
async function getJyutping(inputChinString) {
  try {
    // Fetch the dictionary from the external JSON file
    const response = await fetch(jsonUrl);  // Adjust path as needed
    const data = await response.json();

    // Extract the Jyutping word map from the JSON data
    const jyutpingWordMap = data.jyutping_word_map;

    // Split the input string into individual characters or phrases
    const chinChars = inputChinString.split('');

    // Initialize an array to hold the resulting 2D Jyutping array
    let jyutpingResult = [];

    // Iterate through each character or phrase in the input string
    chinChars.forEach(chinChar => {
      // Check if the Chinese character exists in the Jyutping word map
      if (jyutpingWordMap[chinChar]) {
        // Add [chinChar, jyut6ping3] to the resulting 2D Jyutping array
        jyutpingResult.push([chinChar, jyutpingWordMap[chinChar].join(' ')]);
      } else {
        // If no match is found, add [chinChar, chinChar] instead
        jyutpingResult.push([chinChar, chinChar]);
      }
    });

    // Return the concatenated Jyutping results
    return jyutpingResult;
  } catch (error) {
    console.error('Error fetching or processing the JSON:', error);
    document.getElementById('errMsg').textContent = 'Error fetching or processing the JSON';
  }
}

const toneMap = {
  '1': '¯¹',
  '2': '⸍²',
  '3': '-₃',
  '4': '⸜₄',
  '5': '⸝₅',
  '6': 'ˍ₆'
};

function replaceToneSymbol(syllable) {
  const tone = syllable.slice(-1); // Get the last character (the tone)
  if (toneMap[tone]) {
    return syllable.slice(0, -1) + toneMap[tone]; // Replace the tone
  }
  return syllable; // Return unchanged if no tone number
}

const generateBtn = document.getElementById('generateBtn');
generateBtn.addEventListener('click', generateOutput);

async function generateOutput() {
  const chineseInput = document.getElementById('chineseInput').value;
  const jyutpingArray = await getJyutping(chineseInput);

  // Generate final output strings
  let htmlOutput = '';
  let jyutpingOutput = '';
  let jyutpingwTOutput = '';
  for (let i = 0; i < jyutpingArray.length; i++) {
    const jyutpingStr = jyutpingArray[i][1];
    const jyutpingWithTone = replaceToneSymbol(jyutpingStr);
    htmlOutput += isJyutPing(jyutpingStr) ?
      `<ruby>${jyutpingArray[i][0]}<rt>${jyutpingWithTone}</rt></ruby> ` :
      jyutpingStr === '\n' ? '<br>' : jyutpingStr;
    // Also store the Jyutping with IPA tone letter into the 2D Jyutping array
    jyutpingArray[i].push(jyutpingWithTone);
    jyutpingOutput += jyutpingStr + (isJyutPing(jyutpingStr) ? ' ' : '');
    jyutpingwTOutput += jyutpingWithTone + (isJyutPing(jyutpingStr) ? ' ' : '');
  }

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = htmlOutput;

  // Create copy buttons
  outputDiv.appendChild(document.createElement('br'));
  const copyJPBtn = document.createElement("button");
  copyJPBtn.classList.add("btn");
  copyJPBtn.setAttribute('id', 'copyJPBtn');
  copyJPBtn.textContent = "Copy Jyutping";
  outputDiv.appendChild(copyJPBtn);
  const copyJPwTBtn = document.createElement("button");
  copyJPwTBtn.classList.add("btn");
  copyJPwTBtn.setAttribute('id', 'copyJPwTBtn');
  copyJPwTBtn.textContent = "Copy Jyutˍ₆ping-₃";
  outputDiv.appendChild(copyJPwTBtn);
  const copyAllBtn = document.createElement("button");
  copyAllBtn.classList.add("btn");
  copyAllBtn.setAttribute('id', 'copyAllBtn');
  copyAllBtn.textContent = "Copy all text";
  outputDiv.appendChild(copyAllBtn);
  const copyHTMLBtn = document.createElement("button");
  copyHTMLBtn.classList.add("btn");
  copyHTMLBtn.setAttribute('id', 'copyHTMLBtn');
  copyHTMLBtn.textContent = "Copy HTML";
  outputDiv.appendChild(copyHTMLBtn);

  // Add listeners to each button
  copyJPBtn.addEventListener('click', (e) => {copyToClipboard(jyutpingOutput)});
  copyJPwTBtn.addEventListener('click', (e) => {copyToClipboard(jyutpingwTOutput)});
  copyHTMLBtn.addEventListener('click', (e) => {copyToClipboard(htmlOutput)});
  
  updateStyles(); // Apply any existing styles
  updateColors(); // Apply existing color settings
}

function updateStyles() {
  const rubyFontSize = document.getElementById('rubyFontSize').value + 'px';
  const rtFontSize = document.getElementById('rtFontSize').value + 'px';
  const rubyMargin = document.getElementById('rubyMargin').value + 'px';
  
  const outputDiv = document.getElementById('output');
  const rubies = outputDiv.querySelectorAll('ruby');
  const rts = outputDiv.querySelectorAll('rt');

  rubies.forEach(ruby => {
    ruby.style.fontSize = rubyFontSize;
    ruby.style.margin = rubyMargin;
  });

  rts.forEach(rt => {
    rt.style.fontSize = rtFontSize;
  });
}

function updateColors() {
  const bgColor = document.getElementById('bgColor').value;
  const rubyColor = document.getElementById('rubyColor').value;
  const rtColor = document.getElementById('rtColor').value;

  const outputDiv = document.getElementById('output');
  outputDiv.style.backgroundColor = bgColor;

  const rubies = outputDiv.querySelectorAll('ruby');
  const rts = outputDiv.querySelectorAll('rt');

  rubies.forEach(ruby => {
    ruby.style.color = rubyColor;
  });

  rts.forEach(rt => {
    rt.style.color = rtColor;
  });
}

function isJyutPing(string) {
  return /^[A-Za-z]+[1-6]$/.test(string);
}

function copyToClipboard(string) {
  navigator.clipboard.writeText(string);
  document.getElementById('copyMsg').textContent = 'Text copied.';
}
