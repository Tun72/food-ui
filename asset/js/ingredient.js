import {
  getIngredients,
  renderSpinner,
  getIngredientByName,
  getIngredientCategory,
  getIngredientByCategoryName,
  listenSaveAndCart,
} from "./helper.js";

const productGrid = document.querySelector(".product-grid");
const token = localStorage.getItem("token") || null;
const pagination = document.querySelector(".pagination");
const searchForm = document.querySelector(".search-form");
const sideBar = document.querySelector(".category-list");
let textStr = "";
let btnText = "";
let ingredients;

const allIngredient = async (name = null, category = null) => {
  productGrid.innerHTML = textStr;
  renderSpinner(productGrid);

  const items = JSON.parse(localStorage.getItem("save")) || [];

  // if (token) {
  let page = localStorage.getItem("page") || 1;
  let data;

  if (name) {
    data = await getIngredientByName(name);
  } else if (category) {
    data = await getIngredientByCategoryName(category);
  } else {
    data = await getIngredients(page);
  }

  ingredients = data.ingredients;

  items.forEach((i) => {
    const index = ingredients.findIndex((item) => item._id === i.id);
    if (index > -1) {
      ingredients[index].isSave = true;
    }
  });

  if (!ingredients.length) {
    textStr += `<p>No items found </p>`;
  }
  ingredients.forEach((e) => {
    textStr += ` <div class="showcase">
        <div class="showcase-banner">
          <img
            src="${e.imageUrl}"
            alt="Mens Winter Leathers Jackets"
            width="300"
            class="product-img default"
          />
          <img
            src="${e.imageUrl}"
            alt="Mens Winter Leathers Jackets"
            width="300"
            class="product-img hover"
          />

          <p class="showcase-badge">${Math.round(Math.random() * 20)}%</p>

          <div class="showcase-actions">
            <a href="ingredientDetail.html?id=${
              e._id
            }" class="btn-action detailItem">
              <ion-icon name="eye-outline" class=""></ion-icon>
            </a>

            <a href="#" class="btn-action ${
              e.isSave ? "btn-active" : ""
            } saveItem">
              <input type="hidden" value="${e._id}#${e.imageUrl}#${e.name}#${
      e.price
    }" class="itemId"/>
              <ion-icon name="heart-outline" class=""></ion-icon>
            </a>

            <a href="#" class="btn-action addCart">
              <input type="hidden" value="${e._id}" class="itemId "/>
              <ion-icon name="cart-outline" class=""></ion-icon>
            </a>
          </div>
        </div>

        <div class="showcase-content">
          <a href="#" class="showcase-category">${e.name}</a>

          <a href="#">
            <h3 class="showcase-title">${e.description}</h3>
           
          </a>

          <div class="showcase-rating">
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star"></ion-icon>
            <ion-icon name="star-outline"></ion-icon>
            <ion-icon name="star-outline"></ion-icon>
          </div>

          
          <div class="price-box">
            <p class="price">$${e.price}</p>
            <del>$${((Math.round(Math.random() * 5) + 3) * e.price).toFixed(
              2
            )}</del>
            <span class="category">${e.category}</span>
          </div>
          
        </div>
      </div>`;
  });

  productGrid.innerHTML = textStr;
  pagination.innerHTML = btnText;

  if (!name && !category) {
    btnText = `
    ${
      data.prevPage
        ? `<button class="btn btn-1">${data.prevPage}</button>`
        : "<div></div>"
    }
    ${
      data.nextPage ? `<button class="btn btn-2">${data.nextPage}</button>` : ""
    }`;

    pagination.insertAdjacentHTML("afterbegin", btnText);
  }

  textStr = "";
  btnText = "";
  // }
};

const addToCategoryList = async () => {
  const category = (await getIngredientCategory()).category;
  let categoryText = `<li class="sidebar-menu-category">
  <button class="sidebar-accordion-menu" data-accordion-btn>
    <div class="menu-title-flex">
      <img
        src="./asset/imgs/pizza.svg"
        alt="clothes"
        width="20"
        height="20"
        class="menu-title-img"
      />

      <p class="menu-title category-items">All</p>
    </div>

    <div>
    <ion-icon name="arrow-forward-circle-outline"></ion-icon>
    </div>
  </button>
</li>`;

  category.forEach((e) => {
    categoryText += `<li class="sidebar-menu-category">
    <button class="sidebar-accordion-menu" data-accordion-btn>
      <div class="menu-title-flex">
        <img
          src="./asset/images/icons/${e}.svg"
          alt="clothes"
          width="20"
          height="20"
          class="menu-title-img"
        />
  
        <p class="menu-title category-items">${e}</p>
      </div>
  
      <div>
      <ion-icon name="arrow-forward-circle-outline"></ion-icon>
      </div>
    </button>
  </li>`;
  });

  sideBar.insertAdjacentHTML("afterbegin", categoryText);
};

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const [ingName] = e.target;
  allIngredient(ingName.value);
});

sideBar.addEventListener("click", function (e) {
  if (e.target.closest(".category-items")) {
    let category = e.target.innerText;
    if (category.toLowerCase() === "all") {
      return allIngredient();
    }
    allIngredient(null, category);
  }
});

pagination.addEventListener("click", function (e) {
  if (e.target.closest(".btn-1")) {
    localStorage.setItem("page", e.target.innerText);
    allIngredient();
  }

  if (e.target.closest(".btn-2")) {
    localStorage.setItem("page", e.target.innerText);
    allIngredient();
  }
});

function clearPage() {
  localStorage.removeItem("page");
}

setTimeout(clearPage, 10000);

function generatePopup() {
  const data = [
    { name: "water", id: "64d3333883a3802cbd08c924" },
    { name: "fish", id: "64d0ff6d138a0f2b6a7f0d84" },
    { name: "beef", id: "64d24c2683a3802cbd08c7d4" },
    { name: "peanuts", id: "64ca788babaceba090cff163" },
  ];
  const random = Math.round(Math.random() * 2);
  document.querySelector(".mypopup").textContent = "";
  document.querySelector(".mypopup").insertAdjacentHTML(
    "afterbegin",
    `<img src="./asset/imgs/${data[random].name}.webp" alt="" />
    <a href="ingredientDetail.html?id=${data[random].id}"> 
    <div class="mypopup-detail">
      <h2 class="mypopup-title">New Discount</h2>
      <p class="mypopup-name">${data[random].name}</p>
      <span class="mypopup-discount">20% discount only $10</span>
    </div></a>`
  );
}

setTimeout(generatePopup, 16000);

document.querySelector(".mycontact").addEventListener("click", function(e) {
  document.querySelector(".wrapper").classList.toggle("show-chart");
})

allIngredient();
addToCategoryList();
listenSaveAndCart();
generatePopup();
