class Paint {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.lastX = 0;
        this.lastY = 0;
        this.history = [];
        this.historyIndex = -1;
        this.zoom = 1;
        this.startX = 0;
        this.startY = 0;
        this.textInput = null;
        this.textStartX = 0;
        this.textStartY = 0;
        this.hotkeysModal = document.getElementById('hotkeysModal');
        this.eraserSize = 20;
        this.eraserCursor = document.getElementById('eraserCursor');
        this.templatesPanel = document.getElementById('templatesPanel');
        this.templatesGrid = this.templatesPanel.querySelector('.templates-grid');
        this.templatesButton = document.getElementById('templates');
        this.currentTemplate = null;
        this.currentColor = '#000000';
        this.penSize = 2; // Размер ручки по умолчанию
        this.fontSize = 20;
        this.textSettings = document.getElementById('textSettings');
        this.fontSizeInput = document.getElementById('fontSize');
        this.fontSizeValue = document.getElementById('fontSizeValue');
        this.brushSizeInput = document.getElementById('brushSize');
        this.brushSizeValue = document.getElementById('brushSizeValue');
        this.brushSize = 5;
        this.textInput = document.getElementById('textInput');
        this.textInputField = this.textInput.querySelector('input');
        this.confirmTextButton = this.textInput.querySelector('#confirmText');
        this.textElements = [];
        this.selectedText = null;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        console.log('Templates panel:', this.templatesPanel);
        console.log('Templates button:', this.templatesButton);

        // Инициализация размеров canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Настройка инструментов
        this.setupTools();
        
        // Настройка событий рисования
        this.setupDrawingEvents();

        // Настройка горячих клавиш
        this.setupHotkeys();

        // Настройка модального окна
        this.setupModal();

        // Инициализация заготовок
        this.initTemplates();

        // Инициализация панели заготовок
        const templatesPanel = document.getElementById('templatesPanel');
        const templatesButton = document.getElementById('templates');
        let isTemplatesPanelOpen = false;

        // Убедимся, что панель скрыта при запуске
        if (templatesPanel) {
            templatesPanel.classList.add('hidden');
        }
        if (templatesButton) {
            templatesButton.classList.remove('active');
        }

        // Функция переключения панели заготовок
        function toggleTemplatesPanel() {
            if (!templatesPanel || !templatesButton) return;
            
            isTemplatesPanelOpen = !isTemplatesPanelOpen;
            if (isTemplatesPanelOpen) {
                templatesPanel.classList.remove('hidden');
                templatesButton.classList.add('active');
            } else {
                templatesPanel.classList.add('hidden');
                templatesButton.classList.remove('active');
            }
        }

        // Обработчик для кнопки заготовок
        if (templatesButton) {
            templatesButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleTemplatesPanel();
            });
        }

        // Обработчик клика вне панели заготовок
        document.addEventListener('click', (e) => {
            if (isTemplatesPanelOpen && 
                templatesPanel && 
                !templatesPanel.contains(e.target) && 
                !templatesButton.contains(e.target)) {
                toggleTemplatesPanel();
            }
        });

        // Обработчик для горячих клавиш
        document.addEventListener('keydown', (e) => {
            if (e.key === 'g' || e.key === 'G') {
                e.preventDefault();
                toggleTemplatesPanel();
            }
        });

        // Обработчики событий для кнопок инструментов
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.id;
                if (tool !== 'templates') {
                    this.selectTool(tool);
                    if (isTemplatesPanelOpen) {
                        toggleTemplatesPanel();
                    }
                }
            });
        });

        // Инициализация настроек текста
        this.initTextSettings();

        // Инициализация слайдера размера кисти
        this.initBrushSizeSlider();

        // Инициализация обработчиков для текстового ввода
        this.initTextInputHandlers();
    }

    initTextInputHandlers() {
        // Обработчик для кнопки OK
        this.confirmTextButton.onclick = () => {
            this.addTextToCanvas();
        };

        // Обработчик для клавиши Enter
        this.textInputField.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTextToCanvas();
            } else if (e.key === 'Escape') {
                this.cancelTextInput();
            }
        };
    }

    initTemplates() {
        const templates = {
            people: [
                { 
                    name: 'Портрет',
                    svg: `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
                        <!-- Голова -->
                        <path d="M50,20 C30,20 20,40 20,60 C20,80 30,100 50,100 C70,100 80,80 80,60 C80,40 70,20 50,20 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Волосы -->
                        <path d="M20,40 Q30,30 40,40 M60,40 Q70,30 80,40" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M20,40 Q10,50 20,60" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M80,40 Q90,50 80,60" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Глаза -->
                        <path d="M35,50 C35,45 40,40 45,40 C50,40 55,45 55,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M45,50 C45,45 50,40 55,40 C60,40 65,45 65,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Брови -->
                        <path d="M30,45 Q35,40 40,45" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M60,45 Q65,40 70,45" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Нос -->
                        <path d="M50,55 L50,65" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Рот -->
                        <path d="M40,70 Q50,75 60,70" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Шея -->
                        <path d="M45,100 L45,110 M55,100 L55,110" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Плечи -->
                        <path d="M30,110 L70,110" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                },
                { 
                    name: 'Фигура',
                    svg: `<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
                        <!-- Голова -->
                        <circle cx="50" cy="30" r="20" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Шея -->
                        <path d="M45,50 L45,60 M55,50 L55,60" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Плечи -->
                        <path d="M30,60 L70,60" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Руки -->
                        <path d="M30,60 L20,80" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M70,60 L80,80" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Локти -->
                        <circle cx="20" cy="80" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="80" cy="80" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Предплечья -->
                        <path d="M20,80 L20,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M80,80 L80,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Кисти -->
                        <path d="M20,100 L15,110" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M80,100 L85,110" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Тело -->
                        <path d="M40,60 L40,120" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M60,60 L60,120" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Талия -->
                        <path d="M40,120 L60,120" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Бедра -->
                        <path d="M35,120 L65,120" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Ноги -->
                        <path d="M40,120 L40,160" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M60,120 L60,160" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Колени -->
                        <circle cx="40" cy="160" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="60" cy="160" r="3" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Голени -->
                        <path d="M40,160 L40,180" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M60,160 L60,180" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Стопы -->
                        <path d="M40,180 L35,190" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M60,180 L65,190" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                },
                {
                    name: 'Детский портрет',
                    svg: `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
                        <!-- Голова -->
                        <path d="M50,30 C35,30 25,45 25,60 C25,75 35,90 50,90 C65,90 75,75 75,60 C75,45 65,30 50,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Волосы -->
                        <path d="M25,45 Q35,35 45,45 M55,45 Q65,35 75,45" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M25,45 Q15,55 25,65" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M75,45 Q85,55 75,65" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Глаза -->
                        <circle cx="40" cy="55" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="60" cy="55" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Зрачки -->
                        <circle cx="40" cy="55" r="2" fill="currentColor"/>
                        <circle cx="60" cy="55" r="2" fill="currentColor"/>
                        <!-- Брови -->
                        <path d="M35,50 Q40,45 45,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M55,50 Q60,45 65,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Нос -->
                        <path d="M50,60 L50,65" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Рот -->
                        <path d="M45,70 Q50,75 55,70" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Щеки -->
                        <path d="M35,65 Q30,70 35,75" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M65,65 Q70,70 65,75" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Шея -->
                        <path d="M45,90 L45,100 M55,90 L55,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Плечи -->
                        <path d="M35,100 L65,100" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                }
            ],
            animals: [
                { 
                    name: 'Кошка',
                    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <!-- Голова -->
                        <path d="M50,30 C30,30 20,45 20,60 C20,75 30,90 50,90 C70,90 80,75 80,60 C80,45 70,30 50,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Уши -->
                        <path d="M30,40 L20,20 M70,40 L80,20" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M30,40 L25,30 M70,40 L75,30" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Внутренние уши -->
                        <path d="M30,40 L25,25 M70,40 L75,25" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Глаза -->
                        <path d="M40,50 C40,45 45,40 50,40 C55,40 60,45 60,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M50,50 C50,45 55,40 60,40 C65,40 70,45 70,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Зрачки -->
                        <circle cx="45" cy="50" r="2" fill="none" stroke="currentColor" stroke-width="1"/>
                        <circle cx="65" cy="50" r="2" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Брови -->
                        <path d="M35,45 Q40,40 45,45" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M55,45 Q60,40 65,45" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Нос -->
                        <path d="M50,55 L50,60" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Рот -->
                        <path d="M45,65 Q50,70 55,65" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Усы -->
                        <path d="M45,60 L35,55 M45,60 L35,65" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M55,60 L65,55 M55,60 L65,65" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Шерсть на голове -->
                        <path d="M30,40 Q35,35 40,40" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M60,40 Q65,35 70,40" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Тело -->
                        <path d="M40,90 L40,95" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M60,90 L60,95" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Хвост -->
                        <path d="M50,90 Q60,85 70,90 Q80,95 90,90" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Шерсть на хвосте -->
                        <path d="M60,85 Q65,80 70,85" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M70,90 Q75,85 80,90" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Лапы -->
                        <path d="M35,95 L30,100 M45,95 L40,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M55,95 L50,100 M65,95 L60,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Подушечки лап -->
                        <path d="M30,100 Q32,98 34,100" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M40,100 Q42,98 44,100" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M50,100 Q52,98 54,100" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M60,100 Q62,98 64,100" fill="none" stroke="currentColor" stroke-width="1"/>
                    </svg>`
                },
                {
                    name: 'Собака',
                    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <!-- Голова -->
                        <path d="M50,30 C30,30 20,45 20,60 C20,75 30,90 50,90 C70,90 80,75 80,60 C80,45 70,30 50,30 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Уши -->
                        <path d="M30,40 L20,20 M70,40 L80,20" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M30,40 L25,30 M70,40 L75,30" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Глаза -->
                        <circle cx="40" cy="55" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="60" cy="55" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Зрачки -->
                        <circle cx="40" cy="55" r="2" fill="currentColor"/>
                        <circle cx="60" cy="55" r="2" fill="currentColor"/>
                        <!-- Брови -->
                        <path d="M35,50 Q40,45 45,50" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M55,50 Q60,45 65,50" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Нос -->
                        <path d="M50,60 L50,65" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Рот -->
                        <path d="M45,70 Q50,75 55,70" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Язык -->
                        <path d="M50,70 Q50,80 50,85" fill="none" stroke="currentColor" stroke-width="1"/>
                        <!-- Шея -->
                        <path d="M45,90 L45,100 M55,90 L55,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Плечи -->
                        <path d="M35,100 L65,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Лапы -->
                        <path d="M35,100 L30,110 M45,100 L40,110" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M55,100 L50,110 M65,100 L60,110" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Хвост -->
                        <path d="M50,90 Q60,85 70,90" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                },
                {
                    name: 'Птица',
                    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <!-- Тело -->
                        <path d="M50,50 C40,50 30,60 30,70 C30,80 40,90 50,90 C60,90 70,80 70,70 C70,60 60,50 50,50 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Голова -->
                        <circle cx="50" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Клюв -->
                        <path d="M50,45 L50,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Глаз -->
                        <circle cx="53" cy="38" r="2" fill="currentColor"/>
                        <!-- Крылья -->
                        <path d="M40,60 Q30,50 40,40" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M60,60 Q70,50 60,40" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Хвост -->
                        <path d="M50,90 L50,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M45,95 L55,95" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Лапы -->
                        <path d="M45,90 L45,95" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M55,90 L55,95" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                }
            ],
            objects: [
                { 
                    name: 'Дом',
                    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <!-- Крыша -->
                        <path d="M20,60 L20,30 L50,10 L80,30 L80,60 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Фундамент -->
                        <path d="M20,60 L80,60" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Дверь -->
                        <rect x="35" y="40" width="30" height="20" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Окна -->
                        <path d="M35,40 L35,60 M50,40 L50,60 M65,40 L65,60" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M35,50 L65,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Труба -->
                        <path d="M20,30 L80,30" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Детали -->
                        <path d="M75,35 L75,40" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                },
                {
                    name: 'Машина',
                    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <!-- Кузов -->
                        <path d="M20,60 L20,40 L80,40 L80,60 Z" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Крыша -->
                        <path d="M30,40 L30,30 L70,30 L70,40" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Колеса -->
                        <circle cx="30" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                        <circle cx="70" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Фары -->
                        <path d="M20,45 L25,45" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M75,45 L80,45" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Окна -->
                        <path d="M35,35 L35,40" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M45,35 L45,40" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M55,35 L55,40" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M65,35 L65,40" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                },
                {
                    name: 'Дерево',
                    svg: `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
                        <!-- Ствол -->
                        <path d="M45,50 L45,100" fill="none" stroke="currentColor" stroke-width="4"/>
                        <!-- Крона -->
                        <path d="M45,50 C20,50 20,20 45,20 C70,20 70,50 45,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Ветки -->
                        <path d="M45,60 L30,70" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M45,70 L60,80" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M45,80 L35,90" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M45,90 L55,100" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                }
            ],
            nature: [
                { 
                    name: 'Цветок',
                    svg: `<svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
                        <!-- Стебель -->
                        <path d="M50,50 L50,100" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Листья -->
                        <path d="M50,60 Q40,55 35,60" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M50,80 Q60,75 65,80" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Лепестки -->
                        <path d="M50,50 C40,50 35,40 40,30 C45,20 55,20 60,30 C65,40 60,50 50,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M50,50 C50,40 60,35 70,40 C80,45 80,55 70,60 C60,65 50,60 50,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M50,50 C60,50 65,40 60,30 C55,20 45,20 40,30 C35,40 40,50 50,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M50,50 C50,60 40,65 30,60 C20,55 20,45 30,40 C40,35 50,40 50,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Центр цветка -->
                        <circle cx="50" cy="50" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                },
                {
                    name: 'Солнце',
                    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <!-- Центр -->
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Лучи -->
                        <path d="M50,20 L50,10" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M50,80 L50,90" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M20,50 L10,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M80,50 L90,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M30,30 L20,20" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M70,70 L80,80" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M30,70 L20,80" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M70,30 L80,20" fill="none" stroke="currentColor" stroke-width="2"/>
                    </svg>`
                },
                {
                    name: 'Облако',
                    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <!-- Основная форма -->
                        <path d="M20,50 C20,40 30,30 40,30 C50,30 60,40 60,50 C70,50 80,60 80,70 C80,80 70,90 60,90 L20,90 C10,90 10,80 10,70 C10,60 20,50 20,50" fill="none" stroke="currentColor" stroke-width="2"/>
                        <!-- Детали -->
                        <path d="M30,40 Q35,35 40,40" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M50,40 Q55,35 60,40" fill="none" stroke="currentColor" stroke-width="1"/>
                        <path d="M40,50 Q45,45 50,50" fill="none" stroke="currentColor" stroke-width="1"/>
                    </svg>`
                }
            ]
        };

        // Получаем элементы из DOM
        const categories = this.templatesPanel.querySelectorAll('.category-btn');

        // Функция для отображения шаблонов выбранной категории
        const showCategory = (cat) => {
            this.templatesGrid.innerHTML = '';
            templates[cat].forEach(template => {
                const templateDiv = document.createElement('div');
                templateDiv.className = 'template-item';
                templateDiv.innerHTML = `
                    <div class="template-preview">${template.svg}</div>
                    <span>${template.name}</span>
                `;
                templateDiv.addEventListener('click', () => {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = this.canvas.width;
                    tempCanvas.height = this.canvas.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    const img = new Image();
                    const svgBlob = new Blob([template.svg], {type: 'image/svg+xml'});
                    const url = URL.createObjectURL(svgBlob);
                    img.onload = () => {
                        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
                        const scale = Math.min(
                            this.canvas.width / img.width,
                            this.canvas.height / img.height
                        ) * 0.4;
                        const x = (this.canvas.width - img.width * scale) / 2;
                        const y = (this.canvas.height - img.height * scale) / 2;
                        tempCtx.drawImage(
                            img,
                            x, y,
                            img.width * scale,
                            img.height * scale
                        );
                        this.ctx.drawImage(tempCanvas, 0, 0);
                        URL.revokeObjectURL(url);
                    };
                    img.src = url;
                });
                this.templatesGrid.appendChild(templateDiv);
            });
        };

        // Навешиваем обработчики на кнопки категорий
        categories.forEach(btn => {
            btn.addEventListener('click', () => {
                categories.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showCategory(btn.dataset.category);
            });
        });

        // Показываем первую категорию по умолчанию
        showCategory('people');
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Устанавливаем размеры canvas
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Настраиваем контекст
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }

    toggleTemplatesPanel() {
        console.log('Toggling templates panel');
        if (this.templatesPanel) {
            this.templatesPanel.classList.toggle('hidden');
            if (this.templatesButton) {
                if (!this.templatesPanel.classList.contains('hidden')) {
                    this.templatesButton.classList.add('active');
                } else {
                    this.templatesButton.classList.remove('active');
                }
            }
        }
    }

    setupTools() {
        const tools = document.querySelectorAll('.tools button');
        tools.forEach(tool => {
            tool.addEventListener('click', () => {
                tools.forEach(t => t.classList.remove('active'));
                tool.classList.add('active');
                this.currentTool = tool.id;

                // Показываем/скрываем курсор ластика
                if (this.currentTool === 'eraser') {
                    this.eraserCursor.style.display = 'block';
                    this.updateEraserCursor();
                } else {
                    this.eraserCursor.style.display = 'none';
                }

                // Показываем/скрываем панель шаблонов
                if (this.currentTool === 'templates') {
                    this.templatesPanel.classList.remove('hidden');
                } else {
                    this.templatesPanel.classList.add('hidden');
                }
            });
        });

        // Настройка действий
        document.getElementById('undo').addEventListener('click', () => this.undo());
        document.getElementById('redo').addEventListener('click', () => this.redo());
        document.getElementById('clear').addEventListener('click', () => this.clear());
        document.getElementById('save').addEventListener('click', () => this.save());
        document.getElementById('load').addEventListener('click', () => this.load());
    }

    setupDrawingEvents() {
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.currentTool === 'text') {
                const { x, y } = this.getEventCoordinates(e);
                this.startTextInput(x, y);
                return;
            }
            this.startDrawing(e);
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.currentTool === 'eraser') {
                this.updateEraserCursor(e);
            }
            if (this.isDrawing) {
                this.draw(e);
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.stopDrawing();
        });

        this.canvas.addEventListener('mouseout', () => {
            this.isDragging = false;
            this.stopDrawing();
        });

        // События сенсорного экрана
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });

        // Обновление позиции курсора ластика
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.currentTool === 'eraser') {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.eraserCursor.style.left = `${x}px`;
                this.eraserCursor.style.top = `${y}px`;
            }
        });

        // Скрытие курсора при выходе за пределы холста
        this.canvas.addEventListener('mouseout', () => {
            if (this.currentTool === 'eraser') {
                this.eraserCursor.style.display = 'none';
            }
        });

        this.canvas.addEventListener('mouseenter', () => {
            if (this.currentTool === 'eraser') {
                this.eraserCursor.style.display = 'block';
            }
        });
    }

    updateEraserCursor(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.eraserCursor.style.left = `${x}px`;
        this.eraserCursor.style.top = `${y}px`;
    }

    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getEventCoordinates(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
        this.startX = coords.x;
        this.startY = coords.y;

        if (this.currentTool === 'text') {
            this.textInput.classList.remove('hidden');
            this.textInput.style.left = `${this.lastX}px`;
            this.textInput.style.top = `${this.lastY}px`;
            this.textInputInput.focus();
        }
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.beginPath();
        
        if (this.currentTool === 'pen') {
            // Плавное рисование для ручки
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        } else {
            // Обычное рисование для других инструментов
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }

        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
        }
    }

    getEventCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    setupHotkeys() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'b' || e.key === 'B') {
                e.preventDefault();
                this.selectTool('brush');
            } else if (e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                this.selectTool('eraser');
            } else if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                this.selectTool('text');
            } else if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                this.selectTool('pen');
            } else if (e.key === 'g' || e.key === 'G') {
                e.preventDefault();
                toggleTemplatesPanel();
            } else if (e.key === 'c' || e.key === 'C') {
                e.preventDefault();
                this.clearCanvas();
            } else if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                this.saveCanvas();
            }
        });
    }

    selectTool(tool) {
        this.currentTool = tool;
        
        // Сбрасываем выбранный текст при смене инструмента
        if (tool !== 'text') {
            this.selectedText = null;
            this.redrawCanvas();
        }

        // Обновляем активную кнопку
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.id === tool);
        });

        // Настраиваем курсор
        if (tool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.canvas.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewport=\'0 0 100 100\' style=\'fill:black;font-size:24px;\'><text y=\'20\'>🧹</text></svg>") 0 24, auto';
            this.ctx.lineWidth = this.brushSize;
            if (this.textSettings) {
                this.textSettings.classList.add('hidden');
            }
        } else {
            this.ctx.globalCompositeOperation = 'source-over';
            this.canvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
            this.ctx.lineWidth = this.brushSize;
            if (this.textSettings) {
                this.textSettings.classList.toggle('hidden', tool !== 'text');
            }
        }
    }

    changeBrushSize(delta) {
        const brushSize = document.getElementById('brushSize');
        const sizeValue = document.getElementById('sizeValue');
        const currentSize = parseInt(brushSize.value);
        const newSize = Math.max(1, Math.min(50, currentSize + delta));
        brushSize.value = newSize;
        sizeValue.textContent = `${newSize}px`;
        this.ctx.lineWidth = newSize;
        this.eraserSize = newSize;
    }

    setupModal() {
        // Кнопка открытия модального окна
        document.getElementById('hotkeys').addEventListener('click', () => {
            this.hotkeysModal.classList.remove('hidden');
        });

        // Кнопка закрытия модального окна
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.hotkeysModal.classList.add('hidden');
        });

        // Закрытие по клику вне модального окна
        this.hotkeysModal.addEventListener('click', (e) => {
            if (e.target === this.hotkeysModal) {
                this.hotkeysModal.classList.add('hidden');
            }
        });

        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.hotkeysModal.classList.contains('hidden')) {
                this.hotkeysModal.classList.add('hidden');
            }
        });
    }

    undo() {
        // Реализация отмены действия
    }

    redo() {
        // Реализация повтора действия
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    save() {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }

    load() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    handleMouseDown(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;

        if (this.currentTool === 'text') {
            this.startTextInput(this.lastX, this.lastY);
        }
    }

    startTextInput(x, y) {
        // Сохраняем координаты начала ввода текста
        this.textStartX = x;
        this.textStartY = y;
        
        // Позиционируем поле ввода текста
        this.textInput.style.left = `${x}px`;
        this.textInput.style.top = `${y}px`;
        
        // Показываем поле ввода
        this.textInput.classList.remove('hidden');
        
        // Устанавливаем размер шрифта
        this.textInputField.style.fontSize = `${this.fontSize}px`;
        
        // Очищаем поле ввода
        this.textInputField.value = '';
        
        // Фокусируемся на поле ввода
        this.textInputField.focus();
    }

    addTextToCanvas() {
        const text = this.textInputField.value.trim();
        if (!text) {
            this.cancelTextInput();
            return;
        }

        // Сохраняем текущее состояние холста
        this.saveState();

        // Настраиваем контекст для текста
        this.ctx.font = `${this.fontSize}px Arial`;
        this.ctx.fillStyle = this.currentColor;
        this.ctx.textBaseline = 'top';

        // Рисуем текст
        this.ctx.fillText(text, this.textStartX, this.textStartY);

        // Очищаем поле ввода и скрываем его
        this.textInputField.value = '';
        this.textInput.classList.add('hidden');
    }

    cancelTextInput() {
        this.textInputField.value = '';
        this.textInput.classList.add('hidden');
    }

    initTextSettings() {
        if (!this.fontSizeInput || !this.fontSizeValue) return;

        // Устанавливаем начальное значение
        this.fontSizeInput.value = this.fontSize;
        this.updateFontSizeDisplay();

        // Добавляем обработчик изменения размера шрифта
        this.fontSizeInput.addEventListener('input', () => {
            this.fontSize = parseInt(this.fontSizeInput.value);
            this.updateFontSizeDisplay();
            
            // Обновляем размер шрифта в поле ввода, если оно активно
            if (this.textInputField && !this.textInput.classList.contains('hidden')) {
                this.textInputField.style.fontSize = `${this.fontSize}px`;
            }
        });
    }

    updateFontSizeDisplay() {
        if (this.fontSizeValue) {
            this.fontSizeValue.textContent = `${this.fontSize}px`;
        }
    }

    initBrushSizeSlider() {
        if (this.brushSizeInput && this.brushSizeValue) {
            // Устанавливаем начальное значение
            this.brushSizeInput.value = this.brushSize;
            this.updateBrushSizeDisplay();

            // Обработчик изменения размера кисти
            this.brushSizeInput.addEventListener('input', (e) => {
                const newSize = parseInt(e.target.value);
                if (!isNaN(newSize) && newSize >= 1 && newSize <= 50) {
                    this.brushSize = newSize;
                    this.updateBrushSizeDisplay();
                    this.ctx.lineWidth = this.brushSize;
                }
            });
        }
    }

    updateBrushSizeDisplay() {
        if (this.brushSizeValue) {
            this.brushSizeValue.textContent = `${this.brushSize}px`;
        }
    }

    redrawCanvas() {
        // Очищаем холст
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Восстанавливаем последнее состояние
        if (this.history.length > 0) {
            const lastState = this.history[this.historyIndex];
            if (lastState) {
                this.ctx.putImageData(lastState, 0, 0);
            }
        }

        // Рисуем все текстовые элементы
        this.textElements.forEach(element => {
            this.ctx.font = `${element.fontSize}px Arial`;
            this.ctx.fillStyle = element.color;
            this.ctx.textBaseline = 'top';
            this.ctx.fillText(element.text, element.x, element.y);

            // Если это выбранный элемент, рисуем рамку
            if (element === this.selectedText) {
                const metrics = this.ctx.measureText(element.text);
                this.ctx.strokeStyle = '#4CAF50';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(
                    element.x - 2,
                    element.y - 2,
                    metrics.width + 4,
                    element.fontSize + 4
                );
            }
        });
    }

    findTextAtPosition(x, y) {
        // Проверяем каждый текстовый элемент
        for (let i = this.textElements.length - 1; i >= 0; i--) {
            const element = this.textElements[i];
            this.ctx.font = `${element.fontSize}px Arial`;
            const metrics = this.ctx.measureText(element.text);
            
            // Проверяем, находится ли точка в пределах текста
            if (x >= element.x && 
                x <= element.x + metrics.width &&
                y >= element.y && 
                y <= element.y + element.fontSize) {
                return element;
            }
        }
        return null;
    }
}

// Инициализация приложения
window.addEventListener('load', () => {
    new Paint();
}); 