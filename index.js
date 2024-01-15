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
const favLink = document.querySelector("fav-link");
let sideBar = document.querySelector(".fav-side-bar");
const favorites = {};

window.addEventListener("load", loadFavorites);

const favCloseBtn = document.querySelector(".fav-close-button");
favButton.addEventListener("click", function() {
  sideBar.style = "transform: translate(0%)";
  sideBar.style.display = "block";
  favCloseBtn.style = "transform: translateX(0%)";
  sideBar.style.transition = "transform 500ms ease-in";
  pageWrapper.style.filter = "blur(20px)";
});

favClose.addEventListener("click", function() {
  sideBar.style = "transform: translate(100%)";
  favCloseBtn.style.display = "none";
  favCloseBtn.style = "transform: translateX(100%)";
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
      div2.classList.add("divWithEllipsis");
      div2.innerHTML = `<h1 class="slider-title">${anime.title}</h1>
                    <p>${anime.type} &#160&#160&#160 Rank #${anime.ranking} &#160&#160&#160&#160 ${anime.status}</p>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                    <p class="info-synopsis">${anime.synopsis}
                `;

      container.appendChild(div);
      container.appendChild(div2);

      const sliderTitle = div2.querySelector(".slider-title");
      sliderTitle.addEventListener("click", function() {
        infoCreation(anime);
      });
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
            <button class="watch-link">▶️</button>
        </div>
        <div class="synopsis-container">
            <h2>Synopsis</h2>
            <p>${card.synopsis}</p>
        </div>`;

    div.querySelector(".watch-link").onclick = function() {
      const watchUrl = `https://zorox.to/filter?keyword=${card.title}`;
      window.open(watchUrl, "_blank");
    };

    div.querySelector(".add-favourite").onclick = function() {
      // console.log(favorites);
      saveFavorites(card);
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

function saveFavorites(card) {
  const storedFavorites = localStorage.getItem("favorites");
  const favoritesObj = storedFavorites ? JSON.parse(storedFavorites) : {};

  const storedFavCounter = localStorage.getItem("favCounter");
  let favCounter = storedFavCounter ? parseInt(storedFavCounter) : 0;

  let favName = card.title;
  if (
    Object.values(favoritesObj).some(value => value && value.name === favName)
  ) {
    console.log("This name already exists in the object.");
    return; // Exit the function if the name exists
  }
  let newKey = "fav" + favCounter;
  favCounter++;

  let link = document.createElement("li");
  link.textContent = favName;
  link.className = "fav-link";

  const span = document.createElement("span");
  span.textContent = `${card.genres}`;
  span.className = "tooltip";

  const favAnime = {
    title: favName,
    genres: card.genres,
    synopsis: card.synopsis,
    alternativeTitles: card.alternativeTitles,
    status: card.status,
    ranking: card.ranking,
    type: card.type,
    image: card.image,
    link: card.link
  };
  favoritesObj[newKey] = favAnime;
  console.log(favoritesObj);

  link.appendChild(span);

  document.getElementById("ul").appendChild(link);

  localStorage.setItem("favorites", JSON.stringify(favoritesObj));

  localStorage.setItem("favCounter", favCounter.toString());

  // Merge the new favorite with the existing favorites

  // Save the merged object back to localStorage
  // localStorage.setItem("favorites", JSON.stringify(favoritesObj));
}

function loadFavorites() {
  const storedFavorites = localStorage.getItem("favorites");

  const favoritesObj = storedFavorites ? JSON.parse(storedFavorites) : {};

  for (let key in favoritesObj) {
    if (favoritesObj.hasOwnProperty(key)) {
      const fav = favoritesObj[key];
      const link = document.createElement("li");

      link.textContent = fav.title;
      link.className = "fav-link";

      const span = document.createElement("span");

      span.textContent = fav.genres;
      span.className = "tooltip";

      const button = document.createElement("button");

      button.textContent = "X";
      button.className = "remove-fav-btn";

      button.addEventListener("click", function(event) {
        event.stopPropagation();
        event.preventDefault();

        link.style = "transform: translateXx(100%)";

        // Remove the favorite from the favorites object
        delete favoritesObj[key];

        // Update localStorage with the new favorites object
        localStorage.setItem("favorites", JSON.stringify(favoritesObj));

        // Remove the link element from the DOM
        document.getElementById("ul").removeChild(link);
      });

      link.appendChild(button);
      link.appendChild(span);

      document.getElementById("ul").appendChild(link);

      link.addEventListener("click", function() {
        infoCreation(fav);
      });
    }
  }
}
