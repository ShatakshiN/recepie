document.addEventListener('DOMContentLoaded', async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const userId = urlParams.get('userId');
    const userName = urlParams.get('name');

    document.getElementById('page-title').textContent = `Contributions by ${userName}`;

    try {
        const response = await axios.get(`http://localhost:4000/user-contributions/${userId}`, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });
        const recipes = response.data.contribution;
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
                <button type='submit'>Add Favourite</button>
                <lable for="rev">Add review</lable>
                <input id='rev'><input>

            `;
            resultsContainer.appendChild(recipeDiv);
        });

        if (recipes.length === 0) {
            resultsContainer.innerHTML = '<p>No recipes found.</p>';
        }
    } catch (error) {
        console.error('Error fetching contributions:', error);
    }
});