let mediaStream;


async function selectSource(source) {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
  }

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
      },
    },
  };

  try {
    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    const videoElement = document.getElementById("videoElement");
    videoElement.srcObject = mediaStream;
  } catch (e) {
    console.error("Error", e);
  }
}


document.getElementById("videoSelectBtn").onclick =
  async function getVideoSources(event) {
    const sources = await window.electronAPI.getSources();
    const videoOptionsList = document.getElementById("video-options-list");
    const videoOptionsMenu = document.getElementById("video-options-menu");

    videoOptionsList.innerHTML = "";

    sources.slice(0, 5).forEach((source) => {
      const menuItem = document.createElement("li");
      menuItem.textContent = source.name;
      menuItem.onclick = () => {
        selectSource(source);
        videoOptionsMenu.classList.add("hidden");
      };
      videoOptionsList.appendChild(menuItem);
    });

    const menuHeight = videoOptionsMenu.offsetHeight;
    videoOptionsMenu.style.left = `${event.clientX}px`;
    videoOptionsMenu.style.top = `${event.clientY - menuHeight}px`;
    videoOptionsMenu.classList.remove("hidden");
  };

let mediaRecorder;
let recordedChunks = [];

function startRecording() {
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(mediaStream);

  mediaRecorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = function () {
    const blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "test.webm";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  mediaRecorder.start();
}

function stopRecording() {
  mediaRecorder.stop();
}

document.getElementById("recordBtn").onclick = function () {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    stopRecording();
    this.textContent = "Start";
  } else {
    startRecording();
    this.textContent = "Stop";
  }
};


async function openAndPlayVideo() {
  const filePaths = await window.electronAPI.showOpenDialog();

  if (filePaths.length > 0) {
    const videoPath = filePaths[0];
    const videoElement = document.getElementById('videoElement');
    videoElement.src = videoPath;
    videoElement.play();
  }
}

document.getElementById('openVideoBtn').onclick = openAndPlayVideo;
