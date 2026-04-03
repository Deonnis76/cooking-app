// 🚀 Основное приложение

const app = {
    async init() {
        console.log('✅ Приложение запущено');
        
        // Загружаем рецепты из облака
        const loaded = await loadRecipesFromCloud();
        
        if (!loaded || RECIPES.length === 0) {
            console.warn('⚠️ Рецепты не загружены');
            document.getElementById('results').innerHTML = 
                '<div class="loading">⚠️ Не удалось загрузить рецепты. Проверьте подключение к интернету.</div>';
            return;
        }
        
        console.log('📊 Рецептов в базе:', RECIPES.length);
    },
    
    search() {
        const ingredients = document.getElementById('ingredients').value;
        const exclude = document.getElementById('exclude').value;
        const maxTime = parseInt(document.getElementById('maxTime').value);
        const forWhom = document.getElementById('forWhom').value;
        const dietType = document.getElementById('dietType').value;
        const cuisine = document.getElementById('cuisine').value;
        const resultsDiv = document.getElementById('results');
        
        if (!ingredients.trim()) {
            resultsDiv.innerHTML = '<div class="loading">⚠️ Введите продукты для поиска</div>';
            return;
        }
        
        resultsDiv.innerHTML = '<div class="loading">🔍 Ищем рецепты...</div>';
        
        setTimeout(() => {
            const results = Search.find(ingredients, { maxTime, forWhom, dietType, cuisine, exclude });
            
            if (results.length === 0) {
                resultsDiv.innerHTML = '<div class="loading">😔 Рецепты не найдены. Попробуйте добавить больше продуктов или расширить фильтры.</div>';
                return;
            }
            
            let html = `<div class="stats">🎉 Найдено рецептов: ${results.length}</div>`;
            
            results.forEach(recipe => {
                const status = recipe.missing.length === 0 ? '✅ Всё есть' : `⚠️ Нужно докупить: ${recipe.missing.join(', ')}`;
                const statusClass = recipe.missing.length === 0 ? 'complete' : 'partial';
                
                const placeholder = `image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='280'%3E%3Crect fill='%234caf50' width='800' height='280'/%3E%3Ctext fill='white' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24'%3E${encodeURIComponent(recipe.name)}%3C/text%3E%3C/svg%3E`;
                
                html += `
                    <div class="recipe-card" style="margin-top: 16px;">
                        <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image" onerror="this.src='${placeholder}'">
                        <div class="recipe-content">
                            <h3>${recipe.name}</h3>
                            <p>⏱️ ${recipe.time} мин | 🍽️ ${recipe.cuisine} | 📊 Совпадение: ${Math.round(recipe.matchPercent)}%</p>
                            <p><strong>Ингредиенты:</strong> ${recipe.ingredients.join(', ')}</p>
                            <p class="status ${statusClass}">${status}</p>
                            <p style="font-size: 12px; color: #9e9e9e; margin: 12px 0;">📸 Фото иллюстративное. Ваше блюдо может отличаться в зависимости от подачи и ингредиентов.</p>
                            <details>
                                <summary>📖 Показать инструкцию</summary>
                                <ol>
                                    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                                </ol>
                            </details>
                        </div>
                    </div>
                `;
            });
            
            resultsDiv.innerHTML = html;
        }, 300);
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());