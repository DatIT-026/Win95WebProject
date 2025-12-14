let scanInProgress = false;

function scan() {
  const progressBar = document.getElementById("progress-bar");

  if (scanInProgress) {
    return;
  }

  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "#00007b";
  scanInProgress = true;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 5;
    progressBar.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      clearInterval(interval);
      progressBar.style.backgroundColor = "transparent";
      showFakeAlert("0 viruses found");
      scanInProgress = false;
      progressBar.style.width = "0%"; // reset progress bar width
    }
  }, 200); // adjust the interval duration for slower progress
}

function showFakeAlert(message) {
  const alertBox = document.getElementById("alert-box");
  alertBox.textContent = message;
  alertBox.style.display = "block";

  // Hide the alert after 10 seconds
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 10000);
}