document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('search-form');
    const queryInput = document.getElementById('query');
    const recipesDiv = document.getElementById('recipes');
    const modal = document.getElementById('recipeModal');
    const modalContent = {
        title: document.getElementById('modalTitle'),
        image: document.getElementById('modalImage'),
        category: document.getElementById('modalCategory'),
        area: document.getElementById('modalArea'),
        ingredients: document.getElementById('modalIngredients'),
        instructions: document.getElementById('modalInstructions'),
        youtube: document.getElementById('modalYoutube')
    };
    const closeModalButton = document.getElementsByClassName('close')[0];
    let recipes = []; // Global variable to store fetched recipes

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = queryInput.value;
        recipes = await searchRecipes(query); // Store fetched recipes in the global variable
        displayRecipes(recipes);
    });

    async function searchRecipes(query) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        return data.meals || [];
    }

    function displayRecipes(recipes) {
        recipesDiv.innerHTML = '';
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe', 'bg-white', 'border', 'p-4', 'm-2', 'rounded-lg', 'shadow-md', 'flex', 'flex-col', 'items-center');
            recipeDiv.innerHTML = `
                <h2 class="text-xl font-semibold mb-2">${recipe.strMeal}</h2>
                <img class="w-full h-32 object-cover mb-2" src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
                <button class="bg-blue-500 text-white p-2 rounded hover:bg-blue-700" onclick="showRecipeDetails('${recipe.idMeal}')">View Recipe</button>
            `;
            recipesDiv.appendChild(recipeDiv);
        });
    }

    window.showRecipeDetails = function(idMeal) {
        console.log(`Showing details for recipe with ID: ${idMeal}`);
        const recipe = recipes.find(r => r.idMeal === idMeal); // Use the global recipes variable
        if (recipe) {
            console.log('Recipe found:', recipe);
            modalContent.title.textContent = recipe.strMeal;
            modalContent.image.src = recipe.strMealThumb;
            modalContent.image.alt = recipe.strMeal;
            modalContent.category.textContent = `Category: ${recipe.strCategory}`;
            modalContent.area.textContent = `Area: ${recipe.strArea}`;
            modalContent.ingredients.innerHTML = getIngredients(recipe).map(ingredient => `<li>${ingredient}</li>`).join('');
            modalContent.instructions.textContent = recipe.strInstructions;
            modal.classList.remove('hidden');
        } else {
            console.error('Recipe not found');
        }
    }

    function getIngredients(recipe) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push(`${measure} ${ingredient}`);
            }
        }
        return ingredients;
    }

    closeModalButton.onclick = function() {
        console.log('Close button clicked');
        modal.classList.add('hidden');
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            console.log('Outside modal clicked');
            modal.classList.add('hidden');
        }
    }
});