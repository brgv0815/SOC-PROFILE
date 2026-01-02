/* TYPING EFFECT */
const words = [
  "SOC Level 1 Analyst",
  "Threat Monitoring",
  "Incident Response",
  "MITRE ATT&CK Analysis"
]

let w = 0, c = 0, del = false
const typing = document.getElementById("typing-text")

function typeEffect() {
  const word = words[w]
  typing.textContent = word.substring(0, c += del ? -1 : 1)

  if (!del && c === word.length + 1) {
    del = true
    setTimeout(typeEffect, 1000)
    return
  }

  if (del && c === 0) {
    del = false
    w = (w + 1) % words.length
  }

  setTimeout(typeEffect, del ? 40 : 80)
}
typeEffect()

/* MENU */
const menuToggle = document.getElementById("menuToggle")
const sideMenu = document.getElementById("sideMenu")

menuToggle.onclick = () => {
  menuToggle.classList.toggle("active")
  sideMenu.classList.toggle("active")
}

/* ACTIVE MENU */
const sections = document.querySelectorAll("section")
const links = document.querySelectorAll(".side-menu a")

window.addEventListener("scroll", () => {
  let current = ""
  sections.forEach(s => {
    if (scrollY >= s.offsetTop - 120) current = s.id
  })
  links.forEach(l =>
    l.classList.toggle("active", l.getAttribute("href") === `#${current}`)
  )
})

/* CANVAS PULSE MAP */
const canvas = document.getElementById("mapCanvas")
const ctx = canvas.getContext("2d")

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}
resizeCanvas()
window.addEventListener("resize", resizeCanvas)

const pulses = []

function drawPulses() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  pulses.forEach((p, i) => {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(0,246,255,${p.a})`
    ctx.lineWidth = 2
    ctx.stroke()

    p.r += 0.6
    p.a -= 0.01

    if (p.a <= 0) pulses.splice(i, 1)
  })

  requestAnimationFrame(drawPulses)
}
drawPulses()

/* ALERTS + PULSE TRIGGER */
const alertFeed = document.getElementById("alert-feed")

const alertData = [
  "🚨 Brute force attack detected",
  "⚠️ Malware beacon detected",
  "🔍 IOC matched in SIEM logs",
  "🚫 Suspicious login blocked"
]

setInterval(() => {
  const text = alertData[Math.floor(Math.random() * alertData.length)]

  const div = document.createElement("div")
  div.className = "alert"
  div.textContent = `[${new Date().toLocaleTimeString()}] ${text}`

  alertFeed.prepend(div)
  if (alertFeed.children.length > 4)
    alertFeed.removeChild(alertFeed.lastChild)

  pulses.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 4,
    a: 0.8
  })
}, 5000)

/* ============================
   MITRE ATT&CK DEFENSE GAME
============================ */

const mitreStages = [
  {
    name: "Reconnaissance",
    scenario: "Attacker is scanning your environment for exposed services.",
    options: [
      "Enable network segmentation and reduce exposed services",
      "Ignore the activity",
      "Disable endpoint antivirus"
    ],
    correct: 0
  },
  {
    name: "Initial Access",
    scenario: "A phishing email delivers a malicious attachment.",
    options: [
      "Allow users to open attachments freely",
      "Email filtering and security awareness training",
      "Disable firewall rules"
    ],
    correct: 1
  },
  {
    name: "Execution",
    scenario: "Malware attempts to execute on an endpoint.",
    options: [
      "Disable endpoint logging",
      "Application allow-listing and EDR",
      "Grant admin rights to users"
    ],
    correct: 1
  },
  {
    name: "Persistence",
    scenario: "Attacker attempts to remain on the system after reboot.",
    options: [
      "Ignore startup changes",
      "Monitor registry and startup services",
      "Disable backups"
    ],
    correct: 1
  },
  {
    name: "Privilege Escalation",
    scenario: "Malware attempts to gain SYSTEM privileges.",
    options: [
      "Least privilege and patch management",
      "Disable UAC",
      "Give all users admin access"
    ],
    correct: 0
  },
  {
    name: "Defense Evasion",
    scenario: "Attack attempts to bypass detection tools.",
    options: [
      "Disable logging",
      "Behavior-based detection and SIEM monitoring",
      "Ignore alerts"
    ],
    correct: 1
  },
  {
    name: "Credential Access",
    scenario: "Credentials are being dumped from memory.",
    options: [
      "Enable Credential Guard and MFA",
      "Store passwords in plaintext",
      "Disable authentication logs"
    ],
    correct: 0
  },
  {
    name: "Lateral Movement",
    scenario: "Attacker moves across the network.",
    options: [
      "Flat network with no monitoring",
      "Network segmentation and traffic monitoring",
      "Disable firewall rules"
    ],
    correct: 1
  },
  {
    name: "Command and Control",
    scenario: "Infected host contacts a remote C2 server.",
    options: [
      "Allow all outbound traffic",
      "DNS filtering and outbound traffic inspection",
      "Disable IDS"
    ],
    correct: 1
  },
  {
    name: "Impact",
    scenario: "Ransomware encrypts critical data.",
    options: [
      "No backups configured",
      "Tested backups and incident response plan",
      "Ignore the incident"
    ],
    correct: 1
  }
]

const mitreGrid = document.getElementById("mitreGrid")
const mitreScenario = document.getElementById("mitreScenario")
const mitreOptions = document.getElementById("mitreOptions")
const mitreFeedback = document.getElementById("mitreFeedback")
const mitreReset = document.getElementById("mitreReset")

let activeStage = null
let activeIndex = null

function renderGrid() {
  mitreGrid.innerHTML = ""

  mitreStages.forEach((stage, index) => {
    const div = document.createElement("div")
    div.className = "mitre-tactic"
    div.textContent = stage.name

    div.onclick = () => selectStage(div, stage, index)
    mitreGrid.appendChild(div)
  })
}

function selectStage(div, stage, index) {
  if (div.classList.contains("locked") ||
      div.classList.contains("failed")) return

  document.querySelectorAll(".mitre-tactic")
    .forEach(t => t.classList.remove("active"))

  div.classList.add("active")
  activeStage = stage
  activeIndex = index

  mitreScenario.textContent = stage.scenario
  mitreFeedback.textContent = ""
  mitreOptions.innerHTML = ""

  stage.options.forEach((opt, i) => {
    const o = document.createElement("div")
    o.className = "mitre-option"
    o.textContent = opt
    o.onclick = () => handleChoice(o, i)
    mitreOptions.appendChild(o)
  })
}

function handleChoice(optionDiv, choiceIndex) {
  document.querySelectorAll(".mitre-option")
    .forEach(o => (o.onclick = null))

  const tactic = document.querySelectorAll(".mitre-tactic")[activeIndex]

  if (choiceIndex === activeStage.correct) {
    optionDiv.classList.add("correct")
    tactic.classList.add("locked")

    mitreFeedback.innerHTML =
      "✅ <strong>Well done.</strong> Attack successfully mitigated."
  } else {
    optionDiv.classList.add("wrong")
    tactic.classList.add("failed")

    mitreFeedback.innerHTML =
      "❌ <strong>Data loss occurred.</strong><br><br>" +
      `<strong>Correct mitigation:</strong> ${activeStage.options[activeStage.correct]}`
  }

  tactic.classList.remove("active")
  mitreOptions.innerHTML = ""

  checkCompletion()
}

function checkCompletion() {
  const done =
    document.querySelectorAll(".mitre-tactic.locked, .mitre-tactic.failed")
      .length === mitreStages.length

  if (done) {
    mitreScenario.textContent =
      "🛡️ Simulation complete. Review mitigations and outcomes."
  }
}

/* RESET */
mitreReset.onclick = () => {
  activeStage = null
  activeIndex = null
  mitreScenario.textContent = "Select a tactic to begin."
  mitreFeedback.textContent = ""
  mitreOptions.innerHTML = ""
  renderGrid()
}

/* INIT */
renderGrid()

/* ======================================
   GUIDED SOC VOICE WALKTHROUGH SYSTEM
====================================== */

const guideSteps = [
  {
    text: "Hey there! Welcome to the Security operations profile of Bhargav Mistry, your friendly neighborhood Security Analyst. Buckle up, it’s going to be fun!",
    action: () => scrollToSection(".hero")
  },
  {
    text: "Right up here, you can see live SOC alerts, think of them as the alarm bells of the cyber universe. Don’t worry, your system is not getting hacked, this are just demo alerts!",
    action: () => scrollToElement(".alerts-inline")
  },
  {
    text: "Scrolling down, you’ll see my studies and research. Yes, I actually read all those logs and tweets. No coffee was harmed in the process... mostly.",
    action: () => scrollToSection("#studies")
  },
  {
    text: "Now, the fun part! An interactive MITRE ATTACK defense simulation. Think of it like a disney movie, but instead of saving princesses, we’re saving servers!",
    action: () => scrollToSection("#mitre")
  },
  {
    text: "Choose wisely, young analyst. Wrong choices lead to data loss and unhappy sysadmins. Right choices? Glory and promotions!.....just kidding",
    action: () => highlightMitre()
  },
  {
    text: "Feel free to pause this guided tour and play the simulation. Go ahead, show those virtual attackers who’s boss!",
    action: () => scrollToSection("#mitre")
  },
  {
    text: "Now, here a second activity! Patch the vulnerability based on the instructions. Think of it like a mini coding quest for SOC glory. Don't break the system!",
    action: () => scrollToSection("#patchActivity")
  },
  {
    text: "Finally, contact details are provided for security roles, internships, and collaborative projects.",
    action: () => scrollToSection("#contact")
  },
  {
      text: "And that’s a wrap! You survived the SOC briefing. Pat yourself on the back, have a coffee, and remember: stay cyber safe!",
      action: () => {}
    }
]


let currentStep = 0
let synth = window.speechSynthesis
let utterance = null
let guideActive = false

function speakStep(stepIndex) {
  if (!guideActive || stepIndex >= guideSteps.length) return

  const step = guideSteps[stepIndex]
  step.action()

  utterance = new SpeechSynthesisUtterance(step.text)
  utterance.rate = 0.95
  utterance.pitch = 1
  utterance.volume = 1

  utterance.onend = () => {
    if (guideActive) {
      currentStep++
      setTimeout(() => speakStep(currentStep), 800)
    }
  }

  synth.speak(utterance)
}

/* HELPERS */
function scrollToSection(selector) {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
}

function scrollToElement(selector) {
  const el = document.querySelector(selector)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
}

function highlightMitre() {
  const grid = document.getElementById("mitreGrid")
  if (!grid) return
  grid.style.boxShadow = "0 0 25px rgba(0,246,255,0.6)"
  setTimeout(() => (grid.style.boxShadow = ""), 2500)
}

/* CONTROLS */
document.getElementById("startGuide").onclick = () => {
  synth.cancel()
  guideActive = true
  currentStep = 0
  speakStep(currentStep)
}

document.getElementById("pauseGuide").onclick = () => {
  synth.pause()
}

document.getElementById("resumeGuide").onclick = () => {
  synth.resume()
}

document.getElementById("stopGuide").onclick = () => {
  synth.cancel()
  guideActive = false
}

const pauseIndicator = document.getElementById("pauseIndicator")

document.getElementById("pauseGuide").onclick = () => {
  synth.pause()
  pauseIndicator.style.display = "inline"  // show indicator
}

document.getElementById("resumeGuide").onclick = () => {
  synth.resume()
  pauseIndicator.style.display = "none"    // hide indicator
}

document.getElementById("stopGuide").onclick = () => {
  synth.cancel()
  guideActive = false
  pauseIndicator.style.display = "none"    // hide if stopped
}

const tools = {
  splunk: {
    name: "Splunk",
    desc: "Used for SIEM log ingestion, correlation, alert triage, and threat investigation.",
    expertise: "Hands-on SOC lab experience with dashboards, alerts, and IOC analysis."
  },
  sentinel: {
    name: "Microsoft Sentinel",
    desc: "Cloud-native SIEM for threat detection, automation, and response.",
    expertise: "Experience creating analytics rules, investigating incidents, and tuning alerts."
  },
  wireshark: {
    name: "Wireshark",
    desc: "Packet capture and protocol analysis tool for network traffic inspection.",
    expertise: "Used to analyze suspicious traffic, DNS anomalies, and malicious connections."
  },
  nmap: {
    name: "Nmap",
    desc: "Network scanning and service discovery tool.",
    expertise: "Used for identifying exposed services and validating attack surfaces."
  },
  linux: {
    name: "Linux",
    desc: "Core operating system used across SOC tools and servers.",
    expertise: "Comfortable with logs, permissions, processes, and basic bash scripting."
  }
};

const toolButtons = document.querySelectorAll(".tool-btn");
const toolDetails = document.getElementById("toolDetails");

toolButtons.forEach(btn => {
  btn.onclick = () => {
    toolButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const key = btn.dataset.tool;
    const tool = tools[key];

    toolDetails.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.desc}</p>
      <p class="level">🛠 Expertise: ${tool.expertise}</p>
    `;
  };
});

/* ===========================
   PATCH VULNERABILITY CHALLENGE
=========================== */

const patchChallenges = [
  {
    description: "Fix the input validation to prevent SQL injection on the login form. The input must only allow alphanumeric characters.",
    answer: "input.match(/^[a-zA-Z0-9]+$/)"
  },
  {
    description: "Secure the API endpoint by adding a check for a valid API key before processing requests.",
    answer: "if(apiKey !== validKey) return error;"
  },
  {
    description: "Patch the password storage to use hashing instead of plain text. Use SHA-256.",
    answer: "hashedPassword = sha256(password)"
  },
  {
    description: "Prevent cross-site scripting by sanitizing user comments before rendering in HTML.",
    answer: "comment = sanitize(comment)"
  }
]

let currentPatch = 0

const patchDescription = document.getElementById("patchDescription")
const patchInput = document.getElementById("patchInput")
const patchSubmit = document.getElementById("patchSubmit")
const patchFeedback = document.getElementById("patchFeedback")

function loadPatch() {
  const challenge = patchChallenges[currentPatch]
  patchDescription.textContent = challenge.description
  patchInput.value = ""
  patchFeedback.textContent = ""
}

patchSubmit.onclick = () => {
  const userInput = patchInput.value.trim()
  const challenge = patchChallenges[currentPatch]

  if(userInput === challenge.answer){
    patchFeedback.style.color = "#16a34a" // green
    patchFeedback.innerHTML = "✅ Well done! Patch is correct and implemented."
    // move to next challenge
    currentPatch = (currentPatch + 1) % patchChallenges.length
    setTimeout(loadPatch, 2000)
  } else {
    patchFeedback.style.color = "#dc2626" // red
    patchFeedback.innerHTML = "❌ Patch failed, data risk remains.<br>Correct solution: " + challenge.answer
  }
}

// Initialize first challenge
loadPatch()


