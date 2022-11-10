// Nessecary Variables
let cvsBg = document.getElementsByClassName('cvs-bg')[0];
let cvs = document.getElementsByTagName("canvas")[0];
let ctx = cvs.getContext('2d');
let widthW = window.innerWidth;
let heightW = window.innerHeight;
let color = {
      black: "#000000",
      white: "#ffffff",
      red: "#f44336",
      blue: "#2196f3",
      green: "#8bc34a",
      yellow: "#fdd835",
      purple: "#9c27b0"
};
let action = 'pen';
let mode = 'normal';
let restoreArr = [];
let tools = document.querySelectorAll('.toolbar>div');
let toolsImg = document.querySelectorAll('.toolbar>div>.img');
let option = document.querySelectorAll('.toolbar>div>.option');
let otherTools = document.getElementsByClassName("other-tool")[0];
let toolbar = document.getElementsByClassName("toolbar")[0];

// Canvas Sizing
function resize() {
      widthW = window.innerWidth;
      heightW = window.innerHeight;
      cvs.height = heightW;
      cvs.width = widthW;
      cvsBg.style.height = heightW + "px";
      cvsBg.style.width = widthW + "px";
      drawLastImg();
};
resize();
window.addEventListener('resize', resize);

// Drawing Free Hand
let painting = false;
let lineProp = {
      lineWidth: 4,
      color: color.blue
};

function startDraw(eve) {
      painting = true;
      for (let i = 0; i < option.length; i++) {
            option[i].style.display = "none";
      }
      draw(eve.clientX, eve.clientY);
      draw(eve.targetTouches[0].clientX, eve.targetTouches[0].clientY);
}

function draw(x, y) {
      if (!painting) return;
      ctx.lineWidth = lineProp.lineWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = lineProp.color;
      ctx.lineTo(x - cvs.offsetLeft, y - cvs.offsetTop);
      ctx.stroke();
}

function stopDraw(eve) {
      painting = false;
      ctx.stroke();
      ctx.beginPath();
      pushImg(eve);
}

// Text
let text = false;
let textProp = {
      size: 40,
      color: color.blue
};

// Eraser Functionality
let eraserSize = 10;
let eraserElement = document.querySelector('.toolbar>.eraser');
let eraserBox = document.getElementsByClassName('erase')[0];
let erasing = false;

function eraseMove(eve) {
      eraserBox.style.top = `${eve.clientY - eraserSize / 2}px`;
      eraserBox.style.left = `${eve.clientX - eraserSize / 2}px`;
}

function eraseStart(eve) {
      erasing = true;
      console.log(erasing);
      erase(eve.clientX, eve.clientY);
}

function erase(x, y) {
      if (!erasing) return;
      ctx.clearRect(x - 0.5 * eraserSize - cvs.offsetLeft, y - 0.5 * eraserSize - cvs.offsetTop, eraserSize - cvs.offsetLeft, eraserSize - cvs.offsetTop);
      console.log("erasing");
}

function eraseEnd(eve) {
      erasing = false;
      pushImg(eve);
}

eraserElement.children[2].children[1].addEventListener('click', (eve) => {
      ctx.clearRect(0, 0, widthW, heightW);
      pushImg(eve);
});

// undo functionality
let index = -1;
let undoElement = document.getElementsByClassName('undo')[0];
let redoElement = document.getElementsByClassName('redo')[0];

function pushImg(eve) {
      if (eve.type != 'mouseout') {
            if (index != restoreArr.length - 1) {
                  restoreArr = restoreArr.slice(0, index + 1);
                  restoreArr.push(ctx.getImageData(0, 0, widthW, heightW));
                  index++;
            } else {
                  restoreArr.push(ctx.getImageData(0, 0, widthW, heightW));
                  index++;
                  console.log(restoreArr);
            }
      }
}

pushImg({ type: undefined });

function undoLast() {
      if (index == 0) return;
      index--;
      ctx.putImageData(restoreArr[index], 0, 0, 0, 0, widthW, heightW);
}

function redoNext() {
      if (index == restoreArr.length - 1) return;
      index++;
      ctx.putImageData(restoreArr[index], 0, 0, 0, 0, widthW, heightW);
}

function drawLastImg() {
      restoreArr.length > 0 ? ctx.putImageData(restoreArr[restoreArr.length - 1], 0, 0, 0, 0, widthW, heightW) : null;
}

undoElement.addEventListener('click', undoLast);
redoElement.addEventListener('click', redoNext);

// Download Canvas
let downIcon = document.getElementsByClassName('down-img')[0];
let downContent = document.getElementsByClassName('download-content-img')[0];
let imgTypeEle = downContent.children[2].children[1];
let downEle = downContent.children[2].children[0];
let options = imgTypeEle.children[1].children;
let imgType = "png"
downIcon.addEventListener('click', () => {
      let dataURI = cvs.toDataURL();
      downContent.children[1].src = dataURI;
      downContent.style.display = "flex";
});

imgTypeEle.children[0].addEventListener('click', () => {
      imgTypeEle.children[0].children[1].classList.toggle("open");
      imgTypeEle.children[1].style.visibility == "visible" ? imgTypeEle.children[1].style.visibility = "hidden" : imgTypeEle.children[1].style.visibility = "visible";
});

for (let i = 0; i < options.length; i++) {
      options[i].addEventListener('click', () => {
            imgType = options[i].innerHTML;
            imgTypeEle.children[0].children[0].innerHTML = imgType;
            imgTypeEle.children[1].style.visibility = "hidden";
      });
}

downEle.addEventListener('click', () => {
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = cvs.toDataURL(`image/${imgType}`);
      a.download = `my-board.${imgType}`;
      a.click();
      document.body.removeChild(a);
});

// Record Canvas
let recIcon = document.getElementsByClassName('record')[0];
let videoContent = document.getElementsByClassName("download-content-video")[0];
let videoEle = videoContent.children[1];
let recording = false;

async function setupStream() {
      try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                  video: true
            });

            audio = await navigator.mediaDevices.getUserMedia({
                  audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                  }
            });
      } catch (err) {
            console.error(err);
      }
}

async function startRecording() {
      await setupStream();

      if (stream && audio) {
            mode = "record";
            toolbar.classList.add("rec");
            otherTools.classList.add("rec");
            recording = true;
            mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
            recorder = new MediaRecorder(mixedStream);
            recorder.ondataavailable = handleDataAvaiable;
            recorder.onstop = handleStop;
            recorder.start(200);
            console.log("Recording has started!!!");
      } else {
            console.warn("No stream avaiable");
      }
}

let chunks = [];

function handleDataAvaiable(e) {
      chunks.push(e.data);
}

function stopRecording() {
      recorder.stop();
      recording = false;
      toolbar.classList.remove("rec");
      otherTools.classList.remove("rec");
      mode = "normal";
      console.log("Recording has stopped!!!");
}

function handleStop(e) {
      const blob = new Blob(chunks, {
            type: "video/mp4"
      });
      chunks = [];

      videoContent.style.display = "flex";
      let a = document.createElement("a");

      videoContent.children[2].addEventListener("click", () => {
            document.body.append(a);
            a.href = URL.createObjectURL(blob);
            a.download = "video.mp4";
            a.click();
            document.body.removeChild(a);
      });

      videoEle.src = URL.createObjectURL(blob);
      videoEle.load();
      videoEle.ondataavailable = () => videoEle.play();
}

recIcon.addEventListener("click", () => recording ? stopRecording() : startRecording());

// Eventlistners
cvs.addEventListener('mousedown', eve => {
      if (action == 'eraser') eraseStart(eve);
      if (action == 'pen') startDraw(eve);
});
cvs.addEventListener('mousemove', eve => {
      eraseMove(eve);
      if (action == 'eraser') erase(eve.clientX, eve.clientY);
      if (action == 'pen') draw(eve.clientX, eve.clientY);

      if (mode == "record") {
            eve.x <= 20 ? toolbar.classList.remove("rec") : toolbar.classList.add("rec");
            eve.y <= 20 ? otherTools.classList.remove("rec") : otherTools.classList.add("rec");
      }
});
cvs.addEventListener('mouseup', eve => {
      if (action == 'pen') stopDraw(eve);
      if (action == 'eraser') eraseEnd(eve);
});
cvs.addEventListener('mouseout', eve => {
      if (action == 'pen') stopDraw(eve);
      if (action == 'eraser') eraseEnd(eve);
});
cvs.addEventListener('touchstart', eve => {
      if (action == 'pen') startDraw(eve);
});
cvs.addEventListener('touchmove', eve => {
      eraserBox.style.top = eve.targetTouches[0].clientY - eraserSize + "px";
      eraserBox.style.left = eve.targetTouches[0].clientX - eraserSize + "px";
      if (action == 'pen') draw(eve.targetTouches[0].clientX, eve.targetTouches[0].clientY);
      if (action == 'erase') erase(eve.targetTouches[0].clientX, eve.targetTouches[0].clientY);
});
cvs.addEventListener('touchend', eve => {
      if (action == 'pen') stopDraw(eve);
});

// some styling on toolbar & basic toolbar functionality

for (let i = 0; i < toolsImg.length; i++) {
      console.log(tools[i].children);
      tools[i].addEventListener('mouseenter', () => {
            tools[i].children[1].style.visibility = "visible";
            tools[i].childNodes[1].style.backgroundImage = `url(../resource/app/norm/${tools[i].className}.svg)`
      });
      tools[i].addEventListener('mouseleave', () => {
            tools[i].children[1].style.visibility = "hidden";
            tools[i].childNodes[1].style.backgroundImage = `url(../resource/app/blue/${tools[i].className}.svg)`
      });
      toolsImg[i].addEventListener('click', () => {
            let attrName = tools[i].getAttribute("data-name");
            if (attrName != "undo" && attrName != "redo") {
                  action = attrName;
            }
            if (action == 'eraser') {
                  eraserBox.style.display = 'inline-block';
            } else {
                  eraserBox.style.display = 'none';
            }
            if (tools[i].children[2].style.display == 'none' || tools[i].children[2].style.display == '') {
                  for (let j = 0; j < option.length; j++) {
                        option[j].style.display = "none";
                  }
                  tools[i].children[2].style.display = "inline-block";
            } else {
                  tools[i].children[2].style.display = "none";
            }
      });
}

// changing value
for (let i = 0; i < option.length; i++) {
      if (option[i].children[0].classList[0] == 'size') {
            let value = option[i].children[0].children[0].children[1];
            let input = option[i].children[0].children[1];

            value.innerHTML = input.value + "px";
            if (i == 0) lineProp.lineWidth = input.value;

            input.addEventListener('input', () => {
                  value.innerHTML = input.value + "px";
                  if (i == 0) lineProp.lineWidth = input.value;
                  if (i == 1) {
                        eraserBox.style.height = input.value + "px";
                        eraserBox.style.width = input.value + "px";
                        eraserSize = input.value;
                  }
            });
      }
}

// changing colors
let colorElement = document.querySelectorAll('.option>.color span');

for (let i = 0; i < colorElement.length; i++) {
      console.log(colorElement[i].id);
      colorElement[i].style.background = color[colorElement[i].id];
      colorElement[i].addEventListener('click', () => {
            if (i <= 6) {
                  console.log("pen");
                  lineProp.color = color[colorElement[i].id];
                  console.log(lineProp.color);
                  for (let j = 0; j < colorElement.length - 7; j++) colorElement[j].classList.remove("slected");
                  colorElement[i].classList.add("slected");
            } else if (i <= 13) {
                  textProp.color = color[colorElement[i].id];
                  console.log(textProp.color);
                  for (let j = 7; j < colorElement.length; j++) colorElement[j].classList.remove("slected");
                  colorElement[i].classList.add("slected");
            }
      });
}

// Closing Dialouge Boxes

let close = document.getElementsByClassName('close');
for (let i = 0; i < close.length; i++) close[i].addEventListener('click', () => close[i].parentElement.style.display = "none");

// Changing Background

let background = "dots";
let bgDialougeBox = document.getElementsByClassName("background")[0];
let bg = document.getElementsByClassName("cvs-bg")[0];
let bgIcon = document.getElementsByClassName("bg")[0];