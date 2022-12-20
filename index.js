/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
 */

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from "./games.js";

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
 */

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
	// loop over each item in the data
	for (let i = 0; i < games.length; i++) {
		// create a new div element, which will become the game card
		const div = document.createElement("div");
		const img = document.createElement("img");
		img.src = `${games[i].img}`;
		// add the class game-card to the list
		div.classList.add("game-card");
		img.classList.add("game-img");

		const button = document.createElement("button");
		button.innerHTML = "Favorite";
		button.classList.add("favorite-button");
		button.dataset.name = games[i].name;

		// set the inner HTML using a template literal to display some info
		// about each game
		div.innerHTML = `<p><strong>${games[i].name}</strong></p>`;
		div.appendChild(img);
		div.innerHTML += `<p>${games[i].description}</p>`;
		div.innerHTML += "<br>";
		div.innerHTML += `<p>Backers: ${games[i].backers}</p>`;
		div.innerHTML += `<p>Pledged: $${games[i].pledged}</p>`;
		div.innerHTML += `<p>Goal: $${games[i].goal}</p>`;
		div.appendChild(button);

		//div.innerHTML +=  `"<img src=\'${games[i].img}\'/>"`;
		// TIP: if your images are not displaying, make sure there is space
		// between the end of the src attribute and the end of the tag ("/>")
		button.addEventListener("click", favorite);
		// append the game to the games-container
		document.getElementById("games-container").appendChild(div);
	}
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games

//console.log(GAMES_JSON);
//console.log(GAMES_JSON[1].name);
//console.log(GAMES_JSON[1].img);
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
 */

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, game) => {
	return accumulator + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString("en-US")}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce((accumulator, game) => {
	return accumulator + game.pledged;
}, 0);

//console.log(totalRaised);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString("en-US")}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
 */

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
	deleteChildElements(gamesContainer);

	// use filter() to get a list of games that have not yet met their goal
	const unmetGames = GAMES_JSON.filter((game) => {
		return game.goal > game.pledged;
	});

	// use the function we previously created to add the unfunded games to the DOM
	addGamesToPage(unmetGames);
	console.log(unmetGames.length);
}

// show only games that are fully funded
function filterFundedOnly() {
	deleteChildElements(gamesContainer);

	// use filter() to get a list of games that have met or exceeded their goal
	const metGames = GAMES_JSON.filter((game) => {
		return game.goal <= game.pledged;
	});

	// use the function we previously created to add unfunded games to the DOM
	console.log(metGames.length);
	addGamesToPage(metGames);
}

// show all games
function showAllGames() {
	deleteChildElements(gamesContainer);

	// add all games from the JSON data to the DOM
	addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operatorz
 */

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter((game) => {
	return game.goal > game.pledged;
});

// create a string that explains the number of unfunded games using the ternary operator
const string =
	unfundedGames.length === 1
		? `A total of <strong>$${totalRaised.toLocaleString(
				"en-US"
		  )}</strong> has been raised for ${
				GAMES_JSON.length
		  } games. Currently, 1 game remains unfunded. We need your help to fund these amazing games!`
		: `A total of <strong>$${totalRaised.toLocaleString(
				"en-US"
		  )}</strong> has been raised for ${GAMES_JSON.length} games. Currently, ${
				unfundedGames.length
		  } games remain unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const p = document.createElement("p");
p.innerHTML = string;
descriptionContainer.appendChild(p);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
	return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameName = document.createElement("p");
firstGameName.innerHTML = firstGame.name;
firstGameContainer.appendChild(firstGameName);

// do the same for the runner up item
const secondGameName = document.createElement("p");
secondGameName.innerHTML = secondGame.name;
secondGameContainer.appendChild(secondGameName);

/************************************************************************************
 * Optional Challenges: Button to increase funding/increase backer
 */
let favorites = [];

function favorite() {
	//console.log(this.dataset.name);
	this.innerHTML = "Unfavorite";
	const key = GAMES_JSON.findIndex(
		(obj) => obj.name === `${this.dataset.name}`
	);
	if (favorites.includes(key)) {
		//console.log("already in favorites");
		let tempArray = [];
		tempArray = favorites.filter((item) => item != key);
		favorites = tempArray;
		updateFavorites();
		this.innerHTML = "Favorite";
		return;
	} else {
		favorites.push(key);
	}
	console.log(key);
	console.log(favorites);
	updateFavorites();
}

function updateFavorites() {
	deleteChildElements(document.getElementById("favorite"));
	if (favorites.length === 0) {
		return;
	}
	/*
	favorites.forEach((game) => {
		const fav = document.createElement("p");
		fav.innerHTML = `${GAMES_JSON[game].name} with $${GAMES_JSON[game].pledged} pledged!`;
		document.getElementById("favorites-container").appendChild(fav);
	});
	*/
	for (let i = 0; i < favorites.length; i++) {
		const fav = document.createElement("p");
		fav.classList = "center";
		fav.innerHTML = `${GAMES_JSON[favorites[i]].name} with $${
			GAMES_JSON[favorites[i]].pledged
		} pledged!`;
		document.getElementById("favorite").appendChild(fav);
	}
}
