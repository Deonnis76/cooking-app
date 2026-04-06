// 🎤 Голосовой ввод с кнопкой остановки

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
    recognition.continuous = true; // Продолжительное распознавание
    recognition.interimResults = false;
    
    let isListening = false;
    let finalTranscript = '';
    
    // Клик - старт/стоп
    voiceBtn.addEventListener('click', function() {
        if (isListening) {
            // Остановить
            recognition.stop();
            voiceBtn.textContent = '🎤 Голосовой ввод';
            voiceBtn.style.background = '#4299e1';
            isListening = false;
            console.log('🎤 Остановлено');
        } else {
            // Начать
            finalTranscript = '';
            try {
                recognition.start();
                voiceBtn.textContent = '⏹️ Нажми чтобы остановить';
                voiceBtn.style.background = '#e53e3e';
                isListening = true;
                console.log('🎤 Слушаю...');
            } catch (e) {
                console.error('Ошибка:', e);
                voiceBtn.textContent = '🎤 Голосовой ввод';
            }
        }
    });
    
    recognition.onresult = function(event) {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ', ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        // Показываем что распознано
        if (finalTranscript || interimTranscript) {
            console.log('🎤 Распознано:', finalTranscript + interimTranscript);
        }
    };
    
    recognition.onerror = function(event) {
        console.error('❌ Ошибка:', event.error);
        voiceBtn.textContent = '🎤 Голосовой ввод';
        voiceBtn.style.background = '#4299e1';
        isListening = false;
    };
    
    recognition.onend = function() {
        // Добавляем в поле ввода
        if (finalTranscript) {
            finalTranscript = finalTranscript.slice(0, -2); // Убираем последнюю запятую
            if (input.value) {
                input.value += ', ' + finalTranscript;
            } else {
                input.value = finalTranscript;
            }
            console.log('✅ Добавлено:', finalTranscript);
        }
        
        voiceBtn.textContent = '🎤 Голосовой ввод';
        voiceBtn.style.background = '#4299e1';
        isListening = false;
    };
    
    console.log('✅ Голосовой ввод готов (с кнопкой стоп)');
});

console.log('✅ Модуль voice.js загружен');
