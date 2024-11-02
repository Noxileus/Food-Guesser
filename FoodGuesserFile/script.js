async function fetchData() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

        if (!response.ok) {
            throw new Error('Could not fetch the resources');
        }

        const data = await response.json();
        const meal = data.meals[0];

        // Extracting the data using getIngredients function
        const foodImg = meal.strMealThumb;
        const foodName = meal.strMeal;
        const foodIngredients = getIngredients(meal);
        const foodDescription = meal.strInstructions;
        const foodCountry = meal.strArea;

        // Build a dish object
        const dish = {
            name: foodName,
            ingredients: foodIngredients,
            description: foodDescription,
            country: foodCountry,
            image: foodImg
        };

        // Return the dish object
        return dish;

    } catch (error) {
        console.error('Error:', error);
    }
}


function getIngredients(meal) {
    let ingredients = '';

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        // Check if ingredient is not null, undefined, or empty
        if (ingredient && ingredient.trim() !== '') {
            ingredients += `${measure ? measure.trim() : ''} ${ingredient.trim()}, `;
        }
    }
    // Remove the trailing comma and space
    return ingredients.slice(0, -2);
}


async function loadDish() {
    try {
        const dish = await fetchData();
        if (dish) {
            displayDish(dish);
            // Store the dish globally for access in other functions
            window.currentDish = dish;
        } else {
            console.error('Dish data is undefined');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


function displayDish(dish) {
    document.getElementById("food-image").src = dish.image;
    document.getElementById("food-name").textContent = 'Name (Reveals after correct guess)';
    document.getElementById("ingredients").textContent = dish.ingredients;
    document.getElementById("description").textContent = dish.description;
    document.getElementById("country").textContent = dish.country;
    document.getElementById("guess-input").value = "";
    document.getElementById("guess-input").focus();
}


function submitGuess() {
    const userGuess = document.getElementById("guess-input").value.trim().toLowerCase();
    const correctCountry = window.currentDish.country.toLowerCase();
    const feedback = document.getElementById("feedback");

    if (correctCountry.includes(userGuess)) {
        feedback.textContent = "Correct! Great job!";
        revealDishName();
        // Optionally load a new dish after a delay
        setTimeout(loadDish, 5000);
    } else {
        feedback.textContent = "Try again!";
    }
}


function revealDishName() {
    document.getElementById("food-name").textContent = window.currentDish.name;
}



// Initial load
window.onload = loadDish;