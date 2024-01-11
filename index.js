const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const seasonal = document.getElementById("recommended-slider");
const container = document.getElementById("slider");
const gridContainer = document.getElementById("grid-container");
const genreDropDown = document.getElementById("genre-dropdown");
const sortByDropdown = document.getElementById("sort-by-dropdown");
const sortOrderDropdown = document.getElementById("sort-order-dropdown");
const pageContainer = document.getElementById("page-container");
const pageWrapper = document.getElementById("wrapper");
const favButton = document.querySelector(".fav-btn");
const favClose = document.querySelector(".fav-close-button");
let sideBar = document.querySelector(".fav-side-bar");
const favorites = {};

favButton.addEventListener("click", function() {
  sideBar.style = "transform: translate(0%)";
  sideBar.style.display = "block";
  sideBar.style.transition = "transform 500ms ease-in";
  pageWrapper.style.filter = "blur(20px)";
});

favClose.addEventListener("click", function() {
  sideBar.style = "transform: translate(100%)";
  sideBar.style.display = "hidden";
  pageWrapper.style.filter = "none";
});

const rankingUrl =
  "https://anime-db.p.rapidapi.com/anime?page=1&size=10&sortBy=ranking&sortOrder=asc";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "7036ef53d4mshadbbeb475a3a0c8p144da1jsn718603bed062",
    "X-RapidAPI-Host": "anime-db.p.rapidapi.com"
  }
};

async function getRanked() {
  try {
    const response = await fetch(rankingUrl, options);
    const result = await response.json();
    console.log(result);
    result.data.forEach((anime, index) => {
      const div = document.createElement("div");
      const div2 = document.createElement("div");

      div.classList.add(`slide-image`);
      div.style.backgroundImage = `url(${anime.image})`;

      if (index === 0) {
        seasonal.style.backgroundImage = `url(${anime.image})`;
        div.setAttribute("data-active", "");
        div2.setAttribute("data-active", "");
      }
      div2.classList.add("slide-info");
      div2.innerHTML = `<a href="${anime.link}" target="_blank"><h1>${anime.title}</h1></a>
                    <p>${anime.type} &#160&#160&#160 Rank #${anime.ranking} &#160&#160&#160&#160 ${anime.status}</p>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                    <p>${anime.synopsis}
                `;

      container.appendChild(div);
      container.appendChild(div2);
    });
  } catch (error) {
    console.error(error);
  }
}

getRanked();

const buttons = document.querySelectorAll("[data-carousel-button]");

// Define the function that changes the slide
function changeSlide(offset) {
  const carousel = document.querySelector("[data-carousel]");
  const slides = carousel.querySelector("[data-slides]");

  const slideImages = Array.from(slides.getElementsByClassName("slide-image")); // Select only elements with the 'slide-image' class
  const infoDivs = Array.from(carousel.getElementsByClassName("slide-info")); // Select only elements with the 'info-div' class

  const activeSlide = slides.querySelector("[data-active]");
  let newIndex = slideImages.indexOf(activeSlide) + offset;

  if (slideImages.length === 1) return;
  if (newIndex < 0) newIndex = slideImages.length - 1;
  if (newIndex >= slideImages.length) newIndex = 0;

  // Move data-active from one slide image to another
  slideImages[newIndex].dataset.active = true;
  delete activeSlide.dataset.active;

  // Move data-active from one info div to another
  const activeInfoDiv = carousel.querySelector(".slide-info[data-active]");
  if (activeInfoDiv) delete activeInfoDiv.dataset.active;
  infoDivs[newIndex].dataset.active = true;

  const seasonal = document.getElementById("recommended-slider");

  seasonal.style.backgroundImage = slideImages[newIndex].style.backgroundImage;
}

// Attach the event listener to the buttons
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const offset = button.dataset.carouselButton === "next" ? 1 : -1;
    changeSlide(offset);
  });
});

// Set the interval to change the slide every 20 seconds
setInterval(() => {
  changeSlide(1); // Change to the next slide
}, 20000);

async function searchFunc(pageNumber = 1) {
  const searchUrl = `https://anime-db.p.rapidapi.com/anime?page=${pageNumber}&size=18&search=${searchBar.value}&genres=${genreDropDown.value}&sortBy=${sortByDropdown.value}&sortOrder=${sortOrderDropdown.value}`;

  gridContainer.innerHTML = "";

  const response = await fetch(searchUrl, options);
  const result = await response.json();
  // console.log(searchUrl);
  console.log(result);
  pageCycler(result);

  result.data.forEach(card => {
    const div = document.createElement("div");
    div.classList.add("card");
    gridContainer.appendChild(div);

    div.style.backgroundImage = `url(${card.image})`;

    div.addEventListener("click", () => {
      infoCreation(card);
    });

    div.innerHTML = `<h4>${card.title}`;
  });
}

let currentPage = 1;
function pageCycler(obj) {
  const pageNum = obj.meta.totalPage;
  const links = pageContainer.querySelectorAll("a");
  if (links.length === 0) {
    for (let i = 1; i <= pageNum; i++) {
      const link = document.createElement("a");
      pageContainer.appendChild(link);
      link.innerHTML = `${i}`;
      link.addEventListener("click", function() {
        if (i !== currentPage) {
          const links = document.querySelectorAll("#pageContainer a");
          links.forEach(link => {
            link.classList.remove("active");
          });
          this.classList.add("active");
          currentPage = i;
          searchFunc(i);
        }
      });
    }
  }
}

function infoCreation(card) {
  const infoCard = document.querySelector(".info-card");
  // console.log(card);
  const titles = card.alternativeTitles.join(", ");
  const div = document.createElement("div");
  if (!infoCard) {
    // console.log(infoCard);
    div.classList.add("info-card");
    pageContainer.appendChild(div);
    div.style.animation = "moveToCenter 500ms forwards";
    div.style.visibility = "visible";
    pageWrapper.style.filter = "blur(20px)";
    div.innerHTML = `
        <div class="image-container">
            <img src="${card.image}">
        </div>
        <div class="titles-container">
        <button onclick='removeInfoCard()' class="info-close-button">X</button>
        <h1>${card.title}</h1>
            <p>alternate titles</p>
            <p>${titles}</p>
            <br>
            <a href="${card.link}">${card.link}</a>
        </div>
        <div class="more-info--container">
        <p>information</p>
        <ul>
            <li>Ranking: ${card.ranking}</li>
            <li>${card.genres}</li>
            <li>Status: ${card.status}</li>
            ${card.type}
        </ul>
            <br>
            <br>
            <br>
            <button class="add-favourite">➕</button>
            <button>▶️</button>
        </div>
        <div class="synopsis-container">
            <h2>Synopsis</h2>
            <p>${card.synopsis}</p>
        </div>`;

    div.querySelector(".add-favourite").onclick = function() {
      // console.log(favorites);
      saveFavorites(favorites, card);
    };
  } else if (document.contains(infoCard)) {
    console.log("info-card already exists");
  }
}

function removeInfoCard() {
  var infoCard = document.querySelector(".info-card");
  console.log("you clicked outside the element");
  infoCard.remove();
  pageWrapper.style.filter = "none";
}

let favCounter = 0;
function saveFavorites(obj, card) {
  const favAnime = new Object();

  let favName = card.title;
  if (Object.values(obj).some(value => value && value.name === favName)) {
    console.log("This name already exists in the object.");
    return; // Exit the function if the name exists
  }
  let newKey = "fav" + favCounter;
  favCounter++;

  let link = document.createElement("a");
  link.href = `${card.link}`;
  link.target = "_blank";
  link.title = `myanimelist: ${card.link}`;
  link.textContent = favName;
  link.className = "fav-link";

  const span = document.createElement("span");
  span.textContent = `${card.genres}`;
  span.className = "tooltip";

  favAnime.name = favName;
  favAnime.genres = card.genres;
  obj[newKey] = { ...favAnime };
  console.log(favAnime);
  console.log(obj);
  link.appendChild(span);

  document.getElementById("ul").appendChild(link);
}

// function saveToLocalStorage(obj) {
//   localStorage.setItem("favoriteAnimes", JSON.stringify(obj));
// }

// function loadFromLocalStorage() {
//   const storedData = localStorage.getItem("favoriteAnimes");
//   return storedData ? JSON.parse(storedData) : {};
// }

// function displayFavorites(obj) {
//   const div = document.querySelector(".fav-side-bar");
//   div.innerHTML = "";
//   Object.values(obj).forEach(fav => {
//     let link = document.createElement("a");
//     link.textContent = fav.name;
//     link.className = "fav-link";
//     div.appendChild(link);
//   });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   let favoriteAnime = loadFromLocalStorage();
//   displayFavorites(favoriteAnime);
// });

// function addNewFavorite(obj, newFav) {
//   saveToLocalStorage(obj);
// }
