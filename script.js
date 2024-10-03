document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('recipeForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const form = document.getElementById('recipeForm');
        const title = form.elements.title.value;
        const image = form.elements.image.files[0]; // Get the file input
        const dietaryPreferences = form.elements.dietaryPreferences.value;
        const difficultyLevel = form.elements.difficultyLevel.value;
        const cookingTime = form.elements.cookingTime.value;
        const recipeId = form.elements.recipeId?.value; // Get the recipeId if available for editing

        const formData = new FormData();
        formData.append('title', title);
        if (image) formData.append('image', image); // Only append image if there's a new one
        formData.append('dietaryPreferences', dietaryPreferences);
        formData.append('difficultyLevel', difficultyLevel);
        formData.append('cookingTime', cookingTime);

        try {
            let response;
            if (recipeId) {
                // If a recipeId exists, update the recipe
                response = await axios.put(`http://localhost:4000/recipes/${recipeId}`, formData);
                document.getElementById('message').innerText = 'Recipe updated successfully!';
            } else {
                // Otherwise, create a new recipe
                response = await axios.post('http://localhost:4000/recipes', formData);
                document.getElementById('message').innerText = 'Recipe uploaded successfully!';
            }

            // Clear the form
            event.target.reset();
            

            // Refresh the recipe list
            fetchRecipes();
            
        } catch (error) {
            document.getElementById('message').innerText = recipeId ? 'Failed to update recipe!' : 'Failed to upload recipe!';
            console.error('Error:', error);
        }
    });
    // Add event listener for the search form
    document.getElementById('searchForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        const title = document.getElementById('titles').value;
        const dietaryPreferences = document.getElementById('dietaryPref').value;
        const difficultyLevel = document.getElementById('difficultyLev').value;

        try {
            const response = await axios.get('http://localhost:4000/search-recipe', {
                params: {
                    title,
                    dietaryPreferences,
                    difficultyLevel
                }
            });

            const recipes = response.data;
            const resultsContainer = document.getElementById('recipe-list'); // Make sure this matches your HTML
            resultsContainer.innerHTML = ''; // Clear previous results

            recipes.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.innerHTML = `
                    <h3>${recipe.title}</h3>
                    <img src="${recipe.imageUrl}" alt="${recipe.title}" />
                    <p>Dietary Preferences: ${recipe.dietaryPreferences}</p>
                    <p>Difficulty Level: ${recipe.difficultyLevel}</p>
                    <p>Cooking Time: ${recipe.cookingTime}</p>
                `;
                resultsContainer.appendChild(recipeDiv);
            });

            if (recipes.length === 0) {
                resultsContainer.innerHTML = '<p>No recipes found.</p>';
            }
        } catch (error) {
            console.error('Error searching for recipes:', error);
        }
    });


    // Initial fetch of recipes on page load
    fetchRecipes();
});

// Make the editRecipe function globally accessible
const editRecipe = async (recipeId) => {
    try {
        const response = await axios.get(`http://localhost:4000/recipes/${recipeId}`);
        const recipe = response.data;

        const form = document.getElementById('recipeForm');
        form.elements.title.value = recipe.title;
        form.elements.dietaryPreferences.value = recipe.dietaryPreferences;
        form.elements.difficultyLevel.value = recipe.difficultyLevel;
        form.elements.cookingTime.value = recipe.cookingTime;

        // Add a hidden field for recipeId if it doesn't exist
        if (!form.elements.recipeId) {
            const recipeIdField = document.createElement('input');
            recipeIdField.type = 'hidden';
            recipeIdField.name = 'recipeId';
            recipeIdField.value = recipe.id;
            form.appendChild(recipeIdField);
        } else {
            form.elements.recipeId.value = recipe.id;
        }

        document.getElementById('message').innerText = 'Editing recipe...';
    } catch (error) {
        console.error('Error fetching recipe for edit:', error);
    }
};

// Make the deleteRecipe function globally accessible
const deleteRecipe = async (recipeId) => {
    try {
        await axios.delete(`http://localhost:4000/recipes/${recipeId}`);
        document.getElementById('message').innerText = 'Recipe deleted successfully!';
        fetchRecipes();
    } catch (error) {
        document.getElementById('message').innerText = 'Failed to delete recipe!';
        console.error('Error deleting recipe:', error);
    }
};

const fetchRecipes = async () => {
    try {
        const response = await axios.get('http://localhost:4000/recipes');
        const recipes = response.data;

        const recipesContainer = document.getElementById('recipes');
        recipesContainer.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <h3>${recipe.title}</h3>
                <img src="${recipe.imageUrl}" alt="${recipe.title}" />
                <p>Dietary Preferences: ${recipe.dietaryPreferences}</p>
                <p>Difficulty Level: ${recipe.difficultyLevel}</p>
                <p>Cooking Time: ${recipe.cookingTime}</p>
                <button onclick="deleteRecipe(${recipe.id})">Delete</button>
                <button onclick="editRecipe(${recipe.id})">Edit</button>
            `;
            recipesContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
};

