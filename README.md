# Introduction
Jyutping (粵拼) is the Cantonese pinyin.  The project is inspired by [Visual Cantonese Fonts](https://visual-fonts.com/).

<form id="inputForm">
  <label for="chineseInput">Chinese Input:</label><br>
  <textarea id="chineseInput" rows="5" cols="30">秋曉乍來禾已熟，聖泉永溢液偏甘。</textarea><br>
  <input type="button" id="generateBtn" class="btn" value="Generate Jyutˍ₆ping-₃">
</form>

<div id="errMsg"></div>

# Rendered output
<div id="output"></div>
<div id="copyMsg"></div>

# Customize Display
<div class="row">
  <div class="column">
    <label for="rubyFontSize">Ruby Font Size:</label>
    <input type="range" id="rubyFontSize" min="10" max="40" value="32" oninput="updateStyles()"><br>

    <label for="rtFontSize">RT (Jyutping) Font Size:</label>
    <input type="range" id="rtFontSize" min="8" max="32" value="20" oninput="updateStyles()"><br>

    <label for="rubyMargin">Ruby Margin:</label>
    <input type="range" id="rubyMargin" min="0" max="20" value="8" oninput="updateStyles()">
  </div>
  <div class="column">
    <label for="bgColor">Background color:</label>
    <input type="color" id="bgColor" value="#ffffff" oninput="updateColors()"><br>

    <label for="rubyColor">Text color:</label>
    <input type="color" id="rubyColor" value="#000000" oninput="updateColors()"><br>
    <label for="rtColor">Jyutping color:</label>
    <input type="color" id="rtColor" value="#404040" oninput="updateColors()">
  </div>
</div>

<script src="./assets/js/script.js"></script>
