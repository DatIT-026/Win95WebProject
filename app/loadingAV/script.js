let scanInProgress = false; // Flag variable to track if scan process is in progress

function scan() {
  const progressBar = document.getElementById("progress-bar");

  if (scanInProgress) {
    return; // If scan is already in progress, do nothing
  }

  // Ensure progress bar is reset before starting
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "#00007b"; // Set initial color
  scanInProgress = true; // Set flag to indicate scan is in progress

  // Simulate scanning process
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 5; // Simulating slower progress for scanning
    progressBar.style.width = `${Math.min(progress, 100)}%`;

    if (progress >= 100) {
      clearInterval(interval); // Stop the interval when scanning is complete
      progressBar.style.backgroundColor = "red"; // Remove color after scan
      showFakeAlert("Something Went Wrong! 97 viruses found!");
      scanInProgress = false; // Reset flag after scan is complete
      progressBar.style.width = "0%"; // Reset progress bar width
    }
  }, 200); // Adjust the interval duration for slower progress
}

function showFakeAlert(message) {
  const alertBox = document.getElementById("alert-box");
  alertBox.textContent = message;
  alertBox.style.display = "block";

  // Hide the alert after 15 seconds
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 15000);
}
