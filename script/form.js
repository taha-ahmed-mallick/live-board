// Checking which form to be shown

let isLogin = window.location.search.split("=")[1];
let forms = document.getElementsByClassName("form");
let title = document.querySelector("title");

if (isLogin == "true") {
      forms[0].classList.add("active");
      title.innerText = "Login";
} else {
      forms[1].classList.add("active");
      title.innerText = "Sign Up";
}

let changeForm = document.getElementsByTagName("a");

// Changing forms

changeForm[0].addEventListener("click", () => {
      forms[0].classList.remove("active");
      forms[1].classList.add("active");
      title.innerText = "Sign Up";
});
changeForm[1].addEventListener("click", () => {
      forms[1].classList.remove("active");
      forms[0].classList.add("active");
      title.innerText = "Login";
});

// Making Stylish Labels

const labels = document.querySelectorAll(".form-control label");

labels.forEach(label => {
      label.innerHTML = label.innerText
            .split('')
            .map((letter, idx) => `<span style="transition-delay: ${idx * 50}ms;">${letter}</span>`)
            .join('')
});

// Background boxes

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

let submitBtns = document.getElementsByClassName("btn");
let formContainer = document.getElementsByClassName("form-container");
let inputs = document.getElementsByTagName("input");

for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("keydown", (eve) => {
            let label = inputs[i].parentElement.children[1];
            inputs[i].classList.remove("error");
            label.classList.remove("error");
            if (eve.keyCode == 13) {
                  i <= 1 ? validation("login", formContainer[0].children) : validation("signup", formContainer[1].children);
            }
      });
}

function validation(type, elements) {
      let accounts = JSON.parse(localStorage.accounts);
      let accountAvailable = false;
      if (!JSON.parse(localStorage['logged-in'])) {
            if (type == "login") {
                  let usrname = elements[0].children[0];
                  let pass = elements[1].children[0];
                  let usrLabel = elements[0].children[1];
                  let passLabel = elements[1].children[1];

                  for (let i = 0; i < accounts.length; i++) (accounts[i].name == usrname.value && accounts[i].pass == pass.value) ? accountAvailable = true : null;

                  if (accountAvailable) {
                        let data = {
                              name: usrname.value,
                              pass: pass.value
                        };
                        localStorage['logged-in'] = JSON.stringify(data);
                        window.open("../", "_self");
                  } else {
                        usrname.classList.add("error");
                        pass.classList.add("error");
                        usrLabel.classList.add("error");
                        passLabel.classList.add("error");
                        alert("This account doesn't exists Sign Up to create a new account.");
                  }
            } else if (type == "signup") {
                  let usrname = elements[0].children[0];
                  let pass = elements[1].children[0];
                  let confirmPass = elements[2].children[0];
                  let usrLabel = elements[0].children[1];
                  let passLabel = elements[1].children[1];
                  let confirmPassLabel = elements[2].children[1];
                  let passValueMatch = false;
                  let usr = false;

                  if (usrname.value == "") {
                        usrname.classList.add("error");
                        usrLabel.classList.add("error");
                  } else usr = true;

                  if (accounts.length != 0) {
                        for (let i = 0; i < accounts.length; i++) {
                              console.log(i);
                              if (usrname.value == accounts[i].name) {
                                    usrname.classList.add("error");
                                    usrLabel.classList.add("error");
                                    alert("Username Already Taken!");
                              } else accountAvailable = true;
                        }
                  } else accountAvailable = true;

                  if (pass.value != confirmPass.value) {
                        pass.classList.add("error");
                        passLabel.classList.add("error");
                        confirmPass.classList.add("error");
                        confirmPassLabel.classList.add("error");
                  } else passValueMatch = true;

                  console.log(accountAvailable, passValueMatch, usr);

                  if (accountAvailable && passValueMatch && usr) {
                        let data = {
                              name: usrname.value,
                              pass: pass.value
                        };
                        accounts.push(data);
                        localStorage.accounts = JSON.stringify(accounts);
                        localStorage['logged-in'] = JSON.stringify(data);
                        window.open("../", "_self");
                  }
            }
      } else alert("Already logged in");
}

submitBtns[0].addEventListener("click", () => {
      validation("login", formContainer[0].children);
});


submitBtns[1].addEventListener("click", () => {
      validation("signup", formContainer[1].children);
});