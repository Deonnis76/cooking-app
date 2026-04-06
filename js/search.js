// 🔍 Поиск рецептов

const Search = {
    find(ingredients, filters) {
        console.log('🔍 Поиск по ингредиентам:', ingredients);
        
        // Разбиваем на слова
        const searchWords = ingredients.toLowerCase()
            .split(/[,\s]+/)
            .filter(w => w.length > 2);
        
        console.log('🔍 Ищем слова:', searchWords);
        
        const results = [];
        
        // Проходим по ВСЕМ рецептам
        for (let i = 0; i < window.RECIPES.length; i++) {
            const recipe = window.RECIPES[i];
            
            // Получаем все ингредиенты рецепта как один текст
            let recipeText = '';
            if (recipe.ingredients) {
                if (Array.isArray(recipe.ingredients)) {
                    recipeText = recipe.ingredients.join(' ').toLowerCase();
                } else {
                    recipeText = recipe.ingredients.toLowerCase();
                }
            }
            
            // Считаем совпадения
            let matchCount = 0;
            for (const word of searchWords) {
                if (recipeText.includes(word)) {
                    matchCount++;
                }
            }
            
            // Если хоть одно совпадение - добавляем
            if (matchCount > 0) {
                const matchPercent = (matchCount / searchWords.length) * 100;
                results.push({
                    ...recipe,
                    matchPercent: matchPercent,
                    has: searchWords.filter(w => recipeText.includes(w))
                });
            }
        }
        
        // Сортируем по проценту
        results.sort((a, b) => b.matchPercent - a.matchPercent);
        
        console.log('✅ Найдено рецептов:', results.length);
        return results;
    }
};

console.log('✅ Поиск готов');
