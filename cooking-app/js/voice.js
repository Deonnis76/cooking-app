// 🎤 Голосовой ввод (улучшенный)

const VoiceInput = {
    recognition: null,
    isRecording: false,
    
    init(buttonId, inputId) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        
        if (!('webkitSpeechRecognition' in window)) {
            btn.style.display = 'none';
            console.warn('⚠️ Голосовой ввод не поддерживается в этом браузере');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'ru-RU';
        this.recognition.continuous = true;  // Продолжительный режим
        this.recognition.interimResults = false;
        this.inputId = inputId;
        
        let finalTranscript = '';
        
        btn.onclick = () => this.toggle();
        
        this.recognition.onstart = () => {
            console.log('🎤 Запись началась...');
        };
        
        this.recognition.onresult = (e) => {
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const transcript = e.results[i][0].transcript;
                if (e.results[i].isFinal) {
                    finalTranscript += (finalTranscript ? ', ' : '') + transcript;
                }
            }
            const input = document.getElementById(this.inputId);
            input.value = finalTranscript;
        };
        
        this.recognition.onerror = (e) => {
            console.warn('⚠️ Ошибка голосового ввода:', e.error);
        };
        
        this.recognition.onend = () => {
            if (this.isRecording) {
                // Перезапуск если всё ещё записываем
                try {
                    this.recognition.start();
                } catch(err) {
                    this.stopVisual();
                }
            } else {
                this.stopVisual();
            }
        };
    },
    
    toggle() {
        if (this.isRecording) {
            this.isRecording = false;
            this.recognition.stop();
            this.stopVisual();
        } else {
            const input = document.getElementById(this.inputId);
            if (input) input.value = '';  // Очищаем поле перед записью
            this.isRecording = true;
            this.startVisual();
            try {
                this.recognition.start();
            } catch(err) {
                console.error('❌ Ошибка запуска:', err);
            }
        }
    },
    
    startVisual() {
        const btn = document.getElementById('voiceBtn');
        if (btn) {
            btn.classList.add('recording');
            btn.innerHTML = '⏹ Нажмите для остановки';
        }
    },
    
    stopVisual() {
        const btn = document.getElementById('voiceBtn');
        if (btn) {
            btn.classList.remove('recording');
            btn.innerHTML = '🎤 Голосовой ввод';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => VoiceInput.init('voiceBtn', 'ingredients'));