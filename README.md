# Introduction
Jyutping (粵拼) is the Cantonese pinyin.  The project is inspired by [Visual Cantonese Fonts](https://visual-fonts.com/).

<form id="inputForm">
  <label for="chineseInput">Chinese Input:</label><br>
  <textarea id="chineseInput" rows="3" cols="30">即時新聞</textarea><br><br>

  <label for="jyutpingInput">Jyutping Input:</label>
  (<a href="https://www.cantonesetools.org/en/cantonese-to-jyutping" target="_blank">Generate Jyutping from Cantonese Tools</a>)<br>
  <textarea id="jyutpingInput" rows="3" cols="30">zik1 si4 san1 man4</textarea><br><br>

  <input type="button" value="Generate" onclick="generateOutput()">
</form>

# Customize Display
<label for="rubyFontSize">Ruby Font Size:</label>
<input type="range" id="rubyFontSize" min="10" max="40" value="32" oninput="updateStyles()"><br>

<label for="rtFontSize">RT (Jyutping) Font Size:</label>
<input type="range" id="rtFontSize" min="8" max="20" value="20" oninput="updateStyles()"><br>

<label for="rubyMargin">Ruby Margin:</label>
<input type="range" id="rubyMargin" min="0" max="20" value="8" oninput="updateStyles()"><br><br>

<label for="bgColor">Background Color:</label>
<input type="color" id="bgColor" value="#ffffff" oninput="updateColors()"><br>

<label for="rubyColor">Ruby Color:</label>
<input type="color" id="rubyColor" value="#000000" oninput="updateColors()"><br>
<label for="rtColor">RT (Jyutping) Color:</label>
<input type="color" id="rtColor" value="#404040" oninput="updateColors()"><br><br>

# Output
<div id="output"></div>

<script src="./assets/js/script.js"></script>
