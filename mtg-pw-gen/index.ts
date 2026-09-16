type CardData = {
  "object": string,
  "id": string,
  "oracle_id": string,
  "multiverse_ids": number[],
  "tcgplayer_id": number,
  "cardmarket_id": number,
  "name": string,
  "lang": string,
  "released_at": string,
  "uri": string,
  "scryfall_uri": string,
  "layout": string,
  "highres_image": boolean,
  "image_status": string,
  "image_updated_at": string,
  "image_uris": {
    "small": string,
    "normal": string,
    "large": string,
    "png": string,
    "art_crop": string,
    "border_crop": string,
    "thumb": string,
    "grid": string,
    "display": string,
    "art": string,
    "crop": string
  },
  "mana_cost": string,
  "cmc": number,
  "type_line": string,
  "oracle_text": string,
  "colors": string[],
  "color_identity": string[],
  "keywords": string[],
  "legalities": {
    "standard": "legal" | "not_legal",
    "future": "legal" | "not_legal",
    "historic": "legal" | "not_legal",
    "timeless": "legal" | "not_legal",
    "gladiator": "legal" | "not_legal",
    "pioneer": "legal" | "not_legal",
    "modern": "legal" | "not_legal",
    "legacy": "legal",
    "pauper": "legal" | "not_legal",
    "vintage": "legal" | "not_legal",
    "penny": "legal" | "not_legal",
    "commander": "legal" | "not_legal",
    "oathbreaker": "legal" | "not_legal",
    "standardbrawl": "legal" | "not_legal",
    "brawl": "legal" | "not_legal",
    "competitivebrawl": "legal" | "not_legal",
    "alchemy": "legal" | "not_legal",
    "paupercommander": "legal" | "not_legal",
    "duel": "legal" | "not_legal",
    "oldschool": "legal" | "not_legal",
    "premodern": "legal" | "not_legal",
    "predh": "legal" | "not_legal",
    "tlr": "legal" | "not_legal"
  },
  "games": string[],
  "reserved": boolean,
  "game_changer": boolean,
  "foil": boolean,
  "nonfoil": boolean,
  "finishes": string[],
  "oversized": boolean,
  "promo": boolean,
  "reprint": boolean,
  "variation": boolean,
  "set_id": string,
  "set": string,
  "set_name": string,
  "set_type": string,
  "set_uri": string,
  "set_search_uri": string,
  "scryfall_set_uri": string,
  "rulings_uri": string,
  "prints_search_uri": string,
  "collector_number": string,
  "digital": boolean,
  "rarity": string,
  "card_back_id": string,
  "artist": string,
  "artist_ids": string[],
  "illustration_id": string,
  "border_color": string,
  "frame": string,
  "frame_effects": string[],
  "security_stamp": string,
  "full_art": boolean,
  "textless": boolean,
  "booster": boolean,
  "story_spotlight": boolean,
  "promo_types": string[],
  "edhrec_rank": number,
  "preview": {
    "source": string,
    "source_uri": string,
    "previewed_at": string
  },
  "prices": {
    "usd": string,
    "usd_foil"?: string,
    "usd_etched"?: string,
    "eur"?: string,
    "eur_foil"?: string,
    "tix"?: string
  },
  "related_uris": {
    "gatherer": string,
    "tcgplayer_infinite_articles": string,
    "tcgplayer_infinite_decks": string,
    "edhrec": string
  },
  "purchase_uris": {
    "tcgplayer": string,
    "cardmarket": string,
    "cardhoarder": string
  }
}



const API: string = "https://api.scryfall.com";
const CHAR_REPLACEMENTS: Record<string, string[]> = {
    ' ': ['-', '_', '%'],
    'e': ['3'],
    'o': ['0'],
    'i': ['1', '!'],
    'b': ['8']
}

const SPECIAL_CHARS: string[] = ['!','@','#','$','%','^','&','*', '?']

async function main() {
    const password: string = await generatePassword();
    console.log(password);
}

async function generatePassword(length: number = 12): Promise<string> {
    const cardData: CardData = await getRandomCard();
    let pass: string = replaceCharacters(cardData.name, length);
    return pass;
}

// complexity should be between 0 and 1
function replaceCharacters(str: string, length: number, complexity: number = 0.2): string {
    str = str.toLowerCase();
    let new_str: string = "";
    for (let char of str) {
        if (char in CHAR_REPLACEMENTS) {
            const length: number = CHAR_REPLACEMENTS[char].length;

            if (char == ' ' || Math.random() > complexity) {
                char = CHAR_REPLACEMENTS[char][Math.floor(Math.random() * length)]
            }
        }
        if (Math.random() > 0.5) {
            char = char.toUpperCase()
        }
        new_str += char
    }

    while (new_str.length < length) {
        if (Math.random() < 0.5) {
            new_str += SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)]
        } else {
            new_str += Math.floor(Math.random() * 10) // hoping its exclusive of 10 (probably is)
        }
    }
    new_str = new_str.replaceAll(',', '');
    return new_str;
}

async function getRandomCard(bIsCommander: boolean = false): Promise<CardData> {
    const random: string = "cards/random"
    const url: string = `${API}/${random}`

    let out_string: Promise<CardData>;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status ${response.status}`)
        }

        const result: Promise<CardData> = await response.json()
        out_string = result
    } catch (error: any) {
        out_string =  error.message
    }
    return out_string;
}

main()