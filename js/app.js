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
        
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                console.log('🎤 Голосовой ввод');
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
        
        if (!ingredientsInput) {
            console.error('❌ Не найдено поле ingredientsInput');
            return;
        }
        
        if (!resultsDiv) {
            console.error('❌ Не найден блок results');
            return;
        }
        
        const ingredients = ingredientsInput.value;
        
        if (!ingredients || ingredients.trim() === '') {
            resultsDiv.innerHTML = '<div class="empty-message">😕 Введите ингредиенты для поиска</div>';
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
        console.log('🔍 Всего рецептов в базе:', window.RECIPES.length);
        
        if (!window.RECIPES || window.RECIPES.length === 0) {
            resultsDiv.innerHTML = '<div class="empty-message">⚠️ Рецепты ещё не загрузились. Подождите несколько секунд и попробуйте снова.</div>';
            return;
        }
        
        const results = Search.find(ingredients, filters);
        
        console.log('✅ Найдено рецептов:', results.length);
        
        if (!results || results.length === 0) {
            resultsDiv.innerHTML = '<div class="empty-message">😕 Рецепты не найдены. Попробуйте добавить больше продуктов или расширить фильтры.</div>';
            return;
        }
        
        let html = '<h2>🎉 Найдено рецептов: ' + results.length + '</h2>';
        
        const displayCount = Math.min(results.length, 20);
        
        for (let i = 0; i < displayCount; i++) {
            const recipe = results[i];
            
            html += '<div class="recipe-card">';
            html += '<h3>' + (recipe.name || 'Без названия') + '</h3>';
            
            if (recipe.image && recipe.image !== '') {
                html += '<img src="' + recipe.image + '" alt="' + recipe.name + '">';
            }
            
            html += '<p><strong>⏱️ Время приготовления:</strong> ' + (recipe.time || 30) + ' мин</p>';
            html += '<p><strong>🌍 Кухня:</strong> ' + (recipe.cuisine || 'universal') + '</p>';
            
            if (recipe.ingredients && recipe.ingredients.length > 0) {
                html += '<p><strong>🥗 Ингредиенты:</strong> ' + recipe.ingredients.join(', ') + '</p>';
            }
            
            if (recipe.instructions && recipe.instructions.length > 0) {
                html += '<p><strong>👨‍ Как готовить:</strong> ' + recipe.instructions.join('; ') + '</p>';
            }
            
            if (recipe.matchPercent !== undefined) {
                html += '<p><strong>✅ Совпадение:</strong> ' + Math.round(recipe.matchPercent) + '%</p>';
            }
            
            html += '</div>';
        }
        
        if (results.length > 20) {
            html += '<p style="text-align: center; color: #718096; font-size: 18px; margin-top: 20px;">Показано первых 20 рецептов из ' + results.length + '</p>';
        }
        
        resultsDiv.innerHTML = html;
        
        setTimeout(() => {
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
};

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен, запускаем приложение...');
    window.App.init();
});

console.log('✅ Модуль app.js загружен');
