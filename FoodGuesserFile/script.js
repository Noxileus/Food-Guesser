let mealCache = [];
let currentMealIndex = -1;
const MAX_CACHE_SIZE = 3;
let point=0;
let globalCountryName;
let globalFoodName;
let guesses;
let streak=0;

// Initial setup function
async function initialize() {
    try {
        await loadDish();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

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
        //const foodDescription = meal.;
        const foodCountry = meal.strArea;
        const foodWebpage = meal.strSource;

        // Build a dish object
        const dish = {
            name: foodName,
            ingredients: foodIngredients,
            country: foodCountry,
            image: foodImg,
            recipeSite : foodWebpage,
            isGuessed: false
        };

        globalCountryName = dish.country;
        globalFoodName = dish.name;

        return dish;

    } catch (error) {
        console.error('Error:', error);
    }
}


function getIngredients(meal) {
    const ingredientsArray = [];

    for (let i = 1; i <= 8; i++) {
        const ingredient = meal[`strIngredient${i}`];

        // Check if ingredient is not null, undefined, or empty
        if (ingredient && ingredient.trim() !== '') {
            ingredientsArray.push(`${ingredient}`);
        }
    }
    
    return ingredientsArray;
}


async function loadDish(isPrevious = false) {
    try {
        if (!isPrevious) {
            const dish = await fetchData();
            if(dish) {
                guesses = 0;
                window.currentDish = dish;

                
                if(mealCache.length > MAX_CACHE_SIZE) {
                    mealCache.shift();
                }
                mealCache.push(dish);

                currentMealIndex = mealCache.length - 1;

                displayDish(dish);
            } else {
                console.error('Dish data undefined');
            }
        } else {
            if (currentMealIndex > 0) {
                currentMealIndex--;
                window.currentDish = mealCache[currentMealIndex];
                displayDish(mealCache[currentMealIndex]);
                document.getElementById('next-button').disabled = false;
            }
            if (currentMealIndex === 0) {
                document.getElementById('previous-button').disabled = true;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function loadNextFood() {
    if (currentMealIndex < mealCache.length - 1) {
        currentMealIndex++;
        window.currentDish = mealCache[currentMealIndex];
        displayDish(mealCache[currentMealIndex]);
        document.getElementById('previous-button').disabled = false;
        
        // Disable next button if we're at the end of the cache
        if (currentMealIndex === mealCache.length - 1) {
            document.getElementById('next-button').disabled = true;
            document.getElementById("guess-input").textContent = "Guess the nationality!";
        }
    }
}

function displayDish(dish) {
    document.getElementById('guess-input').style.visibility = "visible";
    document.getElementById("food-image").src = dish.image;
    document.getElementById("streak-display").textContent = streak;
    
    // If this is a cached dish that was previously guessed correctly, show its name
    if (currentMealIndex < mealCache.length - 1) {
        document.getElementById("food-name").textContent = 'Name: ' + dish.name;
        document.getElementById("food-name").setAttribute('href', dish.recipeSite);
        document.getElementById("guess-input").placeholder = dish.country;
        document.getElementById("guess-input").disabled = true;
        document.getElementById("submit-guess-button").style.display = "none";
    } else {
        document.getElementById("food-name").textContent = 'Name: (Reveals after correct guess)';
        document.getElementById("food-name").removeAttribute('href');
        document.getElementById("guess-input").disabled = false;
        document.getElementById("guess-input").placeholder = "Guess the nationality!";
        document.getElementById("submit-guess-button").style.display = "inline-block";
    }
    
    document.getElementById("feedback").textContent = '';
    
    // Clear existing ingredients
    const ingredientsList = document.getElementById("ingredient-list");
    ingredientsList.innerHTML = '';

    // Populate ingredients list
    dish.ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    document.getElementById("guess-input").value = "";
    document.getElementById("guess-input").focus();
    
    // Update navigation buttons
    document.getElementById('previous-button').disabled = currentMealIndex === 0;
    document.getElementById('next-button').disabled = currentMealIndex === mealCache.length - 1;
}


function submitGuess() {
    const userGuess = document.getElementById("guess-input").value.trim().toLowerCase();
    const correctCountry = window.currentDish.country.toLowerCase();
    const feedback = document.getElementById("feedback");

    if (userGuess === correctCountry.toLowerCase()) {
        if (guesses < 10000) {
            feedback.textContent = "Correct! Great job!";
            document.getElementById("food-name").textContent = 'Name: ' + globalFoodName;
            revealDishName();
            
            // Only load new dish if we're at the end of the cache
            if (currentMealIndex === mealCache.length - 1) {
                setTimeout(loadDish, 3000);
            }   
            point++;
            streak++;
            document.getElementById("score-display").textContent = point;
            document.getElementById("streak-display").textContent = streak;
        }
        guesses = 10001;
    } else {
        guesses++;
        feedback.textContent = "Try again! Hint: Nationality name begins with a "+ globalCountryName.charAt(0);
        if (guesses > 2) {
            streak = 0;
            feedback.textContent = "Too many tries, this is a  "+globalCountryName+ " dish";
            document.getElementById("submit-guess-button").style.display = "none";
            document.getElementById("guess-input").disabled = "true";
            setTimeout(loadDish, 3000);
        }
    }
}

function revealDishName() {
    const foodNameElement = document.getElementById("food-name")
    foodNameElement.textContent = 'Name: ' + window.currentDish.name;
    foodNameElement.setAttribute('href', window.currentDish.recipeSite);

}



// Initial load
window.onload = initialize;
