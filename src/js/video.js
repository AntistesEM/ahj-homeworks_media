export function videoEventListener(typeEvent, longitude, latitude, func) {
  const videoRecord = document.querySelector(".icon.ok");
  const videoStop = document.querySelector(".icon.cancel");

  videoRecord.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
    });
    
    const recorder = new MediaRecorder(stream);
    const chunks = [];
  
    recorder.addEventListener("start", () => {
      console.log("start");
    });
  
    recorder.addEventListener("dataavailable", (event) => {
      chunks.push(event.data);
    });
  
    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunks);
      func(longitude, latitude, blob, typeEvent);
    });
  
    recorder.start();
  
    videoStop.addEventListener("click", () => {
      recorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    });
  });
}
