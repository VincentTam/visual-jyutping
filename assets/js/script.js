// URL to your raw JSON file on GitHub
const jsonUrl = './assets/js/mandarin_cantonese_data.json';

// Initialize a variable to store the fetched dictionary
let cachedJyutpingWordMap = null;

// Load JSON dict & return 2D array [[chinChar, jyut6ping3]]
async function getJyutping(inputChinString) {
  try {
    // Fetch the dictionary from the external JSON file only if it's not already cached
    if (!cachedJyutpingWordMap) {
      const response = await fetch(jsonUrl);  // Adjust path as needed
      const data = await response.json();

      // Extract the Jyutping word map from the JSON data
      cachedJyutpingWordMap = data.jyutping_word_map;
    }

    // Initialize an array to hold the resulting 2D Jyutping array
    let jyutpingResult = [];

    // Search substrings from Jyutping word map's keys
    let left = 0;  // candidate words' common start index
    let right = 0;  // candidate words' max end index
    while (right < inputChinString.length) {
      let longestFoundWord = '';
      // Look up to 7 characters as longer words can be divided without tone change
      while (right - left < 7) {
        let candidateWord = inputChinString.substring(left, right + 1);
        // Check if the candidate word exists in the Jyutping word map
        if (cachedJyutpingWordMap[candidateWord]) {
          longestFoundWord = candidateWord;
        }
        right++;  // Try take one more character
      }
      // Record longest found word
      if (longestFoundWord.length > 0) {
        const jyutpingsInWord = cachedJyutpingWordMap[longestFoundWord];  // e.g. [jyut6, ping3]
        for (let index = 0; index < longestFoundWord.length; index++) {
          const chinCharInWord = longestFoundWord.substring(index, index + 1);
          const jyutPingInWord = jyutpingsInWord[index];
          jyutpingResult.push([chinCharInWord, jyutPingInWord]);
        }
        left += longestFoundWord.length;  // Look at remaining characters
      } else {  // "inputChinString[left]" isn't a Chinese character
        let currentChar = inputChinString.substring(left, left + 1);
        jyutpingResult.push([currentChar, currentChar]);
        left++;
      }
      right = left;  // Update right to ensure that left ≤ right
    }

    // Return the concatenated Jyutping results
    return jyutpingResult;
  } catch (error) {
    console.error('Error fetching or processing the JSON:', error);
    document.getElementById('errMsg').textContent = 'Error fetching or processing the JSON';
  }
}

// For Discord
const dcToneMap = {
  '1': 'ˉ¹',
  '2': '⸍²',
  '3': '-₃',
  '4': '⸜₄',
  '5': '⸝₅',
  '6': 'ˍ₆'
};

// For HTML display
const webToneMap = {
  '1': 'ˉ¹',
  '2': 'ˊ²',
  '3': '˗₃',
  '4': 'ˎ₄',
  '5': 'ˏ₅',
  '6': 'ˍ₆'
};

function replaceToneSymbol(syllable, map) {
  const tone = syllable.slice(-1); // Get the last character (the tone)
  if (map[tone]) {
    return syllable.slice(0, -1) + map[tone]; // Replace the tone
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
  let jyutpingwTDCOutput = '';
  for (let i = 0; i < jyutpingArray.length; i++) {
    const jyutpingStr = jyutpingArray[i][1];
    const jyutpingWithTone = replaceToneSymbol(jyutpingStr, webToneMap);
    const jyutpingWithToneDC = replaceToneSymbol(jyutpingStr, dcToneMap);
    htmlOutput += isJyutPing(jyutpingStr) ?
      `<ruby>${jyutpingArray[i][0]}<rt>${jyutpingWithTone}</rt></ruby> ` :
      jyutpingStr === '\n' ? '<br>' : jyutpingStr;
    // Also store the Jyutping with IPA tone letter into the 2D Jyutping array
    jyutpingArray[i].push(jyutpingWithTone);
    jyutpingArray[i].push(jyutpingWithToneDC);
    jyutpingOutput += jyutpingStr + (isJyutPing(jyutpingStr) ? ' ' : '');
    jyutpingwTOutput += jyutpingWithTone + (isJyutPing(jyutpingStr) ? ' ' : '');
    jyutpingwTDCOutput += jyutpingWithToneDC + (isJyutPing(jyutpingStr) ? ' ' : '');
  }

  const allOutput = generateAllOutput(jyutpingArray);

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = htmlOutput;

  // Create copy buttons
  outputDiv.appendChild(document.createElement('br'));
  const copyJPBtn = document.createElement('button');
  copyJPBtn.classList.add('btn');
  copyJPBtn.setAttribute('id', 'copyJPBtn');
  copyJPBtn.textContent = 'Copy Jyutping';
  outputDiv.appendChild(copyJPBtn);
  const copyJPwTBtn = document.createElement('button');
  copyJPwTBtn.classList.add('btn');
  copyJPwTBtn.setAttribute('id', 'copyJPwTBtn');
  copyJPwTBtn.textContent = 'Copy Jyutˍ₆ping-₃';
  outputDiv.appendChild(copyJPwTBtn);
  const copyJPwTDCBtn = document.createElement('button');
  copyJPwTDCBtn.classList.add('btn');
  copyJPwTDCBtn.setAttribute('id', 'copyJPwTDCBtn');
  copyJPwTDCBtn.textContent = 'Copy Jyutˍ₆ping-₃ for Discord';
  outputDiv.appendChild(copyJPwTDCBtn);
  const copyAllBtn = document.createElement('button');
  copyAllBtn.classList.add('btn');
  copyAllBtn.setAttribute('id', 'copyAllBtn');
  copyAllBtn.textContent = 'Copy all text';
  outputDiv.appendChild(copyAllBtn);
  const copyHTMLBtn = document.createElement('button');
  copyHTMLBtn.classList.add('btn');
  copyHTMLBtn.setAttribute('id', 'copyHTMLBtn');
  copyHTMLBtn.textContent = 'Copy HTML';
  outputDiv.appendChild(copyHTMLBtn);

  // Add listeners to each button
  copyJPBtn.addEventListener('click', (e) => {copyToClipboard(jyutpingOutput)});
  copyJPwTBtn.addEventListener('click', (e) => {copyToClipboard(jyutpingwTOutput)});
  copyJPwTDCBtn.addEventListener('click', (e) => {copyToClipboard(jyutpingwTDCOutput)});
  copyAllBtn.addEventListener('click', (e) => {copyToClipboard(allOutput)});
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

function generateAllOutput(jyutpingArray) {
  let result = '';
  let oddLine = '';
  let evenLine = '';
  jyutpingArray.forEach(array => {
    let jyutping = array[1];
    if(isJyutPing(jyutping)) {
      const jyutpingwT = array[3];
      const leftPadding = Math.floor((11 - jyutpingwT.length) / 2);
      const rightPadding = 10 - leftPadding - jyutpingwT.length;
      oddLine += ' '.repeat(leftPadding) + jyutpingwT + ' '.repeat(rightPadding);
      evenLine += '    ' + array[0] + '    ';
    } else {
      oddLine += array[1];
      evenLine += array[1];
    }
  });
  const oddLines = oddLine.split('\n');
  const evenLines = evenLine.split('\n');
  for (let i = 0; i < oddLines.length; i++) {
    const oddLine = oddLines[i];
    const evenLine = evenLines[i];
    result += oddLine + '\n' + evenLine + '\n';
  }
  return result;
}
