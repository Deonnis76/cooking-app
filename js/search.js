// 🔍 Поиск рецептов

const Search = {
    find(ingredients, filters) {
        const userIngredients = ingredients
            .toLowerCase()
            .replace(/[.,;]/g, ' ')
            .split(/\s+/)
            .filter(i => i.length >= 2 && !['и', 'в', 'на', 'с', 'к', 'по'].includes(i));
        
        const excludeIngredients = (filters.exclude || '')
            .toLowerCase()
            .replace(/[.,;]/g, ' ')
            .split(/\s+/)
            .filter(i => i.length >= 2);
        
        console.log('🔍 Ищем:', userIngredients);
        console.log('❌ Исключить:', excludeIngredients);
        
        const results = window.RECIPES.filter(recipe => {
            if (recipe.time > filters.maxTime) return false;
            if (filters.cuisine !== 'all' && recipe.cuisine !== filters.cuisine) return false;
            if (filters.dietType !== 'all' && recipe.dietType !== filters.dietType) return false;
            if (filters.forWhom !== 'all' && !recipe.forWhom.includes(filters.forWhom)) return false;
            
            if (excludeIngredients.length > 0) {
                const hasExcluded = recipe.ingredients.some(ing => 
                    excludeIngredients.some(exc => ing.toLowerCase().includes(exc))
                );
                if (hasExcluded) return false;
            }
            
            const recipeIngr = recipe.ingredients.map(i => i.toLowerCase());
            
            const matchCount = userIngredients.filter(user => 
                recipeIngr.some(ing => ing.includes(user) || user.includes(ing))
            ).length;
            
            return matchCount > 0;
        }).map(recipe => {
            const recipeIngr = recipe.ingredients.map(i => i.toLowerCase());
            
            const has = recipe.ingredients.filter(ing => 
                userIngredients.some(user => 
                    ing.includes(user) || user.includes(ing)
                )
            );
            
            const missing = recipe.ingredients.filter(ing => 
                !userIngredients.some(user => 
                    ing.includes(user) || user.includes(ing)
                )
            );
            
            const matchPercent = recipe.ingredients.length > 0 
                ? (has.length / recipe.ingredients.length) * 100 
                : 0;
            
            return { ...recipe, has, missing, matchPercent };
        });
        
        results.sort((a, b) => b.matchPercent - a.matchPercent);
        console.log('✅ Найдено:', results.length);
        return results;
    }
};

console.log('✅ Поиск готов');
