import { fetchGetMethod, renderSpinner, url } from "./helper.js";



let text = `<tr>
<th>Order ID</th>
<th>Quantity</th>
<th>Price</th>
<th>Address</th>
<th>Payment</th>
<th>Status</th>
<th>Recipes</th>
</tr>
`;

let trText = "";
let total = 0;
let totPrice = 0;

async function getHistory() {
  let history = (
    await fetchGetMethod(`${url}/api/ingredients/get-history`)
  ).shipping;
  renderSpinner(document.querySelector(".mytable__body"));

  console.log(history);
  history.forEach((e, f) => {
    console.log(e.ingredients);
    e.ingredients.forEach((i) => {
      total += i.quantity;

      totPrice += Math.floor(i.ingredient.price * i.quantity) || 1;
    });

    history[f].totalQty = total;
    history[f].totalPrice = totPrice;
    total = 0;
    totPrice = 0;
  });

  history.forEach((e, i) => {
    trText += `<tr>
    <td>${e._id}</td>
    <td class="col col-4" data-label="Quantity">${e.totalQty}</td>
    <td class="col col-4" data-label="Price">$${e.totalPrice}</td>
    <td class="col col-4" data-label="Address">${e.userId.address || "Yangon"}</td>
    <td class="col col-4" data-label="Payment">Cash On Devery</td>
    <td class="col col-4" data-label="Status"><p class="status ${e.status == 'Success' ? 'delivered': e.status == 'Pending' ? 'pending': ''}">${e.status}</p></td>
    <td class="col col-4" data-label="Recipes">
      <a href="${url}/docs/${e.filePath}">recipe</a>
    </td> </tr>`;
  });

  document.querySelector(".mytable__header").textContent = "";
  document
    .querySelector(".mytable__header")
    .insertAdjacentHTML("afterbegin", text);

  document.querySelector(".mytable__body").textContent = "";
  document
    .querySelector(".mytable__body")
    .insertAdjacentHTML("afterbegin", trText);
}

getHistory();
