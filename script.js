// Sample data
const foodData = [
    {
        name: "Francesinha",
        ingredients: "Bread, ham, linguiça, fresh sausage, steak, cheese, etc.",
        description: "Layers of bread, ham, sausage, steak with melted cheese...",
        country: "Portugal",
        image: "./images/francesinha.jpg"
    },
    {
        name: "Bibimbap",
        ingredients: "Rice, beef, assorted vegetables (like spinach, bean sprouts, carrots), gochujang (Korean chili paste), soy sauce, sesame oil, fried egg (optional).",
        description: "A Korean dish that consists of a bowl of warm rice topped with sautéed vegetables, sliced meat, and a raw or fried egg. It's typically served with gochujang, which is mixed in right before eating for a spicy kick.",
        country: "South Korea",
        image: "./images/bibimap.jpg" 
    },
    
];

let currentDishIndex = 0;

function loadDish() {
    const dish = foodData[currentDishIndex];
    document.getElementById("food-image").src = dish.image;
    document.getElementById("food-name").textContent = "Name (Reveals after 2 guesses)";
    document.getElementById("ingredients").textContent = dish.ingredients;
    document.getElementById("description").textContent = dish.description;
}

function submitGuess() {
    const userGuess = document.getElementById("guess-input").value.trim().toLowerCase();
    const correctCountry = foodData[currentDishIndex].country.toLowerCase();
    const feedback = document.getElementById("feedback");

    if (userGuess === correctCountry) {
        feedback.textContent = "Correct! Great job!";
        revealDishName();
        // Move to next dish or reset
    } else {
        feedback.textContent = "Try again!";
    }
}

function revealDishName() {
    document.getElementById("food-name").textContent = foodData[currentDishIndex].name;
}

// Initial load
window.onload = loadDish;
