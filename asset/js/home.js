const mealPost = document.querySelector(".meal__post");
const meallist = document.querySelector(".meal__list");
const mealSection = document.querySelector(".meal");

let myPostText = "";
let myListText = "";
const addToPost = async (country = "American") => {
  try {
    const food = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`
    );
    let foodData = (await food.json()).meals;
    foodData = foodData.slice(0, 8);


    foodData.forEach((food) => {
      myPostText += `<div class="meal__card">
            <img src="${food.strMealThumb}" alt="" />
            <div class="meal__data">
              <h3 class="teartiary__heading">${food.strMeal}</h3>
              <div class="meal__info">
                <p class="meal__type">${country}</p>
                <a href="rescipeMainpage.html?id=${food.idMeal}" class="meal__button">
                <ion-icon name="fast-food-outline"></ion-icon>
                </a>
              </div>
            </div>
          </div>`;
    });
    mealPost.innerHTML = "";
    mealPost.innerHTML = myPostText;
    myPostText = "";
  } catch {
    mealPost.innerHTML = "Loading...";
  }
};

const addToList = async () => {
  try {
    const list = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    let listData = (await list.json()).meals;

    listData = listData.slice(0, 10);

    // console.log(listData);
    listData.forEach((list) => {
      myListText += `<li class="meal__item">
            <a href="#" class="meal__link ">${list.strArea}</a>
          </li>`;
    });

    meallist.innerHTML = myListText;
    myListText = "";
  } catch {}
};

mealSection.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("meal__link")) {
    mealPost.classList.add("meal__effect");
    // e.target.classList.add("meal__link-active");

    setTimeout(() => {
      addToPost(e.target.innerText);
    }, 1500);
  }

  const mealCloset = e.target.closest(".meal__info");
  if (mealCloset) {
    window.location.href = mealCloset.querySelector(".meal__button").href;
  }
});

mealPost.addEventListener("animationend", function (e) {
  mealPost.classList.remove("meal__effect");
});

addToList();
addToPost();

document.querySelector(".header__form--go-button").addEventListener("click", function(e) {
  window.location.href= `rescipeMainpage.html?search=${document.querySelector(".header__form--input").value}`
})