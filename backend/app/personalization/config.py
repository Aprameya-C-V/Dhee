from __future__ import annotations
from typing import Dict, Any

# Minimal, extensible content packs. You can expand these as needed.
REGIONS: Dict[str, Any] = {
    "India": {
        "languages": [
            "Hindi", "Urdu", "Bengali", "Odia", "Tamil", "Telugu",
            "Gujarati", "Marathi", "Kannada", "Malayalam", "English",
        ],
        "currency": "INR",
        "curriculum": "NCERT",
        "subregions": {
            "North India": {
                "languages": ["Hindi", "Urdu"],
                "examples": ["wheat farming", "Diwali", "Mughal history"],
                "focus": ["agriculture", "festivals", "history"],
            },
            "East India": {
                "languages": ["Bengali", "Odia"],
                "examples": ["tea gardens", "Durga Puja", "tribal art"],
                "focus": ["culture", "agriculture", "arts"],
            },
            "South India": {
                "languages": ["Tamil", "Telugu", "Kannada", "Malayalam"],
                "examples": ["coconut", "Pongal", "Chola temples"],
                "focus": ["cuisine", "festivals", "architecture"],
            },
            "West India": {
                "languages": ["Gujarati", "Marathi"],
                "examples": ["trade", "Navratri", "maritime history"],
                "focus": ["commerce", "festivals", "history"],
            },
        },
    },
    "Middle East": {
        "languages": ["Arabic", "English"],
        "currency": "varies",
        "curriculum": "National/Regional",
        "subregions": {
            "Levant": {
                "languages": ["Arabic"],
                "examples": ["olive farming", "Bedouin culture", "ancient history"],
            },
            "Gulf": {
                "languages": ["Arabic", "English"],
                "examples": ["oil economy", "modern architecture", "Islamic finance"],
            },
        },
    },
    "Africa": {
        "languages": ["Arabic", "French", "English", "Swahili", "Amharic", "Somali", "Hausa"],
        "currency": "varies",
        "curriculum": "National",
        "subregions": {
            "North Africa": {
                "languages": ["Arabic", "French"],
                "examples": ["Sahara", "Pharaonic history", "Mediterranean trade"],
            },
            "Central Africa": {
                "languages": ["French", "English"],
                "examples": ["rainforest ecology", "mining", "Bantu culture"],
            },
            "Horn of Africa": {
                "languages": ["Amharic", "Somali", "Oromo", "Arabic"],
                "examples": ["pastoralism", "rainwater harvesting", "khat trade", "coffee farming"],
            },
            "Sahel": {
                "languages": ["Hausa", "French", "Arabic", "English"],
                "examples": ["millet/sorghum farming", "seasonal migration", "water scarcity"],
            },
            "Great Lakes": {
                "languages": ["Swahili", "French", "English"],
                "examples": ["smallholder farming", "fishing", "volcanic soils"],
            },
        },
    },
    "Southeast Asia": {
        "languages": ["Thai", "Vietnamese", "Bahasa Indonesia", "Tagalog", "English"],
        "currency": "varies",
        "curriculum": "National",
        "subregions": {
            "Mainland": {
                "languages": ["Thai", "Vietnamese"],
                "examples": ["rice farming", "Buddhism", "colonial history"],
            },
            "Maritime": {
                "languages": ["Bahasa Indonesia", "Tagalog"],
                "examples": ["coral reefs", "Spanish influence", "maritime trade"],
            },
        },
    },
    "South America": {
        "languages": ["Portuguese", "Spanish", "English"],
        "currency": "varies",
        "curriculum": "BNCC/National",
        "subregions": {
            "Brazil": {
                "languages": ["Portuguese"],
                "examples": ["Amazon", "football", "carnival"],
                "curriculum": "BNCC",
            },
            "Andean": {
                "languages": ["Spanish"],
                "examples": ["Andes", "Incan history", "potato farming"],
            },
        },
    },
    "Central Asia": {
        "languages": [
            "Uzbek", "Tajik", "Kyrgyz", "Kazakh", "Russian", "Pashto", "Dari"
        ],
        "currency": "varies",
        "curriculum": "National",
        "subregions": {
            "Uzbekistan": {
                "languages": ["Uzbek", "Russian"],
                "examples": ["cotton farming", "bazaars", "irrigation canals"],
            },
            "Tajikistan": {
                "languages": ["Tajik", "Russian"],
                "examples": ["mountain villages", "hydropower", "apricot orchards"],
            },
            "Kyrgyzstan": {
                "languages": ["Kyrgyz", "Russian"],
                "examples": ["yurt camps", "pastoralism", "highland lakes"],
            },
            "Kazakhstan": {
                "languages": ["Kazakh", "Russian"],
                "examples": ["steppe ecology", "grain silos", "rail transport"],
            },
            "Afghanistan": {
                "languages": ["Pashto", "Dari"],
                "examples": ["wheat and saffron", "mountain passes", "karez (qanat) systems"],
            },
        },
    },
}

DOMAINS = {
    "Literacy": {
        "pedagogy": "Use simple, local stories, folk tales, and reading comprehension with vocabulary scaffolding.",
        "activities": ["phonics", "cloze passages", "summaries"]
    },
    "Numeracy": {
        "pedagogy": "Concrete-to-abstract progression; use local currency, crops, markets; emphasize estimation.",
        "activities": ["word problems", "unit conversion", "fractions"]
    },
    "STEM": {
        "pedagogy": "Hands-on, low-cost experiments using local materials; encourage inquiry and hypothesis testing.",
        "activities": ["observe-measure", "data tables", "draw conclusions"]
    },
    "Digital Literacy": {
        "pedagogy": "Mobile-first; teach safe messaging, privacy, and basic search using locally relevant apps.",
        "activities": ["safety scenarios", "app walkthroughs", "fact-checking"]
    },
    "AI Literacy": {
        "pedagogy": "Explain AI with relatable analogies; discuss local impacts (e.g., monsoon prediction); emphasize ethics.",
        "activities": ["classify items", "predict patterns", "bias reflection"]
    },
}
