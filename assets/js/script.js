document.addEventListener('DOMContentLoaded', () => {
    // 1. Управление модальными окнами
    const modals = document.querySelectorAll('.modal-overlay');
    const openButtons = document.querySelectorAll('.open-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Открытие модалки
    openButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Запрет прокрутки сайта
                
                // Предзаполнение типа уборки, если передано в кнопке
                const serviceType = btn.getAttribute('data-service');
                if (serviceType) {
                    const select = targetModal.querySelector('select[name="serviceType"]');
                    if(select) select.value = serviceType;
                }
            }
        });
    });

    // Закрытие модалки
    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Очистка статусов формы при закрытии
        const statusEl = modal.querySelector('.form-status');
        if(statusEl) {
            statusEl.className = 'form-status';
            statusEl.textContent = '';
            statusEl.style.display = 'none';
        }
    };

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if(modal) closeModal(modal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // 2. Маска для телефона (простая реализация)
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : (x[1] === '7' || x[1] === '8' ? '+7' : '+7') + ' (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    });

    // 3. Отправка формы через AJAX
    const forms = document.querySelectorAll('.ajax-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            const statusEl = form.querySelector('.form-status');
            const formData = new FormData(form);

            // Простая валидация (дополнительно к HTML required)
            const phone = formData.get('phone');
            if (phone.length < 18) { // Строгая проверка маски
                if(statusEl) {
                    statusEl.textContent = 'Пожалуйста, введите корректный номер телефона';
                    statusEl.className = 'form-status error';
                    statusEl.style.display = 'block';
                }
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            if(statusEl) statusEl.style.display = 'none';

            try {
                // Имитация отправки для локальной работы (дипломная демонстрация без PHP-сервера)
                // Это предотвратит ошибку "Failed to fetch" при открытии через file://
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const result = { success: true };
                
                if (result.success) {
                    if(statusEl) {
                        statusEl.textContent = 'Спасибо! Заявка успешно отправлена. Мы свяжемся с вами в течение 5 минут.';
                        statusEl.className = 'form-status success';
                        statusEl.style.display = 'block';
                    }
                    form.reset();
                    
                    // Восстанавливаем значение +7 в полях телефона после reset
                    const phoneFields = form.querySelectorAll('input[type="tel"]');
                    phoneFields.forEach(f => f.value = '+7 ');
                    
                    // Закрываем окно через 3 секунды
                    setTimeout(() => {
                        const modal = form.closest('.modal-overlay');
                        if(modal) closeModal(modal);
                    }, 3000);
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                if(statusEl) {
                    statusEl.textContent = 'Произошла ошибка: ' + error.message;
                    statusEl.className = 'form-status error';
                    statusEl.style.display = 'block';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    });

    // 4. Мобильное меню
    const burgerBtn = document.querySelector('.burger-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMobileBtn = document.querySelector('.close-mobile-menu');

    if (burgerBtn && mobileOverlay) {
        burgerBtn.addEventListener('click', () => {
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeMobileBtn.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Закрытие при клике на ссылки внутри
        const mobileLinks = mobileOverlay.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 5. Scroll-анимации (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        fadeElements.forEach(el => observer.observe(el));
    }

    // 6. Кнопка "Наверх"
    const scrollTopBtn = document.querySelector('.scroll-top');
    const scrollToTop = () => {
        const scrollTarget = document.scrollingElement || document.documentElement || document.body;

        try {
            scrollTarget.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        } catch (error) {
            scrollTarget.scrollTop = 0;
            window.scrollTo(0, 0);
        }
    };

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToTop();
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.scroll-top')) {
            e.preventDefault();
            scrollToTop();
        }
    });

    // 7. Прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 300);
        });
    }

    // 8. Тёмная тема
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        // Загрузка сохранённой темы
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // 9. Плавающая кнопка мессенджера
    const messengerToggle = document.querySelector('.messenger-toggle');
    const messengerLinks = document.querySelector('.messenger-links');
    if (messengerToggle && messengerLinks) {
        messengerToggle.addEventListener('click', () => {
            messengerLinks.classList.toggle('active');
        });

        // Закрытие при клике вне
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.floating-messenger')) {
                messengerLinks.classList.remove('active');
            }
        });
    }
});
