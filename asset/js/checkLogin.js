import { getUser } from "./helper.js";

const token = localStorage.getItem("token") || null;
const userAction = document.querySelector(".user-dropdown");
let text = ``;
let isUser = false;

// check nav
async function prepareNav() {
  if (token) {
    isUser = await getUser(token) != null;
  }


  if (!isUser) {
    text = `<a href="authenticate.html" class="action-btn"
    ><ion-icon name="log-in-outline"></ion-icon
  ></a>`;
  } else {
    text = `
    <ion-icon name="person-outline" class="user-icon"></ion-icon>
    <ul class="user-list">
      <li class="user-item">
        <a href="userProfile.html">Account</a>
      </li>
    
      <li class="user-item">
        <a href="#" class="logout">Logout</a>
      </li>
    </ul>`;
  }

  userAction.innerHTML = text;
}

prepareNav();


