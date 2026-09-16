"use strict";
const API = "https://api.scryfall.com";
const CHAR_REPLACEMENTS = {
    ' ': ['-', '_', '%'],
    'e': ['3'],
    'o': ['0'],
    'i': ['1', '!'],
    'b': ['8']
};
const SPECIAL_CHARS = ['!', '@', '#', '$', '%', '^', '&', '*', '?'];
const DEFAULT_LENGTH = 12;
const DEFAULT_COMPLEXITY = 0.5;
async function generatePassword(length = 12) {
    const cardData = await getRandomCard();
    let cardName = cardData.name;
    let pass = replaceCharacters(cardName, length);
    return {cardName: cardName, pass: pass};
}
// complexity should be between 0 and 1
function replaceCharacters(str, length, complexity = DEFAULT_COMPLEXITY) {
    str = str.toLowerCase();
    let new_str = "";
    for (let char of str) {
        if (char in CHAR_REPLACEMENTS) {
            const length = CHAR_REPLACEMENTS[char].length;
            if (char == ' ' || Math.random() < complexity) {
                char = CHAR_REPLACEMENTS[char][Math.floor(Math.random() * length)];
            }
        }
        if (Math.random() > 0.5) {
            char = char.toUpperCase();
        }
        new_str += char;
    }
    while (new_str.length < length) {
        if (Math.random() < 0.5) {
            new_str += SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];
        }
        else {
            new_str += Math.floor(Math.random() * 10); // hoping its exclusive of 10 (probably is)
        }
    }
    new_str = new_str.replaceAll(',', '');
    return new_str;
}
async function getRandomCard(bIsCommander = false) {
    const random = "cards/random";
    const url = `${API}/${random}`;
    let out_string;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status ${response.status}`);
        }
        const result = await response.json();
        out_string = result;
    }
    catch (error) {
        out_string = error.message;
    }
    return out_string;
}

function setCardText(text) {
    let card_text = document.getElementById('card-text')
    if (card_text != null) {
        card_text.textContent = text
    }
}

function setPasswordText(text) {
    let password_text = document.getElementById('password-text')
    if (password_text != null) {
        password_text.textContent = text;
    }
}

function getComplexity() {
    let complexity_slider = document.getElementById("password-complexity");
    let complexity = DEFAULT_COMPLEXITY;
    if (complexity_slider != null) {
        complexity = complexity_slider.value * 0.01;
    }
    return complexity;
}


async function main() {
    let passData = await generatePassword();
    let cardName = passData.cardName;
    var password = passData.pass;
    let length = DEFAULT_LENGTH;
    var complexity = DEFAULT_COMPLEXITY;

    setPasswordText(password);
    setCardText(cardName);

    let new_password_button = document.getElementById('new-password')
    new_password_button.addEventListener('click', () => {
        generatePassword().then(passData => {
            password = passData.pass;
            cardName = passData.cardName;
            setPasswordText(password);
            setCardText(cardName)
        }).catch(error => {
            setPasswordText(`An error occurred: ${error}`)
        })
    })

    let complexity_slider = document.getElementById('password-complexity');
    complexity_slider.addEventListener('input', (event) => {
        complexity = event.target.value;
        setPasswordText(replaceCharacters(cardName, length, complexity))
    })

    let password_length_input = document.getElementById('password-length');
    password_length_input.addEventListener('input', (event) => {
        length = event.target.value;
        setPasswordText(replaceCharacters(cardName, length, complexity))
    })
}


main();