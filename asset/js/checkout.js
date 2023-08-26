import { addToShipping, getTotalPrice, renderSpinner } from "./helper.js";

const shippingBill = document.querySelector(".shipping__bill");

async function addToPrice() {
  shippingBill.innerHTML = "";
  renderSpinner(shippingBill);

  const total = (await getTotalPrice()).total;

  console.log(total);
  const shipping = 5;

  let text = `
  <h2>Shopping Bill</h2>
  <div class="shipping__total">
  <div class="shipping-2">
 <p>price</p>
 <p>$${total}</p>
</div>
  <div class="shipping-1">
 <p>Shipping fee</p>
 <p>$${Math.floor(shipping)}</p>
</div>

<div class="line"></div>

          <div class="ship_total">
            <p>Total</p>
            <p>$${Math.floor(shipping + total)}</p>
          </div>
          </div>

`;
  shippingBill.innerHTML = "";

  shippingBill.insertAdjacentHTML("afterbegin", text);
}

addToPrice();

document
  .querySelector(".checkoutForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    document.querySelector(".checkout_bill").innerHTML = "";

    renderSpinner(document.querySelector(".checkout_bill"));

    const shipData = await addToShipping(e.target);
    const isSuccess = shipData.message;
    const shipDetail = shipData.shipping;

    if (isSuccess === "success") {
      document.querySelector(".checkout_bill").innerHTML = "";
      document.querySelector(".checkout_bill").insertAdjacentHTML(
        "afterbegin",
        `<div class="checkout-result">
         <img src="./asset/images/correct.png" />
        <div>
        <h2>Successfully Ordered</h2>
  
        <a href="#">your recipes</a>
      </div>
       </div>
      `
      );
    } else if (isSuccess === "fail") {
      document.querySelector(".checkout_bill").innerHTML = "";
      document.querySelector(".checkout_bill").insertAdjacentHTML(
        "afterbegin",
        `<div class="checkout-result">
        <img src="./asset/images/fail.png" />
       <div>
       <h2 style="color: red">Fail Ordered</h2>
     </div>
      </div>`
      );
    }
  });
