import {
  showSave,
  showCart,
  addToCart,
  checkSave,
  checkCart,
  addShortPopup,
  deleteCart,
} from "./helper.js";

document.querySelector(".openSave").addEventListener("click", function (e) {
  showSave();
});

// showCart();
document.querySelector(".openCart").addEventListener("click", function (e) {
  showCart();
});

document
  .querySelector(".all-carts")
  .addEventListener("click", async function (e) {
    console.log(e.target);

    let quantity, price;
    if (
      e.target.classList.contains("decrease-button") ||
      e.target.classList.contains("increase-button")
    ) {
      const allCart = document.querySelector(".all-carts");
      const child = allCart.querySelectorAll(".cart-card");

      let parent = e.target.parentElement;

      price = parent.querySelector(".ing_price").value;
      quantity =
        parent.parentNode.parentNode.querySelector(".number").innerText;

      await addToCart(
        parent.parentNode.parentNode.querySelector(".ing_id").value,
        quantity
      );

      parent.parentNode.parentNode.querySelector(".cart-price").innerText =
        "$" + Math.floor(price * +quantity);

      if (+quantity === 0) {
        return showCart();
      }
    }
  });

document.querySelector(".save").addEventListener("click", async function (e) {
  const save = e.target.closest(".addTocart");

  const trash = e.target.closest(".trash");

  if (save) {
    save.innerHtml = "";
    save.textContent = "loading...";

    const id = save.parentElement.querySelector(".cart_id").value;

    let isAdded = await addToCart(id);

    await checkCart();

    if (isAdded) {
      addShortPopup("Successfully Add To Cart");

      save.innerText = "";
      save.insertAdjacentHTML(
        "afterbegin",
        `+<ion-icon name="cart-outline"></ion-icon>`
      );
    } else {
      addShortPopup("Error occour");
    }
  }

  if (trash) {
    const parent = trash.parentElement.parentElement.parentElement;
    const id = parent.querySelector(".cart_id").value;
    let items = JSON.parse(localStorage.getItem("save"));

    items = items.filter((item) => item.id !== id);
    localStorage.setItem("save", JSON.stringify(items));
    parent.classList.add("trash-item");
    checkSave();

    document.querySelectorAll(".btn-active").forEach((save) => {
      if (save.querySelector(".itemId").value.split("#")[0] === id) {
        save.classList.remove("btn-active");
      }
    });

    parent.addEventListener("transitionend", function (e) {
      parent.remove();
    });
  }
});

document
  .querySelector(".all-carts")
  .addEventListener("click", async function (e) {
    const remove = e.target.closest(".remove_field");

    if (remove) {
      await deleteCart(
        document.querySelector(".all-carts").querySelector(".cart_id").value
      );
      await showCart();
    }
  });

checkSave();
await checkCart();
