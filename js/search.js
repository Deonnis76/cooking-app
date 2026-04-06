// 🔍 Поиск рецептов (исправленный)

const Search = {
    find(ingredients, filters) {
        // Разбиваем ингредиенты пользователя на слова
        const userIngredients = ingredients
            .toLowerCase()
            .replace(/[.,;]/g, ' ')
            .split(/\s+/)
            .filter(i => i.length >= 2);
        
        // Исключаем предлоги и союзы
        const stopWords = ['и', 'в', 'на', 'с', 'к', 'по', 'для', 'из', 'от', 'до', 'без', 'или'];
        const searchWords = userIngredients.filter(i => !stopWords.includes(i));
        
        console.log('🔍 Ищем ингредиенты:', searchWords);
        
        // Исключить ингредиенты
        const excludeIngredients = (filters.exclude || '')
            .toLowerCase()
            .replace(/[.,;]/g, ' ')
            .split(/\s+/)
            .filter(i => i.length >= 2 && !stopWords.includes(i));
        
        console.log('❌ Исключить:', excludeIngredients);
        
        const results = window.RECIPES.filter(recipe => {
            // Проверка времени
            if (recipe.time > filters.maxTime) return false;
            
            // Проверка категории
            if (filters.forWhom !== 'all' && filters.forWhom !== 'any') {
                const recipeForWhom = (recipe.forWhom || '').toLowerCase();
                if (!recipeForWhom.includes(filters.forWhom) && recipeForWhom !== 'all') {
                    // Не фильтруем строго - пропускаем
                }
            }
            
            // Проверка исключений
            if (excludeIngredients.length > 0) {
                const recipeIngrText = (recipe.ingredients || []).join(' ').toLowerCase();
                const hasExcluded = excludeIngredients.some(exc => 
                    recipeIngrText.includes(exc)
                );
                if (hasExcluded) return false;
            }
            
            // Поиск совпадений по ингредиентам
            const recipeIngrText = (recipe.ingredients || []).join(' ').toLowerCase();
            
            // Считаем сколько ингредиентов пользователя найдено в рецепте
            const matchCount = searchWords.filter(userWord => 
                recipeIngrText.includes(userWord)
            ).length;
            
            // Возвращаем рецепт если найдено хотя бы 1 совпадение
            return matchCount >= 1;
            
        }).map(recipe => {
            const recipeIngrText = (recipe.ingredients || []).join(' ').toLowerCase();
            
            // Найденные ингредиенты
            const has = searchWords.filter(userWord => 
                recipeIngrText.includes(userWord)
            );
            
            // Процент совпадения
            const matchPercent = searchWords.length > 0 
                ? (has.length / searchWords.length) * 100 
                : 0;
            
            return { 
                ...recipe, 
                has: has, 
                matchPercent: matchPercent 
            };
        });
        
        // Сортируем по проценту совпадения
        results.sort((a, b) => b.matchPercent - a.matchPercent);
        
        console.log('✅ Найдено рецептов:', results.length);
        return results;
    }
};

console.log('✅ Поиск готов');
