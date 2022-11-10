const labels = document.querySelectorAll(".form-control label");

labels.forEach(label => {
      label.innerHTML = label.innerText
            .split('')
            .map((letter, idx) => `<span style="transition-delay: ${idx * 50}ms;">${letter}</span>`)
            .join('')
});

let objectBg = document.getElementsByClassName("obj")[0];

for (let i = 0; i < 5; i++) {
      let hw = Math.floor(Math.random() * 40) + 50;
      let left = Math.floor(Math.random() * 50) + 40;
      let time = Math.floor(Math.random() * 7) + 5;
      objectBg.innerHTML += `<span style="height: ${hw}px; width: ${hw}px; left: ${left}%; animation-duration: ${time}s;"></span>`
}

for (let i = 0; i < 5; i++) {
      let hw = Math.floor(Math.random() * 15) + 5;
      let left = Math.floor(Math.random() * 50) + 40;
      let time = Math.floor(Math.random() * 7) + 5;
      objectBg.innerHTML += `<span style="height: ${hw}px; width: ${hw}px; left: ${left}%; animation-duration: ${time}s;"></span>`
}