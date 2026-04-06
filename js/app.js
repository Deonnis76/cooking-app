// 🚀 Основное приложение (глобальный объект)

window.App = {
    init() {
        console.log('🚀 Приложение запущено');
        this.setupEventListeners();
        this.loadRecipes();
    },
    
    setupEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.search());
        }
    },
    
    async loadRecipes() {
        console.log('🔄 Загрузка рецептов...');
        const success = await loadRecipesFromCloud();
        
        if (!success) {
            console.warn('⚠️ Рецепты не загружены');
        }
    },
    
    search() {
        console.log('🔍 Поиск рецептов...');
        
        const ingredientsInput = document.getElementById('ingredientsInput');
        const forWhomFilter = document.getElementById('forWhomFilter');
        const dietTypeFilter = document.getElementById('dietTypeFilter');
        const cuisineFilter = document.getElementById('cuisineFilter');
        const timeFilter = document.getElementById('timeFilter');
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
            exclude: ''
        };
        
        const results = Search.find(ingredients, filters);
        
        if (results.length === 0) {
            resultsDiv.innerHTML = '<p class="empty-message">😕 Рецепты не найдены. Попробуйте добавить больше продуктов или расширить фильтры.</p>';
            return;
        }
        
        let html = `<h2>️ Найдено рецептов: ${results.length}</h2>`;
        
        results.forEach(recipe => {
            html += `
                <div class="recipe-card">
                    <h3>${recipe.name}</h3>
                    <p><strong>⏱️ Время:</strong> ${recipe.time} мин</p>
                    <p><strong> Кухня:</strong> ${recipe.cuisine}</p>
                    <p><strong>🥗 Ингредиенты:</strong> ${recipe.ingredients.join(', ')}</p>
                    <p><strong>‍🍳 Инструкции:</strong> ${recipe.instructions.join('; ')}</p>
                    <p><strong>✅ Совпадение:</strong> ${Math.round(recipe.matchPercent)}%</p>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
    }
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
});

console.log('✅ Модуль app.js загружен');
