let scanInProgress = false;

const xmasViruses = [
  "Audio.MariahCarey.Loop.mp3",
  "System.Grinch.StoleRoot.exe",
  "Error.404.GiftsNotFound",
  "Spy.ElfOnShelf.Watching.dll",
  "Backdoor.Chimney.Santa.sys",
  "Trojan.LastChristmas.Wham",
  "Worm.Earworm.JingleBells",
  "Gift.Coal.Lump.bat",
  "Process.Frozen.LetItGo",
  "Leak.NaughtyList.txt",
  "Ransom.Grandma.Reindeer",
  "Payload.Krampus.Sack",
  "Miner.CandyCane.Bit",
  "Storage.Fruitcake.Brick",
  "Trap.HomeAlone.WetBandits",
  "Root.DieHard.IsXmasMovie",
  "Trojan.UglySweater.Itchy",
  "Botnet.Snowman.Melted",
  "Script.Diet.StartJan1st",
  "Exploit.Mistletoe.Kiss",
  "Hack.NorthPole.Coords",
  "Virus.YuleLog.Burning",
  "Adware.BuyMoreToys.popup",
  "Spy.Santa.SeesYouSleeping",
  "System.Overload.Turkey"
];

const scan = () => {
  const progressBar = document.getElementById("progress-bar");
  const alertBox = document.getElementById("alert-box");
  const btn = document.querySelector("button");

  if (scanInProgress) return;

  scanInProgress = true;
  btn.innerText = "Scanning...";
  alertBox.style.display = "block";
  alertBox.innerHTML = '<div style="color:#0f0; margin-top:20px; text-align:center">Initializing Scan...</div>';
  progressBar.style.width = "0%";

  let progress = 0;
  
  const interval = setInterval(() => {
    progress += Math.random() * 4;
    if (progress > 100) progress = 100;
    progressBar.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        finishScan();
      }, 500);
    }
  }, 100);
};

const finishScan = () => {
  const alertBox = document.getElementById("alert-box");
  const btn = document.querySelector("button");
  const progressBar = document.getElementById("progress-bar");
  
  const virusCount = Math.random() < 0.5 ? 12 : 25;
  const shuffled = xmasViruses.sort(() => 0.5 - Math.random());
  const selectedViruses = shuffled.slice(0, virusCount);

  let html = `<div style="color: yellow; text-align: center; border-bottom: 1px dashed #555; padding-bottom: 5px; margin-bottom: 10px;">
                  ⚠️ SCAN COMPLETE: ${virusCount} VIRUSES FOUND! ⚠️
                </div>
                <ul style="padding-left: 10px; margin: 0;">`;

  selectedViruses.forEach(v => {
    html += `<li style="color: #ff3333; margin-bottom: 3px;">💀 ${v}</li>`;
  });

  html += `</ul>`;

  alertBox.innerHTML = html;
  
  if (progressBar) progressBar.style.width = "0%";
  scanInProgress = false;
  btn.innerText = "Scan Again";
  btn.style.opacity = "1";
};