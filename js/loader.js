// 页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载完成后隐藏加载动画
    window.addEventListener('load', function() {
        setTimeout(function() {
            const loader = document.querySelector('.loader-wrapper');
            if (loader) {
                loader.classList.add('hidden');
            }
            
            // 显示页面内容
            document.body.style.overflow = 'auto';
        }, 2000); // 2秒后隐藏加载动画
    });

    // 滚动触发动画
    const scrollElements = document.querySelectorAll('.fade-in-on-scroll');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };

    // 使用节流优化滚动性能
    let throttleTimer;
    const throttle = (callback, time) => {
        if (throttleTimer) return;
        throttleTimer = true;
        setTimeout(() => {
            callback();
            throttleTimer = false;
        }, time);
    };

    window.addEventListener('scroll', () => {
        throttle(handleScrollAnimation, 100);
    });
});