import { addShortPopup, fetchPostMethod, getUser, url } from "./helper.js";

const profileForm = document.querySelector(".profile__forms");
const navDetail = document.querySelector(".profile__nav-detail");
const userName = document.querySelector(".profile__name");
const profileName = document.querySelector(".profile__photo__name");
let text = "";

// userdetail
async function getUserDetail() {
  const token = localStorage.getItem("token") || null;

  if (!token) {
    window.location.href = "authenticate.html";
  }

  const user = (await getUser(token)).user;
  if (user) {
    userName.textContent = user.name || "user mame";
    profileName.textContent = user.name.slice(0, 1).toUpperCase();
    text = `<div class="profile__form-basics">
              <h4 class="profile__form-title">Basics:</h4>
              <form action="#" class="profile__form profile__edit">
                <div class="profile__inputs">
                  <input type="text" name="name" id="name" placeholder="Name" value=${user.name} disabled />
                  <a href="#" class="edit">
                    <ion-icon name="pencil-outline"></ion-icon>
                  </a>
                </div>
                <div class="profile__inputs">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    value=${user.email}
                    disabled
                  />
                  <a href="#" class="edit">
                    <ion-icon name="pencil-outline"></ion-icon>
                  </a>
                </div>
                <div class="profile__inputs">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Ph Number"
                    value="${user.phone}"
                    disabled
                  />
                  <a href="#" class="edit">
                    <ion-icon name="pencil-outline"></ion-icon>
                  </a>
                </div>

                <div class="profile__inputs">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Address"
                    value="${user.address}"
                    disabled
                  />
                  <a href="#" class="edit">
                    <ion-icon name="pencil-outline"></ion-icon>
                  </a>
                </div>
                <button class="profile__btn edit__btn">Save</button>
              </form>
              
            </div>`;

    profileForm.innerHTML = text;
  }
}

function getPrivacy() {
  text = `<div class="profile__form-basics">
   <h4 class="profile__form-title">Privacy:</h4>
   <form action="#" class="profile__form privacy__edit">
     <div class="profile__inputs">
       <input
         type="password"
         name="password"
         id="password"
         placeholder="Current Password"
       />
     </div>
     <div class="profile__inputs">
       <input
         type="password"
         name="newpassword"
         id="newpassword"
         placeholder="New Password"
       />
     </div>
     <div class="profile__inputs">
       <input
         type="password"
         name="confpassword"
         id="confpassword"
         placeholder="Confirm Password"
       />
     </div>
     <button class="profile__btn">Save</button>
   </form>
 </div>
 `;

  profileForm.innerHTML = text;
}

async function editUser(e) {
  const [name, email, phone, address] = e.target;
  const data = await fetchPostMethod(
    `${url}/api/user/edit-user`,
    {
      name: name.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
    }
  );

  if (data) {
    addShortPopup("Successfully edited");
  } else {
    addShortPopup("Error Occour");
  }
}

// listener
navDetail.addEventListener("click", function (e) {
  if (e.target.classList.contains("myprofile")) {
    getUserDetail();
  } else if (e.target.classList.contains("myprivacy")) {
    getPrivacy();
    document
      .querySelector(".privacy__edit")
      .addEventListener("submit", async function (e) {
        e.preventDefault();
        const [password, newpassword, confpassword] = e.target;
        await fetchPostMethod(`${url}/api/user/edit-password`, {
          password: password.value,
          newPassword: newpassword.value,
          confPassword: confpassword.value,
        });

        addShortPopup("Successfully Save");
      });
  }
});

profileForm.addEventListener("click", function (e) {
  const edit = e.target.closest(".edit");
  if (edit) {
    const parent = edit.parentElement;

    parent.querySelector("input").disabled =
      !parent.querySelector("input").disabled;

    
    document
      .querySelector(".profile__edit")
      .addEventListener("submit", async function (e) {
        e.preventDefault();
        await editUser(e);
      });
  }
});

getUserDetail();
