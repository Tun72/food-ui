const token = localStorage.getItem("token") || null;

let body = document.querySelector("body");

export const url =  "https://food-recipe-admin-server-ae75c769cee1.herokuapp.com" //"http://localhost:4000"; //
// Fetch
export async function getUser(token) {
  const result = await fetch(`${url}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await result.json()) || null;

  return data;
}

export async function getIngredients(page) {
  const result = await fetch(`${url}/api/ingredients?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await result.json()) || null;

  return data;
}

export async function getIngredientById(id) {
  let data = null;
  try {
    const result = await fetch(`${url}/api/ingredients/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

export async function getIngredientByName(name) {
  let data = null;
  try {
    const result = await fetch(
      `${url}/api/ingredients/ingredient-by-name/${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

export async function getIngredientCategory() {
  let data = null;
  try {
    const result = await fetch(`${url}/api/ingredients/ingredient-category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    data = await result.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }

  return data;
}

export async function getIngredientByCategoryName(category) {
  let data = null;
  try {
    const result = await fetch(
      `${url}/api/ingredients/ingredient-category?name=${category}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

export async function addToCart(id, quantity = 1) {
  let data = false;
  try {
    const result = await fetch(`${url}/api/ingredients/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, quantity }),
    });
    data = (await result.json()).message === "success";
  } catch (err) {
    console.log(err);
  }

  return data;
}

async function getCart(id) {
  let data = false;
  try {
    const result = await fetch(`${url}/api/ingredients/add-to-cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

export async function deleteCart(id) {
  let data = false;
  try {
    const result = await fetch(`${url}/api/ingredients/delete-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

////////////////////////////////////////////////
// Updated Fetch //
export async function fetchGetMethod(url) {
  let data = null;
  try {
    const result = await fetch(`${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

export async function fetchPostMethod(url, inp_data) {
  let data = null;
  try {
    const result = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(inp_data),
    });

    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

// cart and Save
export async function listenSaveAndCart() {
  const productGrid = document.querySelector(".product-grid");
  productGrid.addEventListener("click", async function (e) {
    e.preventDefault();

    let save = e.target.closest(".saveItem");
    let cart = e.target.closest(".addCart");
    let detil = e.target.closest(".detailItem");

    if (save) {
      save.classList.add("btn-active");
      let value = save.querySelector(".itemId").value.split("#");
      let data = JSON.parse(localStorage.getItem("save")) || [];

      let isData = data.findIndex((d) => d.id === value[0]);

      if (isData < 0) {
        data = [
          ...data,
          {
            name: value[2],
            imageUrl: value[1],
            id: value[0],
            price: value[3],
          },
        ];
        addShortPopup("Successfully Save", "success");
      } else {
        data = data.filter((d) => d.id != value[0]);
        save.classList.remove("btn-active");
        addShortPopup("Successfully Remove", "success");
      }

      localStorage.setItem("save", JSON.stringify(data));
      checkSave();
    } else if (cart) {
      if (!token) {
        addShortPopup("Please Login !", "fail");
        return;
      }
      let isAdded = await addToCart(cart.querySelector(".itemId").value);

      if (isAdded) {
        addShortPopup("Successfully Add To Cart", "success");
      } else {
        addShortPopup("Error occour", "success");
      }
      await checkCart(
        +document.querySelector(".openCart").children[1].innerText + 1
      );
    } else if (detil) {
      window.location.href = detil.href;
    }
  });
}

export function showSave() {
  document.querySelector(".save").innerHTML = "";
  let text = ` `;
  let data = JSON.parse(localStorage.getItem("save")) || [];
  if (!data.length) {
    text += "No Saved Item Found";
  } else {
    data.forEach((e) => {
      text += `<tr>
      <td>
        <img src="${e.imageUrl}" alt="" />
      </td>
      <td>${e.name}</td>
      <td>
        $${e.price}
      </td>
      <td>
        <div class="btn-td"> <input type="hidden" value="${e.id}" class="cart_id" />
        <button class="save_btn addTocart">
          +<ion-icon name="cart-outline"></ion-icon>
        </button>

        <a class="save_btn see_btn" href="ingredientDetail.html?id=${e.id}">
          <ion-icon name="eye-outline" class=""></ion-icon>
        </a>

        <span class="icon trash"
        ><ion-icon name="trash-outline"></ion-icon
      ></span></div>
      </td>
     
    </tr>`;
    });
  }

  document.querySelector(".save").insertAdjacentHTML("afterbegin", text);
}

export async function showCart() {
  document.querySelector(".all-carts").innerHTML = "";

  if (!token) {

    // 
  
    document.querySelector(".all-carts").innerHTML = renderError("Login First");
    document.querySelector(".checkout-btn").classList.add("disable-btn");

    console.log(document.querySelector(".checkout-btn"));
    return
  }
  checkCart();
  renderSpinner(document.querySelector(".all-carts"));
  document.querySelector(".checkout-btn").classList.remove("disable-btn");

  let carts = (await getCart()).carts;
  let text = "",
    total = 0;

  if (carts.length) {
    carts.forEach((e, i) => {
      text += `<div class="cart-card">
    <span class="cart-tag">Best Seller</span>
    <div class="cart-item">
      <div class="cart-detail">
        <img
          src="${e.ingredient.imageUrl}"
          alt=""
        />
        <div class="cart-name">
          <h3>${e.ingredient.name}</h3>
          <span>${e.ingredient.description}</span>
        </div>
      </div>
      <p class="cart-price">$${Math.floor(e.ingredient.price * e.quantity)}</p>
    </div>
    <div class="cart-buttons">
      <a href="#" class="remove_field">Remove</a>

      <div class="quantity-field">
        <button
          class="value-button decrease-button"
          onclick="decreaseValue(this)"
          title="Azalt"
        >
          -
        </button>
        <input type="hidden" value="${e._id}" class="cart_id" />
        <input type="hidden" value="${e.ingredient._id}" class="ing_id" />
        <input type="hidden" value="${e.ingredient.price}" class="ing_price" /> 
        <div class="number">${e.quantity}</div>
        <button
          class="value-button increase-button"
          onclick="increaseValue(this,5)"
          title="Arrtır"
        >
          +
        </button>
      </div>
    </div>
    <div class="line"></div>
  </div>
  `;
      total += Math.floor(e.ingredient.price * e.quantity);
    });
    document.querySelector(".all-carts").innerHTML = "";

    // cartFeature(carts.length, total);
    document.querySelector(".all-carts").insertAdjacentHTML("afterbegin", text);
  } else {
    document.querySelector(".all-carts").innerHTML = "";

    // cartFeature(carts.length, total);
    document
      .querySelector(".all-carts")
      .insertAdjacentHTML("afterbegin", "No Item Found");
  }
}

export function cartFeature(total, price) {
  document.querySelector(".checkout-total").innerHTML = "";
  document.querySelector(".checkout-discount").innerHTML = "";
  document.querySelector(".checkout-overall").innerHTML = "";

  let subText = `
    <h4 class="checkout-sub">Subtotal(${total} items)</h4> <p class="checkout-price">$ ${price}</p>
 `;

  let taxtext = `<h4>Tax</h4>
                  <p class="checkout-tax">$${10 * total}</p>`;

  let totalText = `<h4>Estimated total</h4>
                  <p class="price total-price">$${price + 10 * total}</p>`;

  document
    .querySelector(".checkout-total")
    .insertAdjacentHTML("afterbegin", subText);
  document
    .querySelector(".checkout-discount")
    .insertAdjacentHTML("afterbegin", taxtext);
  document
    .querySelector(".checkout-overall")
    .insertAdjacentHTML("afterbegin", totalText);
}

export async function getTotalPrice() {
  let data = false;
  try {
    const result = await fetch(
      `${url}/api/ingredients/add-to-cart?total=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

export async function addToShipping(data) {
  const [city, address, zip] = data;

  try {
    const result = await fetch(`${url}/api/ingredients/add-to-shipping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        city: city.value,
        address: address.value,
        zip: zip.value,
        payment: "Cash On Delivery",
      }),
    });
    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
}

//////////////////////////////////////////

// check Helper
export function checkSave(tot = null) {
  const total = tot || (JSON.parse(localStorage.getItem("save")) || []).length;

  document.querySelector(".openSave").children[1].innerText = total;
}

export async function checkCart(tot = null) {
  const total = tot || (await getTotalPrice()).totalItem || 0;

  document.querySelector(".openCart").children[1].innerText = total;
}

///////////////////////////////

export const renderError = function (message) {
  return `<div class="error_render">
  <img src="./asset/images/Error.webp" alt="" />
  <p>${message}</p>
</div>`;
};
// components
export const renderSpinner = function (html) {
  const markup = `
  <div class="recipe__spinner">
       <span class="loader"></span>
       <div><h4 class="loading-text">Loading...</h4></div>
   </div>
  `;
  html.insertAdjacentHTML("afterbegin", markup);
};

export function addShortPopup(msg, status) {
  let img = "correct.png";
  if (status == "fail") {
    img = "Error.webp";
  }
  let body = document.querySelector("body");
  let text = `<div class="running_pop active">
  <img src="./asset/images/${img}" alt="" />
  <p>${msg}</p>
  <span class="close">X</span>
</div>`;

  body.insertAdjacentHTML("afterbegin", text);
  setTimeout(removePopup, 1000);
}

export function removePopup() {
  body.removeChild(document.querySelector(".running_pop"));
}

///////////////////////////////////////
