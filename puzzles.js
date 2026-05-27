/**
 * puzzles.js - Educational Quest & Bible Scripture Manager
 * Defines the 10 Floors with randomized NKJV scripture cards, rewards, and garage unlocking logic.
 */

const Puzzles = {
  stars: 0,
  currentFloor: 1,
  totalFloors: 10,
  activeQuest: null,

  // Selected customized items
  carPaint: '#ff477e',
  carAccessory: null,

  // User unlock states
  unlockedPaints: {
    '#ff477e': true, // Standard pink is unlocked
    'green': false,
    'gold': false,
    'rainbow': false,
    'purple': false,
    'white': false
  },
  
  unlockedAccessories: {
    'none': true,
    'bunny_ears': false,
    'star_wings': false,
    'roof_siren': false,
    'royal_crown': false,
    'lightning_boost': false
  },

  // Pool of 30 NKJV Scriptures for randomization
  scripturePool: [
    {
      verse: "He who does not love does not know God, for God is love.",
      citation: "1 John 4:8 (NKJV)",
      prompt: "Who is love according to 1 John 4:8?",
      blank: "God",
      choices: ["God", "A Cloud", "A Mountain"]
    },
    {
      verse: "Children, obey your parents in all things, for this is well pleasing to the Lord.",
      citation: "Colossians 3:20 (NKJV)",
      prompt: "What are children told to do in Colossians 3:20?",
      blank: "obey",
      choices: ["ignore", "obey", "forget"]
    },
    {
      verse: "Trust in the Lord with all your heart, and lean not on your own understanding;",
      citation: "Proverbs 3:5 (NKJV)",
      prompt: "Fill in the blank: _____ in the Lord with all your heart.",
      blank: "Trust",
      choices: ["Hide", "Trust", "Sleep"]
    },
    {
      verse: "I can do all things through Christ who strengthens me.",
      citation: "Philippians 4:13 (NKJV)",
      prompt: "Who gives us strength according to Philippians 4:13?",
      blank: "Christ",
      choices: ["The Wind", "Ourselves", "Christ"]
    },
    {
      verse: "And just as you want men to do to you, you also do to them likewise.",
      citation: "Luke 6:31 (NKJV)",
      prompt: "Fill in the blank: Do to them ________.",
      blank: "likewise",
      choices: ["tomorrow", "never", "likewise"]
    },
    {
      verse: "Your word is a lamp to my feet and a light to my path.",
      citation: "Psalm 119:105 (NKJV)",
      prompt: "What is a light to our path?",
      blank: "Your word",
      choices: ["A flashlight", "Your word", "The stars"]
    },
    {
      verse: "In the beginning God created the heavens and the earth.",
      citation: "Genesis 1:1 (NKJV)",
      prompt: "Who created the heavens and the earth?",
      blank: "God",
      choices: ["God", "Nature", "A giant"]
    },
    {
      verse: "The Lord is my shepherd; I shall not want.",
      citation: "Psalm 23:1 (NKJV)",
      prompt: "Who is our shepherd in Psalm 23:1?",
      blank: "The Lord",
      choices: ["A farmer", "The Lord", "A king"]
    },
    {
      verse: "For the joy of the Lord is your strength.",
      citation: "Nehemiah 8:10 (NKJV)",
      prompt: "Fill in the blank: The joy of the Lord is your ________.",
      blank: "strength",
      choices: ["pillow", "strength", "wealth"]
    },
    {
      verse: "You are the light of the world. A city that is set on a hill cannot be hidden.",
      citation: "Matthew 5:14 (NKJV)",
      prompt: "You are the ________ of the world.",
      blank: "light",
      choices: ["light", "ruler", "shadow"]
    },
    {
      verse: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
      citation: "John 3:16 (NKJV)",
      prompt: "What did God give because He loved the world?",
      blank: "His only begotten Son",
      choices: ["A rainbow", "His only begotten Son", "A golden crown"]
    },
    {
      verse: "Be strong and of good courage; do not be afraid, nor be dismayed, for the Lord your God is with you wherever you go.",
      citation: "Joshua 1:9 (NKJV)",
      prompt: "Fill in the blank: Be strong and of good ________.",
      blank: "courage",
      choices: ["sleep", "courage", "speed"]
    },
    {
      verse: "The Lord is my light and my salvation; Whom shall I fear?",
      citation: "Psalm 27:1 (NKJV)",
      prompt: "Who is our light and salvation?",
      blank: "The Lord",
      choices: ["The sun", "The Lord", "A candle"]
    },
    {
      verse: "Oh, give thanks to the Lord, for He is good! For His mercy endures forever.",
      citation: "Psalm 136:1 (NKJV)",
      prompt: "How long does the Lord's mercy endure?",
      blank: "forever",
      choices: ["a day", "a year", "forever"]
    },
    {
      verse: "But the fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness.",
      citation: "Galatians 5:22 (NKJV)",
      prompt: "What is the fruit of the Spirit?",
      blank: "love, joy, peace",
      choices: ["gold and silver", "love, joy, peace", "apples and grapes"]
    },
    {
      verse: "A friend loves at all times, and a brother is born for adversity.",
      citation: "Proverbs 17:17 (NKJV)",
      prompt: "When does a friend love?",
      blank: "at all times",
      choices: ["only on weekends", "at all times", "only when happy"]
    },
    {
      verse: "And be kind to one another, tenderhearted, forgiving one another, even as God in Christ forgave you.",
      citation: "Ephesians 4:32 (NKJV)",
      prompt: "How should we treat one another?",
      blank: "kind",
      choices: ["mean", "kind", "loud"]
    },
    {
      verse: "This is the day the Lord has made; we will rejoice and be glad in it.",
      citation: "Psalm 118:24 (NKJV)",
      prompt: "Who made this day?",
      blank: "the Lord",
      choices: ["the calendar", "the Lord", "the weather"]
    },
    {
      verse: "The Lord is good to all, and His tender mercies are over all His works.",
      citation: "Psalm 145:9 (NKJV)",
      prompt: "Who is good to all?",
      blank: "The Lord",
      choices: ["The Lord", "The wind", "A teacher"]
    },
    {
      verse: "Delight yourself also in the Lord, and He shall give you the desires of your heart.",
      citation: "Psalm 37:4 (NKJV)",
      prompt: "Fill in the blank: ________ yourself in the Lord.",
      blank: "Delight",
      choices: ["Delight", "Hide", "Forget"]
    },
    {
      verse: "God is our refuge and strength, a very present help in trouble.",
      citation: "Psalm 46:1 (NKJV)",
      prompt: "What is God to us in times of trouble?",
      blank: "refuge and strength",
      choices: ["far away", "refuge and strength", "a mystery"]
    },
    {
      verse: "Let everything that has breath praise the Lord. Praise the Lord!",
      citation: "Psalm 150:6 (NKJV)",
      prompt: "Who should praise the Lord?",
      blank: "everything that has breath",
      choices: ["only adults", "everything that has breath", "only birds"]
    },
    {
      verse: "Cast your burden on the Lord, and He shall sustain you.",
      citation: "Psalm 55:22 (NKJV)",
      prompt: "What should we cast on the Lord?",
      blank: "your burden",
      choices: ["a net", "your burden", "a stone"]
    },
    {
      verse: "The Lord bless you and keep you.",
      citation: "Numbers 6:24 (NKJV)",
      prompt: "Fill in the blank: The Lord ________ you and keep you.",
      blank: "bless",
      choices: ["test", "bless", "forget"]
    },
    {
      verse: "Every good gift and every perfect gift is from above, and comes down from the Father of lights.",
      citation: "James 1:17 (NKJV)",
      prompt: "Where does every good gift come from?",
      blank: "from above",
      choices: ["from the store", "from above", "from the ground"]
    },
    {
      verse: "But seek first the kingdom of God and His righteousness, and all these things shall be added to you.",
      citation: "Matthew 6:33 (NKJV)",
      prompt: "What should we seek first?",
      blank: "the kingdom of God",
      choices: ["treasure", "the kingdom of God", "fame"]
    },
    {
      verse: "He has made everything beautiful in its time.",
      citation: "Ecclesiastes 3:11 (NKJV)",
      prompt: "Fill in the blank: He has made everything ________ in its time.",
      blank: "beautiful",
      choices: ["scary", "beautiful", "difficult"]
    },
    {
      verse: "The earth is the Lord's, and all its fullness, the world and those who dwell therein.",
      citation: "Psalm 24:1 (NKJV)",
      prompt: "Who does the earth belong to?",
      blank: "the Lord",
      choices: ["everyone", "the Lord", "no one"]
    },
    {
      verse: "How sweet are Your words to my taste, sweeter than honey to my mouth!",
      citation: "Psalm 119:103 (NKJV)",
      prompt: "God's words are sweeter than what?",
      blank: "honey",
      choices: ["candy", "honey", "cake"]
    },
    {
      verse: "Rejoice always, pray without ceasing, in everything give thanks.",
      citation: "1 Thessalonians 5:16-18 (NKJV)",
      prompt: "Fill in the blank: Pray without ________.",
      blank: "ceasing",
      choices: ["ceasing", "thinking", "sleeping"]
    }
  ],

  // Rewards tied to floor progression (1 per floor, independent of scripture)
  floorRewards: {
    1:  { rewardType: "paint",     rewardKey: "green",           rewardName: "Neon Green Paint",            rewardIcon: "🎨" },
    2:  { rewardType: "accessory", rewardKey: "bunny_ears",      rewardName: "Cute Bunny Ears (Decal)",     rewardIcon: "🐰" },
    3:  { rewardType: "paint",     rewardKey: "gold",            rewardName: "Royal Gold Paint",            rewardIcon: "🎨" },
    4:  { rewardType: "accessory", rewardKey: "star_wings",      rewardName: "Star Wings (Decals)",         rewardIcon: "⭐" },
    5:  { rewardType: "paint",     rewardKey: "rainbow",         rewardName: "Glittery Rainbow Paint",      rewardIcon: "🌈" },
    6:  { rewardType: "accessory", rewardKey: "roof_siren",      rewardName: "Flashing Roof Siren (Decal)", rewardIcon: "🚨" },
    7:  { rewardType: "paint",     rewardKey: "purple",          rewardName: "Cosmic Purple Paint",         rewardIcon: "🎨" },
    8:  { rewardType: "accessory", rewardKey: "royal_crown",     rewardName: "Royal Crown (Decal)",         rewardIcon: "👑" },
    9:  { rewardType: "paint",     rewardKey: "white",           rewardName: "Vibrant White Paint",         rewardIcon: "🎨" },
    10: { rewardType: "accessory", rewardKey: "lightning_boost",  rewardName: "Lightning Boost Trails!",     rewardIcon: "⚡" }
  },

  // Currently selected scripture for this floor
  currentScripture: null,

  // Setup current floor variables
  init() {
    this.stars = 0;
    this.currentFloor = 1;
    this.activeQuest = {
      scrollCollected: false,
      stage: "explore" // 'explore', 'scroll_read', 'solving', 'ready_for_next'
    };
    this.selectRandomScripture();
    this.updateHUD();
    this.initGarageUI();
    return this.activeQuest;
  },

  // Pick a random scripture from the pool for the current floor
  selectRandomScripture() {
    const idx = Math.floor(Math.random() * this.scripturePool.length);
    this.currentScripture = this.scripturePool[idx];
  },

  // Update HTML overlay labels
  updateHUD() {
    const floorEl = document.getElementById("floor-count");
    if (floorEl) floorEl.textContent = `Floor ${this.currentFloor}/${this.totalFloors}`;

    const starEl = document.getElementById("star-count");
    if (starEl) starEl.textContent = this.stars;

    const questText = document.getElementById("quest-text");
    const questIcon = document.getElementById("quest-icon-box");

    if (this.activeQuest) {
      if (!this.activeQuest.scrollCollected) {
        questText.textContent = "Find Scripture Scroll!";
        questIcon.textContent = "📜";
      } else {
        questText.textContent = "Talk to Mayor Teddy!";
        questIcon.textContent = "🐻";
      }
    }
  },

  // Open full-screen scripture reading card
  showScriptureCard(onClosedCallback) {
    const overlay = document.getElementById("scripture-card-overlay");
    const text = document.getElementById("scripture-text");
    const citation = document.getElementById("scripture-citation");
    const okBtn = document.getElementById("scripture-card-ok");
    const scriptureCloseBtn = document.getElementById("scripture-close-btn");

    const data = this.currentScripture;
    text.textContent = `"${data.verse}"`;
    citation.textContent = `— ${data.citation}`;

    overlay.classList.add("active");
    this.playRewardSound(true);

    const closeHandler = () => {
      overlay.classList.remove("active");
      this.activeQuest.scrollCollected = true;
      this.updateHUD();
      if (onClosedCallback) onClosedCallback();
    };

    okBtn.onclick = closeHandler;
    if (scriptureCloseBtn) scriptureCloseBtn.onclick = closeHandler;
  },

  // Open multiple-choice interactive Bible puzzle
  showInteractivePuzzle(onCompleteCallback) {
    const overlay = document.getElementById("puzzle-overlay");
    const header = document.getElementById("puzzle-header");
    const body = document.getElementById("puzzle-body");
    const choicesContainer = document.getElementById("puzzle-choices");
    const closeBtn = document.getElementById("puzzle-close");
    const puzzleCloseBtnTop = document.getElementById("puzzle-close-btn");

    choicesContainer.innerHTML = "";
    overlay.classList.add("active");

    const data = this.currentScripture;
    header.textContent = `Floor ${this.currentFloor} Scripture Quest!`;
    body.textContent = data.prompt;

    data.choices.forEach(ch => {
      const btn = document.createElement("button");
      btn.className = "puzzle-option-btn";
      btn.textContent = ch;
      btn.addEventListener("click", () => {
        if (ch === data.blank) {
          this.playRewardSound(true);
          overlay.classList.remove("active");
          onCompleteCallback(true);
        } else {
          this.playRewardSound(false);
          btn.style.backgroundColor = "#fee2e2";
          btn.style.borderColor = "#ef4444";
          body.textContent = "Not quite! Remember the scripture you read on the scroll!";
        }
      });
      choicesContainer.appendChild(btn);
    });

    const closeHandler = () => {
      overlay.classList.remove("active");
    };

    closeBtn.onclick = closeHandler;
    if (puzzleCloseBtnTop) puzzleCloseBtnTop.onclick = closeHandler;
  },

  // Handle successful completion of floor scripture
  clearFloor(onFinishedCallback) {
    const data = this.floorRewards[this.currentFloor];

    // Unlock cosmetic reward
    if (data.rewardType === "paint") {
      this.unlockedPaints[data.rewardKey] = true;
    } else {
      this.unlockedAccessories[data.rewardKey] = true;
    }

    // Refresh Garage layout options
    this.initGarageUI();

    // Trigger clear card
    const overlay = document.getElementById("level-clear-overlay");
    const label = document.getElementById("clear-floor-num");
    const icon = document.getElementById("reward-item-icon");
    const name = document.getElementById("reward-item-name");
    const nextBtn = document.getElementById("next-floor-btn");
    const clearCloseBtn = document.getElementById("level-clear-close-btn");

    label.textContent = `You completed Floor ${this.currentFloor}!`;
    icon.textContent = data.rewardIcon;
    name.textContent = `${data.rewardName} unlocked!`;

    overlay.classList.add("active");

    const proceedHandler = () => {
      overlay.classList.remove("active");
      this.stars += 10; // add star bundle

      if (this.currentFloor < this.totalFloors) {
        this.currentFloor += 1;
        this.selectRandomScripture();
        this.activeQuest = {
          scrollCollected: false,
          stage: "explore"
        };
        this.updateHUD();
        onFinishedCallback(false); // Move to next floor
      } else {
        // Complete victory!
        document.getElementById("victory-overlay").classList.add("active");
        onFinishedCallback(true);
      }
    };

    nextBtn.onclick = proceedHandler;
    if (clearCloseBtn) clearCloseBtn.onclick = proceedHandler;
  },


  // Setup the Garage selectors inside grid cards
  initGarageUI() {
    const paintContainer = document.getElementById("paint-choices");
    const accContainer = document.getElementById("accessory-choices");

    paintContainer.innerHTML = "";
    accContainer.innerHTML = "";

    // 1. Paint selectors
    const paints = [
      { name: "Pink", key: "#ff477e", color: "#ff477e" },
      { name: "Green", key: "green", color: "#22c55e" },
      { name: "Gold", key: "gold", color: "#fbbf24" },
      { name: "Rainbow", key: "rainbow", color: "rainbow" },
      { name: "Purple", key: "purple", color: "#a855f7" },
      { name: "White", key: "white", color: "#ffffff" }
    ];

    paints.forEach(p => {
      const swatch = document.createElement("div");
      swatch.className = "paint-swatch";
      
      const unlocked = this.unlockedPaints[p.key];
      if (!unlocked) {
        swatch.classList.add("locked");
      } else {
        if (p.key === 'rainbow') {
          swatch.style.background = "linear-gradient(45deg, red, yellow, green, blue)";
        } else {
          swatch.style.backgroundColor = p.color;
        }

        if (this.carPaint === p.key) {
          swatch.classList.add("active");
        }

        swatch.onclick = () => {
          this.carPaint = p.key;
          this.playRewardSound(true);
          this.initGarageUI(); // redraw active state
        };
      }
      paintContainer.appendChild(swatch);
    });

    // 2. Accessory selectors
    const accessories = [
      { name: "None", key: "none", icon: "🚗" },
      { name: "Bunny", key: "bunny_ears", icon: "🐰" },
      { name: "Wings", key: "star_wings", icon: "⭐" },
      { name: "Siren", key: "roof_siren", icon: "🚨" },
      { name: "Crown", key: "royal_crown", icon: "👑" },
      { name: "Lightning", key: "lightning_boost", icon: "⚡" }
    ];

    accessories.forEach(a => {
      const swatch = document.createElement("div");
      swatch.className = "accessory-swatch";
      
      const unlocked = this.unlockedAccessories[a.key];
      if (!unlocked) {
        swatch.classList.add("locked");
      } else {
        swatch.textContent = a.icon;
        
        const activeAcc = this.carAccessory || 'none';
        if (activeAcc === a.key) {
          swatch.classList.add("active");
        }

        swatch.onclick = () => {
          this.carAccessory = a.key === 'none' ? null : a.key;
          this.playRewardSound(true);
          this.initGarageUI(); // redraw
        };
      }
      accContainer.appendChild(swatch);
    });
  },

  playRewardSound(success) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      if (success) {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.24); // C6
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch(e) {}
  }
};
