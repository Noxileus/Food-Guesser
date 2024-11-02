async function fetchData() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');

        if (!response) {
            throw new Error('Could not fetch the resources');
        }

        const data = await response.json();
        const meal = data.meals[0];

        //Extracting the data
        const foodImg = meal.strMealThumb;
        const foodName = meal.strMeal;
        const foodIngredients = meal.strIngredient1;
        const foodDescription = meal.strInstructions;
        const foodCountry = meal.strArea;
        const foodCategory = meal.strCategory;

        document.getElementById("food-image").src = foodImg;
        document.getElementById("food-name").textContent = foodName;
        document.getElementById("ingredients").textContent = foodIngredients;
        document.getElementById("description").textContent = foodDescription;
        document.getElementById("country").textContent = foodCountry;
        document.getElementById("category").textContent = foodCategory;

        window.currentMeal = meal;
    } catch (error) {
        console.error('Error:', error);
    }
}

function loadDish() {
    fetchData()
        .then(data => {
            const dish = {
                name: data.foodName,
                ingredients: data.foodIngredients,
                description: data.foodDescription,
                country: data.country,
                image: data.foodImg
            };
            displayDish(dish);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayDish(dish) {
    document.getElementById("food-image").src = dish.image;
    document.getElementById("food-name").textContent = dish.name;
    document.getElementById("ingredients").textContent =   dish.ingredients;
    document.getElementById("description").textContent = dish.description;
    document.getElementById("guess-input").value = "";
    document.getElementById("guess-input").focus();
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
