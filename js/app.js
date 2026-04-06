// 🚀 Основное приложение

window.App = {
    init() {
        console.log('🚀 Приложение запущено');
        this.setupEventListeners();
        this.loadRecipes();
    },
    
    setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                console.log('🔍 Поиск...');
                this.search();
            });
        }
    },
    
    async loadRecipes() {
        console.log('🔄 Загрузка рецептов...');
        const success = await loadRecipesFromCloud();
        
        if (success) {
            console.log('✅ Рецепты загружены:', window.RECIPES.length);
        } else {
            console.warn('⚠️ Рецепты не загружены');
        }
    },
    
    search() {
        console.log('🔍 Начинаем поиск...');
        
        const ingredientsInput = document.getElementById('ingredientsInput');
        const forWhomFilter = document.getElementById('forWhomFilter');
        const dietTypeFilter = document.getElementById('dietTypeFilter');
        const cuisineFilter = document.getElementById('cuisineFilter');
        const timeFilter = document.getElementById('timeFilter');
        const excludeInput = document.getElementById('excludeInput');
        const resultsDiv = document.getElementById('results');
        
        if (!ingredientsInput || !resultsDiv) {
            console.error('❌ Не найдены элементы');
            return;
        }
        
        const ingredients = ingredientsInput.value;
        
        if (!ingredients || ingredients.trim() === '') {
            resultsDiv.innerHTML = '<div class="empty-message">😕 Введите ингредиенты</div>';
            return;
        }
        
        const filters = {
            forWhom: forWhomFilter ? forWhomFilter.value : 'all',
            dietType: dietTypeFilter ? dietTypeFilter.value : 'all',
            cuisine: cuisineFilter ? cuisineFilter.value : 'all',
            maxTime: timeFilter ? parseInt(timeFilter.value) : 999,
            exclude: excludeInput ? excludeInput.value : ''
        };
        
        console.log('🔍 Ингредиенты:', ingredients);
        console.log('🔍 Фильтры:', filters);
        
        if (!window.RECIPES || window.RECIPES.length === 0) {
            resultsDiv.innerHTML = '<div class="empty-message">⚠️ Рецепты ещё не загрузились</div>';
            return;
        }
        
        const results = Search.find(ingredients, filters);
        
        console.log('✅ Найдено:', results.length);
        
        if (!results || results.length === 0) {
            resultsDiv.innerHTML = '<div class="empty-message">😕 Рецепты не найдены</div>';
            return;
        }
        
        let html = '<h2>🎉 Найдено рецептов: ' + results.length + '</h2>';
        
        for (let i = 0; i < results.length; i++) {
            const recipe = results[i];
            
            html += '<div class="recipe-card">';
            html += '<h3>' + (recipe.name || 'Без названия') + '</h3>';
            
            if (recipe.image && recipe.image.trim() !== '' && recipe.image.includes('http')) {
                html += '<img src="' + recipe.image + '" alt="' + recipe.name + '" style="max-width: 300px; border-radius: 8px; margin: 10px 0;">';
            }
            
            html += '<p><strong>⏱️ Время приготовления:</strong> ' + (recipe.time || 30) + ' мин</p>';
            html += '<p><strong>🌍 Кухня:</strong> ' + (recipe.cuisine || 'универсальная') + '</p>';
            html += '<p><strong>🥗 Ингредиенты:</strong> ' + (recipe.ingredients || []).join(', ') + '</p>';
            
            if (recipe.instructions && recipe.instructions.length > 0) {
                html += '<p><strong>👨‍🍳 Как готовить:</strong> ' + recipe.instructions.join('; ') + '</p>';
            }
            
            // УБРАЛ процент совпадения!
            
            html += '</div>';
        }
        
        resultsDiv.innerHTML = html;
        
        setTimeout(() => {
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен');
    window.App.init();
});

console.log('✅ app.js загружен');
