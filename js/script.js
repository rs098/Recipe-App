let reviewcarousel = document.querySelector(".review_carousel");
let prevReview = document.querySelector(".prev_review");
let nextReview = document.querySelector(".next_review");
let breakfastParent = document.querySelector(".show_category");
let carouselItem = document.querySelector(".carousel_item");
let searchAnchor = document.querySelector("#search_anchor");
let mealSearch = document.querySelector("#meal");
let searchSuggestion = document.querySelector(".search_suggestion");
let suggestion = document.querySelectorAll(".suggestion");
let searchResult = document.querySelector(".show_search_result");
let viewMoreSpan = document.querySelector("#view_result_more");
let filtername = document.querySelectorAll(".filter_name");

function search_result_dom(res) {
  document.querySelector(".search_result").style.display = "block";
  searchResult.innerHTML = "";
  res.forEach((ele) => {
    let resultDom = `<a href="./mealView.html" class="meal_card" onclick="redirect(event)" data-idMeal=${ele.idMeal}><div class="category_dish" data-idMeal=${ele.idMeal}>
        <div class="dish_img_div" >
        <i class="far fa-heart"></i>
        <img src="${ele.strMealThumb}">
        </div>
        <div class="dish_info">
        ${ele.strMeal}
        </div>
        </div> </a>`;
    document.querySelector(".search_result").style.display = "block";
    searchResult.innerHTML += resultDom;
  });
}

class Category {
  constructor(e) {
    this.ele = e;
    this.handleClick();
  }
  handleClick() {
    let self = this.ele;
    this.ele.addEventListener("click", function () {
      let category = self.innerText;
      filtername.forEach((ele) => {
        let cls = ele.classList;
        if (cls[2] == "filter_name_select") {
          ele.classList.remove(cls[2]);
        }
      });
      self.classList.add("filter_name_select");
      let xhrRequest = new XMLHttpRequest();
      xhrRequest.onload = function () {
        let res = JSON.parse(xhrRequest.response).meals;
        search_result_dom(res);
      };
      xhrRequest.open(
        "get",
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      xhrRequest.send();
      xhrRequest.onerror = function (err) {
        console.log(err);
      };
    });
  }
}

filtername.forEach((ele) => {
  new Category(ele);
});

class Favourite {
  constructor(icon) {
    this.icon = icon.target;
    this.handleClick();
  }

  handleClick() {
    let name = this.icon.getAttribute("id");
    mealInfo.favourite.push(name);
  }
}

searchAnchor.addEventListener("click", function (e) {
  // WHEN SEARCH BTN IS CLICKED , WINDOW IS SCROLL TILL SEARCH INPUT
  e.preventDefault();
  let y = mealSearch.getBoundingClientRect().y;
  let scrollSearch = setInterval(() => {
    window.scrollBy(0, 3);
    y = mealSearch.getBoundingClientRect().y;
    if (y <= 5) {
      clearInterval(scrollSearch);
    }
  }, 1);
});

prevReview.addEventListener("click", function (e) {
  // WHEN PREV BTN IN REVIEW CAROUSEL IS CLICKED , PREVIOUS REVIEWS IS SHOWN
  let item_width = carouselItem.getBoundingClientRect().width + 20;
  let left = item_width;
  const reviewScroll = setInterval(() => {
    reviewcarousel.scrollBy(-2, 0);
    left -= 2;
    if (left <= 0) {
      clearInterval(reviewScroll);
    }
  }, 1);
});

nextReview.addEventListener("click", function (e) {
  // WHEN NEXT BTN IN REVIEW CAROUSEL IS CLICKED , NEXT REVIEWS IS SHOWN
  let item_width = carouselItem.getBoundingClientRect().width + 20;
  let right = 0;
  const reviewScroll = setInterval(() => {
    reviewcarousel.scrollBy(2, 0);
    right += 2;
    if (right >= item_width) {
      right = 0;
      clearInterval(reviewScroll);
    }
  }, 1);
});

// FETCH THE BREAKFAST DATA
let xhrRequest = new XMLHttpRequest();
xhrRequest.onload = function () {
  let response = xhrRequest.response;
  let resJson = JSON.parse(response);
  bf = resJson.meals;
  bf.forEach((ele) => {
    let breakfastDom = `<a href="./mealView.html" class="meal_card" onclick="redirect(event)" data-idMeal=${ele.idMeal}> <div class="category_dish">
            <div class="dish_img_div" >
            <i class="far fa-heart" id="${ele.strMeal}" onClick="new Favourite(event)" ></i>
            <img src="${ele.strMealThumb}">
            </div>
            <div class="dish_info">
                ${ele.strMeal}
            </div>
            </div> </a>`;
    breakfastParent.innerHTML += breakfastDom;
  });
};
xhrRequest.onerror = function (err) {
  console.log(err);
};
xhrRequest.open(
  "get",
  "https://www.themealdb.com/api/json/v1/1/filter.php?c=BreakFast",
  true
);
xhrRequest.send();

function mealInputHandle(e) {
  // SOMETHING IS TYPE IN SEARCH INPUT ,FETCH THE RESULT OF SEARCH INPUT
  document.querySelector(".search_result").style.display = "block";
  searchResult.innerHTML = "";
  if (e == "") {
    document.querySelector(".search_result").style.display = "none";
  }
  let xhrRequest = new XMLHttpRequest();

  xhrRequest.onload = function () {
    let res = xhrRequest.response;
    res = JSON.parse(res);
    if (res.meals != null) {
      searchSuggestion.innerHTML = `<span> "${res.meals.length}" results found </span>`;
      res.meals.forEach((ele) => {
        searchSuggestion.style.display = "block";
        searchSuggestion.innerHTML += `
                <div class="suggestion" onclick="suggestionHandle(event)" >
                    ${ele.strMeal}
                </div>`;
        let resultDom = `<a href="./mealView.html" class="meal_card" onclick="redirect(event)" data-idMeal=${ele.idMeal}><div class="category_dish">
                    <div class="dish_img_div" >
                    <i class="far fa-heart"></i>
                        <img src="${ele.strMealThumb}">
                    </div>
                    <div class="dish_info">
                            ${ele.strMeal}
                    </div>
                </div> </a> `;
        document.querySelector(".search_result").style.display = "block";
        searchResult.innerHTML += resultDom;
      });
    } else {
      searchSuggestion.style.display = "none";
      document.querySelector(".search_result").style.display = "none";
    }
  };

  xhrRequest.onerror = function (err) {
    console.log(err);
  };
  xhrRequest.open(
    "get",
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${e}`
  );
  xhrRequest.send();
}

mealSearch.addEventListener("input", function (e) {
  mealInputHandle(e.target.value);
});
document.querySelector("body").addEventListener("click", function (e) {
  searchSuggestion.style.display = "none";
});

function suggestionHandle(e) {
  // CLICKED ON SUGGESTION , SHOW THAT SUGGESTION IN INPUT VALUE
  mealSearch.value = e.target.innerText;
  mealInputHandle(e.target.innerText);
}

function redirect(e) {
  e.preventDefault();
  let idMeal = e.target.closest("a").getAttribute("data-idMeal");
  localStorage.setItem("idMeal", idMeal);
  location.href = "./mealView.html";
}
