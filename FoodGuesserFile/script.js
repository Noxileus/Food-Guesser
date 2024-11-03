let point=0;
let dishNumber = 1;
let globalCountryName;
let globalFoodName;
let guesses;

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

        // Build a dish object
        const dish = {
            name: foodName,
            ingredients: foodIngredients,
            //description: foodDescription,
            country: foodCountry,
            image: foodImg
        };

        // Return the dish object
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
    // Remove the trailing comma and space
    return ingredientsArray;
}


async function loadDish() {
    try {
        const dish = await fetchData();
        if (dish) {
            displayDish(dish);
            // Store the dish globally for access in other functions
            window.currentDish = dish;
            document.getElementById("dish-number").textContent = `Dish #${dishNumber}`;
            dishNumber++;
        } else {
            console.error('Dish data is undefined');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


function displayDish(dish) {
    document.getElementById('guess-input').style.visibility = "visible";
    guesses=0;
    document.getElementById("food-image").src = dish.image;
    document.getElementById("food-name").textContent = 'Name (Reveals after correct guess)';
    
    //clear existing ingredients
    const ingredientsList = document.getElementById("ingredient-list");
    ingredientsList.innerHTML = '';

    //populate ingredients list
    dish.ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
     
    })

    
    //document.getElementById("ingredients").textContent = dish.ingredients;
    document.getElementById("description").textContent = dish.description;
    document.getElementById("country").textContent = dish.country;
    document.getElementById("guess-input").value = "";
    document.getElementById("guess-input").focus();
}


function submitGuess() {
    const userGuess = document.getElementById("guess-input").value.trim().toLowerCase();

    //const correctCountry = window.currentDish.country.toLowerCase();


    /*const correctCountry = window.currentDish.country.toLowerCase();*/
    const feedback = document.getElementById("feedback");

    if (userGuess === globalCountryName.toLowerCase()) {

        if (guesses < 10000)
        {
            feedback.textContent = "Correct! Great job!";
            document.getElementById("food-name").textContent = 'Name: ' + globalFoodName ;
            
            // Optionally load a new dish after a delay
            revealDishName();
            setTimeout(loadDish, 1500);
            point++;
            
            
        }
       guesses = 10001;
        //revealDishName();

        document.getElementById("score-display").textContent = point;
        

    } else {
        guesses++;
        feedback.textContent = "Try again! Hint: Nationality name begins with a "+ globalCountryName.charAt(0);
        if (guesses > 2)
        {
            feedback.textContent = "Too many tries, this is a  "+globalCountryName+ " dish";
            document.getElementById('guess-input').style.visibility = "hidden";
            
        }

    }
}

function revealDishName() {
    document.getElementById("food-name").textContent = window.currentDish.name;
}



// Initial load
window.onload = loadDish;
