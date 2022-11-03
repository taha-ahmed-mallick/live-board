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

// Canvas Sizing
function resize() {
      widthW = window.innerWidth;
      heightW = window.innerHeight;
      cvs.height = heightW;
      cvs.width = widthW;
      cvsBg.style.height = heightW + "px";
      cvsBg.style.width = widthW + "px";
};
resize();
window.addEventListener('resize', resize);

// Drawing Free Hand
let painting = false;
let lineProp = {
      lineWidth: 5,
      color: color.blue
};

function start(eve) {
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

function stopDraw() {
      painting = false;
      ctx.stroke();
      ctx.beginPath();
}

// Text
let text = false;
let textProp = {
      size: 40,
      color: color.blue
};

cvs.addEventListener('mousedown', start);
cvs.addEventListener('mousemove', eve => draw(eve.clientX, eve.clientY));
cvs.addEventListener('mouseup', stopDraw);
cvs.addEventListener('mouseout', stopDraw);
cvs.addEventListener('touchstart', start);
cvs.addEventListener('touchmove', eve => draw(eve.targetTouches[0].clientX, eve.targetTouches[0].clientY));
cvs.addEventListener('touchend', stopDraw);

let tools = document.querySelectorAll('.toolbar>div');
let toolsImg = document.querySelectorAll('.toolbar>div>.img');
let option = document.querySelectorAll('.toolbar>div>.option');

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

let colorElement = document.querySelectorAll('.option>.color span');

for (let i = 0; i < colorElement.length; i++) {
      console.log(colorElement[i].id);
      colorElement[i].style.background = color[colorElement[i].id];
      colorElement[i].addEventListener('click', () => {
            if (i <= 6) {
                  console.log("pen");
                  lineProp.color = color[colorElement[i].id];
                  for (let j = 0; j < colorElement.length; j++) colorElement[j].classList.remove("slected");
                  colorElement[i].classList.add("slected");
            } else if (i <= 13) {
                  console.log("text");
            }
      });
}