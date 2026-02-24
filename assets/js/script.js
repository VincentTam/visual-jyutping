// For Discord
const dcToneMap = {
  '1': 'ˉ¹',
  '2': '⸍²',
  '3': '-₃',
  '4': '⸜₄',
  '5': '⸝₅',
  '6': 'ˍ₆'
}

// For HTML display
const webToneMap = {
  '1': 'ˉ¹',
  '2': 'ˊ²',
  '3': '˗₃',
  '4': 'ˎ₄',
  '5': 'ˏ₅',
  '6': 'ˍ₆'
}

window.addEventListener('load', function() {
  const generateBtn = document.getElementById('generateBtn')
  generateBtn.addEventListener('click', generateOutput)

  function generateOutput() {
    const chineseInput = document.getElementById('chineseInput').value
    const jyutpingArray = ToJyutping.getJyutpingList(chineseInput)

    // Generate final output strings
    let htmlOutput = ''
    let jyutpingOutput = ''
    let jyutpingwTOutput = ''
    let jyutpingwTDCOutput = ''
    for (let i = 0; i < jyutpingArray.length; i++) {
      // The JS lib can return null, so need some handling
      const origStr = jyutpingArray[i][0]
      let jyutpingStr = jyutpingArray[i][1]
      const isStrJP = isJyutPing(jyutpingStr)
      if (!isStrJP) {
        jyutpingArray[i][1] = origStr
        jyutpingStr = origStr
      }
      const jyutpingWithTone = isStrJP ? replaceToneSymbol(jyutpingStr, webToneMap) : origStr
      const jyutpingWithToneDC = isStrJP ? replaceToneSymbol(jyutpingStr, dcToneMap) : origStr
      htmlOutput += isStrJP ?
        `<ruby>${origStr}<rt>${jyutpingWithTone}</rt></ruby> ` :
        jyutpingStr === '\n' ? '<br>' : origStr
      // Also store the Jyutping with IPA tone letter into the 2D Jyutping array
      jyutpingArray[i].push(jyutpingWithTone)
      jyutpingArray[i].push(jyutpingWithToneDC)
      jyutpingOutput += jyutpingStr + (isJyutPing(jyutpingStr) ? ' ' : '')
      jyutpingwTOutput += jyutpingWithTone + (isJyutPing(jyutpingStr) ? ' ' : '')
      jyutpingwTDCOutput += jyutpingWithToneDC + (isJyutPing(jyutpingStr) ? ' ' : '')
    }
    // Remove excessive spaces
    jyutpingOutput = jyutpingOutput.replace(/ {2,}/g, ' ').trim()
    jyutpingwTOutput = jyutpingwTOutput.replace(/ {2,}/g, ' ').trim()
    jyutpingwTDCOutput = jyutpingwTDCOutput.replace(/ {2,}/g, ' ').trim()

    const allOutput = generateAllOutput()

    const outputDiv = document.getElementById('output')
    outputDiv.innerHTML = htmlOutput

    // Create copy buttons
    outputDiv.appendChild(document.createElement('br'))
    const copyJPBtn = document.createElement('button')
    copyJPBtn.classList.add('btn')
    copyJPBtn.setAttribute('id', 'copyJPBtn')
    copyJPBtn.textContent = 'Copy Jyutping'
    outputDiv.appendChild(copyJPBtn)
    const copyJPwTBtn = document.createElement('button')
    copyJPwTBtn.classList.add('btn')
    copyJPwTBtn.setAttribute('id', 'copyJPwTBtn')
    copyJPwTBtn.textContent = 'Copy Jyutˍ₆ping-₃'
    outputDiv.appendChild(copyJPwTBtn)
    const copyJPwTDCBtn = document.createElement('button')
    copyJPwTDCBtn.classList.add('btn')
    copyJPwTDCBtn.setAttribute('id', 'copyJPwTDCBtn')
    copyJPwTDCBtn.textContent = 'Copy Jyutˍ₆ping-₃ for Discord'
    outputDiv.appendChild(copyJPwTDCBtn)
    const copyAllBtn = document.createElement('button')
    copyAllBtn.classList.add('btn')
    copyAllBtn.setAttribute('id', 'copyAllBtn')
    copyAllBtn.textContent = 'Copy all text'
    outputDiv.appendChild(copyAllBtn)
    const copyHTMLBtn = document.createElement('button')
    copyHTMLBtn.classList.add('btn')
    copyHTMLBtn.setAttribute('id', 'copyHTMLBtn')
    copyHTMLBtn.textContent = 'Copy HTML'
    outputDiv.appendChild(copyHTMLBtn)

    // Add listeners to each button
    copyJPBtn.addEventListener('click', (e) => {copyToClipboard(jyutpingOutput)})
    copyJPwTBtn.addEventListener('click', (e) => {copyToClipboard(jyutpingwTOutput)})
    copyJPwTDCBtn.addEventListener('click', (e) => {copyToClipboard(jyutpingwTDCOutput)})
    copyAllBtn.addEventListener('click', (e) => {copyToClipboard(allOutput)})
    copyHTMLBtn.addEventListener('click', (e) => {copyToClipboard(htmlOutput)})
    
    updateStyles(); // Apply any existing styles
    updateColors(); // Apply existing color settings

    function generateAllOutput() {
      let result = ''
      const oddLines = jyutpingwTDCOutput.split('\n')
      const evenLines = chineseInput.split('\n')
      for (let i = 0; i < oddLines.length; i++) {
        const oddLine = oddLines[i]
        const evenLine = evenLines[i]
        result += oddLine + '\n' + evenLine + '\n'
      }
      return result
    }
  }

  function updateStyles() {
    const rubyFontSize = document.getElementById('rubyFontSize').value + 'px'
    const rtFontSize = document.getElementById('rtFontSize').value + 'px'
    const rubyMargin = document.getElementById('rubyMargin').value + 'px'
    
    const outputDiv = document.getElementById('output')
    const rubies = outputDiv.querySelectorAll('ruby')
    const rts = outputDiv.querySelectorAll('rt')

    rubies.forEach(ruby => {
      ruby.style.fontSize = rubyFontSize
      ruby.style.margin = rubyMargin
    })

    rts.forEach(rt => {
      rt.style.fontSize = rtFontSize
    })
  }

  function updateColors() {
    const bgColor = document.getElementById('bgColor').value
    const rubyColor = document.getElementById('rubyColor').value
    const rtColor = document.getElementById('rtColor').value

    const outputDiv = document.getElementById('output')
    outputDiv.style.backgroundColor = bgColor

    const rubies = outputDiv.querySelectorAll('ruby')
    const rts = outputDiv.querySelectorAll('rt')

    rubies.forEach(ruby => {
      ruby.style.color = rubyColor
    })

    rts.forEach(rt => {
      rt.style.color = rtColor
    })
  }

  function copyToClipboard(string) {
    navigator.clipboard.writeText(string)
    document.getElementById('copyMsg').textContent = 'Text copied.'
  }
})

function isJyutPing(string) {
  return /^[A-Za-z]+[1-6]$/.test(string)
}

function replaceToneSymbol(syllable, map) {
  const tone = syllable.slice(-1); // Get the last character (the tone)
  if (map[tone]) {
    return syllable.slice(0, -1) + map[tone]; // Replace the tone
  }
  return syllable; // Return unchanged if no tone number
}

