export function audioEventListener(typeEvent, longitude, latitude, func) {
  const audioRecord = document.querySelector(".icon.ok");
  const audioStop = document.querySelector(".icon.cancel");
  const timerElement = document.querySelector(".timer");
  let recordingTimer;
  let seconds = 0;
  
  audioRecord.addEventListener("click", async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    
    const recorder = new MediaRecorder(stream);
    let chunks = [];
  
    recorder.addEventListener("start", () => {
      console.log("start");
      startRecordingTimer();
    });
  
    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });
  
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks);
      func(longitude, latitude, blob, typeEvent);
    });
  
    recorder.start();
  
    audioStop.addEventListener("click", () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      stopRecordingTimer();
      
      const iconContainer = document.querySelector(".icon-container");
      iconContainer.style.display = "flex";

      const controlContainer = document.querySelector(".control-container");
      controlContainer.style.display = "none";
    });
  });
  
  function startRecordingTimer() {
    recordingTimer = setInterval(() => {
      seconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function stopRecordingTimer() {
    clearInterval(recordingTimer);
    seconds = 0;
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }
}
