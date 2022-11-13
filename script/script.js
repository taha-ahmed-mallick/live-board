// Sign in and sign up form linking
let signInBtn = document.getElementsByClassName("sign-in")[0];
let signUpBtn = document.getElementsByClassName("sign-up")[0];
signInBtn.addEventListener("click", () => window.open("./html/form.html?login=true", "_self"));
signUpBtn.addEventListener("click", () => window.open("./html/form.html?login=false", "_self"));

// Checking Localstorage
let accountTab = document.getElementsByClassName("account");

if (localStorage.length == 0) {
      localStorage.setItem("accounts", JSON.stringify([]));
      localStorage.setItem("logged-in", JSON.stringify(false));
} else {
      if (!JSON.parse(localStorage.getItem("logged-in"))) {
            accountTab[1].style.display = "none";
      } else accountTab[0].style.display = "none";
}

// Log Out
let logOutBtn = document.getElementsByClassName("log-out")[0];
logOutBtn.addEventListener("click", () => {
      localStorage.setItem("logged-in", JSON.stringify(false));
      window.open("./", "_self");
});

// Create New Board
let createBtn = document.getElementsByClassName("create")[0];
createBtn.addEventListener("click", () => {
      window.open("./html/app.html", "_self");
});