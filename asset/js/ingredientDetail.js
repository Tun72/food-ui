import {
  addToCart,
  getIngredientById,
  getIngredients,
  renderSpinner,
  checkCart,
  addShortPopup,
} from "./helper.js";

const token = localStorage.getItem("token") || null;
const detail = document.querySelector(".detail-section");
const id = getParameter("id") || 0;

async function ingredientDetail() {
  if (id == 0) {
    window.location.href = "ingredientMainpage.html";
  }
  const ingredient = (await getIngredientById(id)).ingredient;

  let text = `  <div class="detail">
  <div class="detail-img">
    <img src="${ingredient.imageUrl}" alt="" />
  </div>
  <div class="detail-data">
    <div class="detail-box margin-bottom-sm">
      <div class="detail-box__tag">
        <span><a href="#">best seller</a></span>
        <span><a href="#">popular pick</a></span>
      </div>
      <h3 class="detail-box__name">${ingredient.name}</h3>
      <div class="detail-box__rating">
      <span class="category-tag">Rating : ${ingredient.rating}</span>
        <ion-icon name="star"></ion-icon>
        <ion-icon name="star"></ion-icon>
        <ion-icon name="star"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>        
      </div> 
      <p class="detail-box__price">
        $${ingredient.price}
        <span class="detail-box__description">${ingredient.description}</span>
      </p>
      <span class="detail-box__span"
        >price when you purchsed online</span
      >
      <div class="detail-box__button">
        <input type="hidden" value="${ingredient._id}" class="itemId" />
        <a href="#" class="detail-box__btn">Add to cart</a>
      </div>

      <div class="line"></div>
      <div class="detail-box__pickup">
        <ul class="detail-box__list">
          <li class="detail-box__item">
            <i class="ri-car-fill"></i> Pick up today at
            <a href="#">Yangon, Tharkayta</a>
          </li>
          <li class="detail-box__item">
            <i class="ri-map-pin-2-fill"></i> Tharkayta
          </li>
          <li class="detail-box__item">
            <i class="ri-loader-line"></i> Sold and shipped by
            walmart.com
          </li>
          <li class="detail-box__item">
            <i class="ri-reply-fill"></i> Free 90-day returns
            <a href="#">details</a>
          </li>
          <li class="detail-box__item">
            <i class="ri-lock-line"></i> Delivered from store
            <a href="#">yangon</a>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="detail-box__add">
        <span class="detail-box__add-1"
          ><a href="#"
            ><i class="ri-heart-line"></i>Add to list</a
          ></span
        >
        <span class="detail-box__add-2"
          ><a href="#"
            ><i class="ri-gift-line"></i>Add to registry</a
          ></span
        >
      </div>
    </div>
    <div class="detail-box box-1">
      <div class="detail-box__img">
        <img src="${ingredient.imageUrl}" alt="" />
      </div>
      <div class="detail-box__data">
        <h3 class="detail-box__name">${ingredient.name}</h3>
        <span class="detail-box__quantity"
          >Only <span>${ingredient.quantity}</span> items left</span
        >
        <span class="detail-box__quantity">Shop Now 💥</span>
        <input type="hidden" value="${ingredient._id}" class="itemId" />
        <button class="detail-box__btn">+ Add</button>
      </div>
    </div>
  </div>
</div>`;
  document.querySelector(".detail-section").innerHTML = text;
}

async function addToSimilar() {
  let text = "";
  let title = `<h2 class="similar-title">Similar items you might like</h2>
  <span class="similar-caption">Base on Customer bought</span>`;
  const ingredients = (await getIngredients(token)).ingredients;

  ingredients.forEach((e) => {
    text += `<div class="similar">
    <div class="similar-img">
      <img src="${e.imageUrl}" alt="" />
    </div>
    <div class="similar-detail">
      <p class="similar-detail__price">$${e.price} <span>${e.description}</span></p>
      <h3 class="similar-detail__name">${e.name}</h3>
      <div class="similar-detail__rating">
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>
      </div>
      <div class="similar-detail__status">
        <span>Pickup</span>
        <span>Delivery</span>
      </div>
      <a href="ingredientDetail.html?id=${e._id}" class="similar-detail__btn"
        ><i class="ri-eye-line"></i
      ></a>
    </div>
  </div>`;
  });

  document.querySelector(".similar-container").innerHTML = text;
}

function getParameter(pName) {
  let parameter = new URLSearchParams(window.location.search);
  return parameter.get(pName);
}

document
  .querySelector(".detail-section")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    const cart = e.target.closest(".detail-box__btn");
    const parent = cart.parentElement;

    console.log(parent.querySelector(".itemId").value);
    if (cart) {
      let isAdded = await addToCart(parent.querySelector(".itemId").value);

      console.log(isAdded);

      if (isAdded) {
        addShortPopup("Successfully add to cart!");
      } else {
        addShortPopup("Fail add to cart!");
      }

      await checkCart(
        +document.querySelector(".openCart").children[1].innerText + 1
      );
    }
  });

renderSpinner(detail);

await ingredientDetail();
await addToSimilar();
