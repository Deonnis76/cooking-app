// 🎤 Голосовой ввод с умной фильтрацией

document.addEventListener('DOMContentLoaded', function() {
    const voiceBtn = document.getElementById('voiceBtn');
    const input = document.getElementById('ingredientsInput');
    
    if (!voiceBtn || !input) {
        console.log('⚠️ Элементы не найдены');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        voiceBtn.disabled = true;
        voiceBtn.textContent = '🎤 Не поддерживается';
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = true; // Продолжительное
    recognition.interimResults = false;
    
    let isListening = false;
    let allTranscript = '';
    
    // Слова-паразиты которые нужно убрать
    const stopWords = [
        'ну', 'вот', 'там', 'как', 'бы', 'типа', 'это', 'тоесть', 
        'то', 'есть', 'короче', 'значит', 'так', 'да', 'нет',
        'эм', 'ээ', 'а', 'и', 'в', 'на', 'с', 'к', 'по', 'для',
        'из', 'от', 'до', 'без', 'или', 'же', 'ли', 'бы', 'мне',
        'надо', 'нужно', 'хочу', 'есть', 'у', 'меня', 'мое', 'мой'
    ];
    
    voiceBtn.addEventListener('click', function() {
        if (isListening) {
            // СТОП
            recognition.stop();
            voiceBtn.textContent = '🎤 Голосовой ввод';
            voiceBtn.style.background = '#4299e1';
            isListening = false;
            console.log('🎤 Остановлено');
        } else {
            // СТАРТ
            allTranscript = '';
            try {
                recognition.start();
                voiceBtn.textContent = '⏹️ СТОП';
                voiceBtn.style.background = '#e53e3e';
                isListening = true;
                console.log('🎤 Говорите... (нажмите СТОП когда закончите)');
            } catch (e) {
                console.error('Ошибка:', e);
                voiceBtn.textContent = '🎤 Голосовой ввод';
            }
        }
    });
    
    recognition.onresult = function(event) {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            allTranscript += transcript + ' ';
            console.log('🎤 Слышу:', transcript);
        }
    };
    
    recognition.onerror = function(event) {
        console.error('❌ Ошибка:', event.error);
        voiceBtn.textContent = '🎤 Голосовой ввод';
        voiceBtn.style.background = '#4299e1';
        isListening = false;
    };
    
    recognition.onend = function() {
        console.log('🎤 Запись завершена');
        console.log('📝 Весь текст:', allTranscript);
        
        // Фильтруем слова
        const words = allTranscript.toLowerCase()
            .replace(/[.,!?;:]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 2)
            .filter(w => !stopWords.includes(w));
        
        console.log('✅ Отфильтровано:', words);
        
        // Добавляем в поле ввода
        if (words.length > 0) {
            const filteredText = words.join(', ');
            if (input.value) {
                input.value += ', ' + filteredText;
            } else {
                input.value = filteredText;
            }
            console.log('✅ Добавлено:', filteredText);
        }
        
        voiceBtn.textContent = '🎤 Голосовой ввод';
        voiceBtn.style.background = '#4299e1';
        isListening = false;
    };
    
    console.log('✅ Голосовой ввод готов (с фильтрацией)');
});

console.log('✅ voice.js загружен');
