const modal = document.querySelector(".recipe__modal");
const overlay = document.querySelector(".overlay");
const flagContainer = document.querySelector(".categories__slider");
const recipeContainer = document.querySelector(".recipe .row");
const searchBtn = document.querySelector(".search--btn");
const searchInput = document.querySelector(".search--input");
const search = document.querySelector(".search");
const messageBox = document.querySelector(".message-box");
const container = document.querySelector(".recipe-container");
const alertText = document.querySelector(".alert-text");
const categoriesList = document.querySelector(".categories-list");
const btnCategories = document.querySelector(".btn-categories");
const sortBtn = document.querySelector(".btn-sort");
const recipeVideo = document.querySelector(".recipe__video");
let link = '';
const url = "https://food-recipe-admin-server-ae75c769cee1.herokuapp.com"; //"http://localhost:4000"; //

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const closeAlert = function () {
  messageBox.classList.add("hidden");
};

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

//render spinner

const renderSpinner = function () {
  const markup = `
    <div class="recipe__spinner w-100 d-flex justify-content-center align-items-center flex-column">
         <span class="loader"></span>
         <div><h4 class="loading-text">Loading...</h4></div>
     </div>
    `;
  recipeContainer.insertAdjacentHTML("afterbegin", markup);
};
const renderSpinner_ = function (html) {
  const markup = `
  <div class="recipe__spinner">
       <span class="loader"></span>
       <div><h4 class="loading-text">Loading...</h4></div>
   </div>
  `;
  html.insertAdjacentHTML("afterbegin", markup);
};

//include country

const setDefaultFlag = function () {
  const html = `
        <div class="categories__slider--item" data-country="Myanmar"><img src="asset/images/myanmar.svg" alt="">
             <p>Myanmar</p>
         </div>
    `;
  flagContainer.insertAdjacentHTML("beforeend", html);

  // <div data-country="unknown" class="categories__slider--item"><img src="asset/unknown.png" alt="">
  // <p>Unknown</p>
  // </div>
};

//render Flag and country name

const generateFlag = function (data, demonyms) {
  flagContainer.innerHTML = "";
  setDefaultFlag();

  for (let con = 0; con < data.length; con++) {
    for (let dem = 0; dem < demonyms.length; dem++) {
      const denName = demonyms[dem].strArea;
      const conName = data[con].demonyms.eng.f;
      if (denName === conName) {
        const html = `
                <div class="categories__slider--item" data-country="${denName}"><img src="${
          data[con].flags.svg
        }" alt="">
                    <p>${data[con].name.common.slice(0, 6)}...</p>
                </div>
            `;
        flagContainer.insertAdjacentHTML("beforeend", html);
      }
    }
  }

  //set External flag
};

//fetch related country by recipe

const getCountryName = async function () {
  const info = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );

  const data = await info.json();

  return data.meals;
};

const getFlag = async function () {
  try {
    const countryName = await getCountryName();

    //get flag and name
    const info = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,flags,demonyms"
    );

    if (!info.ok) {
      throw new Error(info.status + " ,Not found the data");
    }

    const data = await info.json();

    generateFlag(data, countryName);
  } catch (err) {
    renderAlertMsg(err);
  }
};

//fetch data by citizen

const getDataByCitizen = async function (name) {
  try {
    recipeContainer.innerHTML = "";

    renderSpinner();

    let URL = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`;

    if (name === "Myanmar") {
      URL = `${url}/api/recipes`;
    }

    const info = await fetch(URL);

    const data = await info.json();

    //generate recipe ui
    renderMarkupRecipe(data, name);
  } catch (err) {
    renderAlertMsg(err);
  }
};

let currentData = [];
let currentName = "";
let sorted = false;

const trimWord = function (x) {
  return x.strMeal.trim().slice(0, 1).toLowerCase();
};

sortBtn.addEventListener("click", function (e) {
  e.preventDefault();

  renderMarkupRecipe(currentData, currentName, !sorted);
  sorted = !sorted;
});

const renderMarkupRecipe = function (item, name, sort = false) {
  currentData = item;
  currentName = name;
  recipeContainer.innerHTML = "";

  const { meals } = item;

  const sortMeal = sort
    ? meals.slice().sort(function (a, b) {
        if (trimWord(a) < trimWord(b)) return 1;
        if (trimWord(a) > trimWord(b)) return -1;
        return 0;
      })
    : meals;

  sortMeal.map((meal) => {
    const markup = generateRecipeCard(meal, name);
    recipeContainer.insertAdjacentHTML("beforeend", markup);
  });
};

const generateRecipeCard = function (meal, name = "") {
  let markup = `
    <div class="col-4">
                 <div class="recipe__card" data-id="${
                   meal.idMeal
                 }" data-country="${name}">
                      <div class="recipe__card--img">
                          <img src="${meal.strMealThumb}" alt="">
                      </div>
                     <div class="recipe__card--body">
                         <h4>${meal.strMeal}<h4>
                         <span class="card-icon"><i class="fa-solid fa-star"></i></span>
                         <span class="card-rating-text">${Math.round(((Math.random() * 5) + 3) * 10) /10 }</span>
                         <span class="card-menu-text">. ${
                           meal.strCategory ?? name
                         }</span>
                        `;
  if (meal.strArea) {
    markup += ` <span class="card-menu-text">. ${meal.strArea}</span>`;
  }

  markup += `      </div>
                 </div>
             </div>
    `;
  return markup;
};

const renderMarkupDetail = async function (data) {
  let items = [];
  let methods = [];
  for (let i = 1; i <= 20; i++) {
    items.push(data[`strIngredient${i}`]);
    methods.push(data[`strMeasure${i}`]);
  }
  let ingredient = items.map((item) => {
    if (item != "" && item != null) {
      let newItem = toTitleCase(item);
      return newItem;
    }
  });

  ingredient = ingredient.filter((item) => item);

  const measurement = methods.filter((method) => {
    return method != " " && method != "" && method != null;
  });

  const objRecipe = {
    title: data.strMeal,
    citizen: data.strArea,
    img: data.strMealThumb,
    measure: measurement,
    ingredients: ingredient,
    instruction: data.strInstructions,
    vlink : data.strYoutube

  };

  renderSpinner_(modal);

  const markup = await generateMarkupDetail(objRecipe);
  modal.textContent = "";
  modal.insertAdjacentHTML("afterbegin", markup);
};

const renderIngredients = async function (ingredients) {
  let data = null;
  try {
    const result = await fetch(`${url}/api/ingredients/check-by-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: ingredients }),
    });

    data = await result.json();
  } catch (err) {
    console.log(err);
  }

  return data;
};
const generateMarkupDetail = async function ({
  title,
  citizen,
  img,
  measure,
  ingredients,
  instruction,
  vlink 
}) {
  let html = "";
  
  console.log(vlink);
  if(citizen == "Myanmar") {
    link = vlink;
  } else {
    // link = "https://www.youtube.com/watch?v=4aZr5hZXP_s"
    link = "https://www.youtube.com/embed/" + vlink.split("=")[1];
  }
  html += `
    <button class="recipe__exit"><i class="fa fa-times" aria-hidden="true"></i>
    </button>
        <div class="recipe__modal--img">
        <img src="${img}" alt="">
        </div>
         <div class="recipe__modal--body">
        <h4>${title}</h4>
        <h5>${citizen}</h4>
  
          <div class="bookmark">
            <div class="bookmark-right">
              <span><i class="fa-solid fa-ruler"></i>   ${measure.length}  Measurement</span>
              <span><i class="fa-solid fa-book-open"></i>      ${ingredients.length}  Ingredients</span>
            </div>

            <div class="bookmark-left">
             <i class="fas fa-play"></i>
            </div>
          </div>
          <hr>
  
          <div class="recipe-ingredient">
            <h6>Recipe Ingredients</h6>
            <div class="row mt-4">
        `;

  for (let i = 0; i < ingredients.length; i++) {
    html += `
                 <div class="col-6 p-3"><span><i class="fa fa-check" aria-hidden="true"></i> ${ingredients[i]} (${measure[i]})</span></div>
            `;
  }

  const data = (await renderIngredients(ingredients)).ingredients;

  html += `     
            </div>
          </div>
          <hr>
  
          <div class="recipe-cooking">
            <h6>How to cook it</h6>
            <p class="mt-4">${instruction}</p>
          </div>
         
          <div class="recipe-ingredient-slider">`;
  data.forEach((e) => {
    html += `<div class="recipe-ingredient-show"><img src="${e.imageUrl}" alt="">
    <div class="recipe-ingredient-show-hover"><a href="ingredientDetail.html?id=${e._id}">See More</a></div>
    </div>`;
  });

  return html;
};

//fetch data from search
const renderMarkupSearch = function (item) {
  recipeContainer.innerHTML = "";

  const { meals } = item;

  meals.map((meal) => {
    const markup = generateRecipeCard(meal);
    recipeContainer.insertAdjacentHTML("beforeend", markup);
  });
};

const getDataBySearch = async function (userInput) {
  try {
    renderSpinner();

    const info = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${userInput}`
    );

    const data = await info.json();

    renderMarkupRecipe(data);
  } catch (err) {
    renderError();
  }
};

//fetch data by id
const getDataById = async function (id, isMM = false) {
  try {
    let URL = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    if (isMM) {
      URL = `${url}/api/recipes/${id}`;
    }
    const info = await fetch(URL);
    if (!info.ok) {
      throw new Error(info.status + " ,Not found the data");
    }

    const data = await info.json();
    const { meals } = data;
    modal.innerHTML = "";
    await renderMarkupDetail(meals[0]);
  } catch (err) {
    renderAlertMsg(err);
    renderError();
  }
};

const renderSearchResult = function (input) {
  recipeContainer.innerHTML = "";
  getDataBySearch(input);
};

const renderError = function () {
  recipeContainer.innerHTML = "";
  const markup = `
    <div class="recipe__spinner w-100 d-flex justify-content-center align-items-center flex-column">
    <div><h4 class="starting-text">OOps!No Result Found</h4></div>
    </div>
    `;
  recipeContainer.insertAdjacentHTML("afterbegin", markup);
};

const renderAlertMsg = function (text) {
  closeModal();
  alertText.innerHTML = "";
  alertText.innerText = text;
  messageBox.classList.remove("hidden");
};

const getCategories = async function () {
  try {
    categoriesList.innerHTML = "";

    const info = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
    );

    if (!info.ok) {
      throw new Error(info.status + " ,Not found the data");
    }

    const data = await info.json();

    const { meals } = data;

    renderCategories(meals);
  } catch (err) {
    renderAlertMsg(err);
  }
};

const renderCategories = function (data) {
  let markup = "";
  data.map((d) => {
    markup += generateMarkupCategories(d.strCategory);
  });
  categoriesList.insertAdjacentHTML("beforeend", markup);
};

const renderIframe = function (link) {
  return`<iframe
  width="800"
  height="500"
  src="${link}"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>`;
};

const generateMarkupCategories = function (text) {
  return `
    <li class="categories-list-item" data-name="${text}">
    <div class="catergories-container-icon">
      <img src="asset/images/${text}.svg" alt="">
      <span>${text}</p>
    </div>
    <div class="catergories-container-btn">
      <button><i class="fa-solid fa-plus"></i></button>
    </div>
  </li>
    `;
};

const getDataByCategories = async function (name) {
  try {
    recipeContainer.innerHTML = "";
    renderSpinner();
    const info = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`
    );
    recipeContainer.innerHTML = "";
    const data = await info.json();
    if (!info.ok) {
      throw new Error(info.status + " ,Not found the data");
    }
    console.log(data);
    const { meals } = data;

    meals.map((meal) => {
      const markup = generateRecipeCard(meal, name);
      recipeContainer.insertAdjacentHTML("beforeend", markup);
    });
  } catch (err) {
    renderAlertMsg(err);
  }
};


categoriesList.addEventListener("click", function (e) {
  const item = e.target.closest(".categories-list-item");
  if (!item) return;
  const name = item.getAttribute("data-name");

  getDataByCategories(name);
});

//event listener
flagContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("categories__slider--item")) {
    const name = e.target.getAttribute("data-country");
    getDataByCitizen(name);
  }
});

recipeContainer.addEventListener("click", function (e) {
  const recipeCard = e.target.closest(".recipe__card");
  if (!recipeCard) return;
  openModal();
  const id = recipeCard.getAttribute("data-id");
  const isMM = recipeCard.getAttribute("data-country") === "Myanmar";

  getDataById(id, isMM);
});

modal.addEventListener("click", async function (e) {
  if (e.target.closest(".recipe__exit")) {
    closeModal();
    modal.textContent = ""
  }

  if (e.target.closest(".bookmark-left")) {
    recipeVideo.classList.remove("hidden");
  
    

    recipeVideo.insertAdjacentHTML("afterbegin", renderIframe(link))
    closeModal();
  }
});

messageBox.addEventListener("click", function (e) {
  if (e.target.closest(".recipe__exit")) {
    closeAlert();
  }
});

search.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = searchInput.value;

  getDataBySearch(input);
});

document
  .querySelector(".recipe__video")
  .addEventListener("click", function (e) {
    this.classList.add("hidden");
    recipeVideo.textContent = ""
    openModal();
  });

function init() {
  overlay.addEventListener("click", function(){
    closeModal();
    modal.textContent = "";
  });

  getFlag();
  getCategories();
}

function getParameter(pName) {
  let parameter = new URLSearchParams(window.location.search);
  return parameter.get(pName);
}

const getDataByHashId = async function (id) {
  try {
    renderSpinner();
    const info = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await info.json();
    renderMarkupRecipe(data);
  } catch (error) {
    renderAlertMsg(error);
    renderError();
  }
};

function toTitleCase(str) {
  str = str.toLowerCase().split(" ");
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }

  console.log(str);
  return str.join(" ");
}

const id = getParameter("id") || 0;
const countryName = getParameter("name") || null;
const searchName = getParameter("search") || null;

if (id > 0) {
  getDataByHashId(id);
}

if (countryName) {
  getDataByCitizen(countryName);
}

if (searchName) {
  getDataBySearch(searchName);
}

init();
