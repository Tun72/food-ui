const url = "https://food-recipe-admin-server-ae75c769cee1.herokuapp.com" // "http://localhost:4000" // 


const signUp = document.querySelector(".signUp");
const login = document.querySelector(".login");

function addErrorPopup(msg) {
  let body = document.querySelector("body");
  let text = `<div class="running_pop active">
  <img src="./asset/images/Error.webp" alt="" />
  <p>${msg}</p>
  <span class="close">X</span>
</div>`;

  body.insertAdjacentHTML("afterbegin", text);
  setTimeout(removePopup, 1000);
}

// login
async function signUpUser(userData) {
  [userName, email, password, confPassword] = userData;

  const data = {
    name: userName.value,
    email: email.value,
    password: password.value,
    passwordConfirm: confPassword.value,
  };

  const result = await fetch(`${url}/api/auth/signup-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const response = await result.json();
  localStorage.setItem("token", response.token);

  window.location.href = "rescipeMainpage.html";
}

//login
async function loginUser(userData) {
  [email, password] = userData;

  const data = {
    email: email.value,
    password: password.value,
  };

  const result = await fetch(`${url}/api/auth/login-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const response = await result.json();

  console.log(response);

  if (response.status === "fail") {
    // addShortPopup(response.message);
    addErrorPopup("error");
    return;
  }
  localStorage.setItem("token", response.token);

  window.location.href = "rescipeMainpage.html";
}

signUp.addEventListener("submit", function (e) {
  e.preventDefault();
  signUpUser(e.target);
});

login.addEventListener("submit", function (e) {
  e.preventDefault();
  loginUser(e.target);
});
