// 🔍 Поиск рецептов

const Search = {
    find(ingredients, filters) {
        console.log('🔍 Поиск...', ingredients);
        console.log('🔍 Фильтры:', filters);
        
        const searchWords = ingredients.toLowerCase()
            .split(/[,\s]+/)
            .filter(w => w.length > 2);
        
        const results = [];
        
        for (const recipe of window.RECIPES) {
            // 1. Проверяем совпадение по ингредиентам
            let recipeText = '';
            if (Array.isArray(recipe.ingredients)) {
                recipeText = recipe.ingredients.join(' ').toLowerCase();
            } else {
                recipeText = String(recipe.ingredients || '').toLowerCase();
            }
            
            let matchCount = 0;
            for (const word of searchWords) {
                if (recipeText.includes(word)) {
                    matchCount++;
                }
            }
            
            if (matchCount === 0) continue;
            
            // 2. Применяем фильтры (МЯГКО - если фильтр не подходит, не отбрасываем)
            
            // Фильтр по времени
            if (filters.maxTime && filters.maxTime < 999) {
                const recipeTime = parseInt(recipe.time) || 999;
                if (recipeTime > filters.maxTime) {
                    continue; // Отбрасываем если время больше
                }
            }
            
            // Фильтр по категории (forWhom) - МЯГКИЙ
            if (filters.forWhom && filters.forWhom !== 'all' && filters.forWhom !== 'any') {
                const recipeForWhom = String(recipe.forWhom || '').toLowerCase();
                if (recipeForWhom && !recipeForWhom.includes(filters.forWhom) && recipeForWhom !== 'all') {
                    // Не отбрасываем, просто уменьшаем процент
                }
            }
            
            // Фильтр по типу питания (dietType) - МЯГКИЙ
            if (filters.dietType && filters.dietType !== 'all' && filters.dietType !== 'any') {
                const recipeDiet = String(recipe.dietType || '').toLowerCase();
                if (recipeDiet && !recipeDiet.includes(filters.dietType)) {
                    // Не отбрасываем
                }
            }
            
            // Фильтр по кухне (cuisine) - МЯГКИЙ
            if (filters.cuisine && filters.cuisine !== 'all' && filters.cuisine !== 'any') {
                const recipeCuisine = String(recipe.cuisine || '').toLowerCase();
                if (recipeCuisine && !recipeCuisine.includes(filters.cuisine)) {
                    // Не отбрасываем
                }
            }
            
            // 3. Исключения
            if (filters.exclude && filters.exclude.trim()) {
                const excludeWords = filters.exclude.toLowerCase()
                    .split(/[,\s]+/)
                    .filter(w => w.length > 2);
                
                let hasExcluded = false;
                for (const exc of excludeWords) {
                    if (recipeText.includes(exc)) {
                        hasExcluded = true;
                        break;
                    }
                }
                
                if (hasExcluded) continue;
            }
            
            // 4. Считаем процент
            const matchPercent = searchWords.length > 0 
                ? (matchCount / searchWords.length) * 100 
                : 0;
            
            results.push({
                ...recipe,
                matchPercent: matchPercent,
                has: searchWords.filter(w => recipeText.includes(w))
            });
        }
        
        // Сортируем
        results.sort((a, b) => b.matchPercent - a.matchPercent);
        
        console.log('✅ Найдено:', results.length);
        return results;
    }
};

console.log('✅ Поиск готов');
