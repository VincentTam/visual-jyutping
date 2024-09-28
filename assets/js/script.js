// URL to your raw JSON file on GitHub
const jsonUrl = './assets/js/mandarin_cantonese_data.json';

// Load the JSON dictionary and return the Jyutping for an input string
async function getJyutping(inputString) {
  try {
    // Fetch the dictionary from the external JSON file
    const response = await fetch(jsonUrl);  // Adjust path as needed
    const data = await response.json();

    // Extract the Jyutping word map from the JSON data
    const jyutpingWordMap = data.jyutping_word_map;

    // Split the input string into individual characters or phrases
    const characters = inputString.split('');

    // Initialize an array to hold the Jyutping results
    let jyutpingResult = [];

    // Iterate through each character or phrase in the input string
    characters.forEach(character => {
      // Check if the character exists in the Jyutping word map
      if (jyutpingWordMap[character]) {
        // Add the Jyutping for the character to the result
        jyutpingResult.push(jyutpingWordMap[character].join(' '));
      } else {
        // If no match is found, add a placeholder or leave it blank
        jyutpingResult.push(`[No Jyutping for ${character}]`);
      }
    });

    // Return the concatenated Jyutping results
    return jyutpingResult.join(' ');
  } catch (error) {
    console.error('Error fetching or processing the JSON:', error);
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

async function generateOutput() {
  const chineseInput = document.getElementById('chineseInput').value;
  const jyutpingString = await getJyutping(chineseInput);
  document.getElementById("jyutpingOutput").textContent = jyutpingString;
  const jyutpingArray = jyutpingString.split(' ');

  // Check if the number of Chinese characters matches the Jyutping syllables
  if (chineseInput.length !== jyutpingArray.length) {
    alert('The number of Chinese characters and Jyutping syllables does not match.');
    return;
  }

  let result = '';
  for (let i = 0; i < chineseInput.length; i++) {
    const jyutpingWithTone = replaceToneSymbol(jyutpingArray[i]);
    result += `<ruby>${chineseInput[i]}<rt>${jyutpingWithTone}</rt></ruby> `;
  }

  document.getElementById('output').innerHTML = result;
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
