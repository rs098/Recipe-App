let idMeal = localStorage.getItem("idMeal");
let heading = document.querySelector(".meal-name");
let mealImg = document.querySelector("#meal-img");
let instruction = document.querySelector(".instrution");
let categorySpan = document.querySelector("#catspan");
let areaSpan = document.querySelector("#areaspan");
let ingSpan = document.querySelector(".mealIng");
let linkSpan = document.querySelector("#linkspan");

async function fetchRequest() {
  await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`)
    .then((response) => response.json())
    .then((data) => {
      let res = data.meals[0];
      console.log(res);
      heading.innerHTML = res.strMeal;
      mealImg.setAttribute("src", res.strMealThumb);
      instruction.innerHTML = res.strInstructions;
      categorySpan.innerHTML = res.strCategory;
      areaSpan.innerHTML = res.strArea;
      if (res.strYoutube != "") {
        linkSpan.innerHTML = `<a href=${res.strYoutube}> ${res.strYoutube} </a>`;
      }
      let ingredient = 1;
      while (1) {
        let x = `strIngredient${ingredient}`;
        if (res[x] != undefined && res[x] != "") {
          let ingredientDom = `
            <span class="mealVal">
              ${res[x]}, </span>
            `;
          ingSpan.innerHTML += ingredientDom;
        } else {
          break;
        }
        ingredient++;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

fetchRequest();
