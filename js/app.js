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
                console.log('🔍 Кнопка поиска нажата');
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
            console.error('❌ Не найдены элементы формы');
            return;
        }
        
        const ingredients = ingredientsInput.value;
        
        if (!ingredients.trim()) {
            resultsDiv.innerHTML = '<p class="empty-message">😕 Введите ингредиенты для поиска</p>';
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
        
        const results = Search.find(ingredients, filters);
        
        console.log('✅ Найдено рецептов:', results.length);
        
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p class="empty-message">😕 Рецепты не найдены. Попробуйте добавить больше продуктов или расширить фильтры.</p>';
            return;
        }
        
        let html = '<h2>🎉 Найдено рецептов: ' + results.length + '</h2>';
        
        results.slice(0, 20).forEach(recipe => {
            html += '<div class="recipe-card">';
            html += '<h3>' + recipe.name + '</h3>';
            
            if (recipe.image) {
                html += '<img src="' + recipe.image + '" alt="' + recipe.name + '" style="max-width: 300px; border-radius: 8px;">';
            }
            
            html += '<p><strong>⏱️ Время:</strong> ' + recipe.time + ' мин</p>';
            html += '<p><strong>🌍 Кухня:</strong> ' + recipe.cuisine + '</p>';
            html += '<p><strong>🥗 Ингредиенты:</strong> ' + recipe.ingredients.join(', ') + '</p>';
            
            if (recipe.instructions && recipe.instructions.length > 0) {
                html += '<p><strong>👨‍🍳 Инструкции:</strong> ' + recipe.instructions.join('; ') + '</p>';
            }
            
            html += '<p><strong>✅ Совпадение:</strong> ' + Math.round(recipe.matchPercent) + '%</p>';
            html += '</div>';
        });
        
        resultsDiv.innerHTML = html;
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
});

console.log('✅ Модуль app.js загружен');
