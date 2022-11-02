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
let prop = {
      lineWidth: 5,
      color: "#296472"
};

function start(eve) {
      painting = true;
      draw(eve);
}

function draw(eve) {
      if (!painting) return;
      ctx.lineWidth = prop.lineWidth;
      ctx.lineCap = "round";
      ctx.strokeStyle = prop.color;
      ctx.lineTo(eve.clientX - cvs.offsetLeft, eve.clientY - cvs.offsetTop);
      ctx.stroke();
}

function stopDraw() {
      painting = false;
      ctx.stroke();
      ctx.beginPath();
}

cvs.addEventListener('mousedown', start);
cvs.addEventListener('mousemove', draw);
cvs.addEventListener('mouseup', stopDraw);
cvs.addEventListener('mouseout', stopDraw);
cvs.addEventListener('touchstart', start);
cvs.addEventListener('touchmove', draw);
cvs.addEventListener('touchend', stopDraw);

let tools = document.querySelectorAll('.toolbar>div');

for (let i = 0; i < tools.length; i++) {
      console.log(tools[i].children);
      tools[i].addEventListener('mouseenter', () => {
            tools[i].children[1].style.visibility = "visible";
            // tools[i].children[2].style.display = "inline-block";
            tools[i].childNodes[1].style.backgroundImage = `url(../resource/app/norm/${tools[i].className}.svg)`
      });
      tools[i].addEventListener('mouseleave', () => {
            tools[i].children[1].style.visibility = "hidden";
            // tools[i].children[2].style.display = "none";
            tools[i].childNodes[1].style.backgroundImage = `url(../resource/app/blue/${tools[i].className}.svg)`
      });
}

let colorElement = document.querySelectorAll('.option>.color span');

for (let i = 0; i < colorElement.length; i++) {
      colorElement[i].style.background = color[colorElement[i].id];
}