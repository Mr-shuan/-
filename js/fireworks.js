// 专业级鼠标动态跟随烟花特效
(function() {
    // 检测用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;
    
    const canvas = document.createElement('canvas');
    canvas.id = 'fireworks-canvas';
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout;
    let animationId;
    
    // 调整画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 鼠标移动处理
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseMoving = true;
        
        clearTimeout(mouseTimeout);
        mouseTimeout = setTimeout(() => {
            isMouseMoving = false;
        }, 100);
        
        // 随机创建粒子
        if (Math.random() > 0.65) {
            createTrailParticles(mouseX, mouseY, 2);
        }
    });
    
    // 点击创建烟花
    document.addEventListener('click', (e) => {
        createFirework(e.clientX, e.clientY);
    });
    
    // 创建烟花爆炸效果
    function createFirework(x, y) {
        const colors = [
            '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', 
            '#54a0ff', '#5f27cd', '#00d2d3', '#ff6348',
            '#ffc107', '#00bcd4', '#e91e63', '#9c27b0'
        ];
        const particleCount = 60;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i + Math.random() * 0.3;
            const speed = Math.random() * 7 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 1,
                color: color,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.012,
                gravity: 0.08,
                trail: [],
                type: 'firework'
            });
        }
    }
    
    // 创建鼠标轨迹粒子
    function createTrailParticles(x, y, count) {
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < count; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push({
                x: x + (Math.random() - 0.5) * 15,
                y: y + (Math.random() - 0.5) * 15,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3 - 1.5,
                radius: Math.random() * 2 + 0.5,
                color: color,
                alpha: 0.8 + Math.random() * 0.2,
                decay: Math.random() * 0.025 + 0.015,
                gravity: 0.04,
                type: 'trail'
            });
        }
    }
    
    // 主动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新和渲染粒子
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            // 更新位置和速度
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.alpha -= p.decay;
            
            // 检查是否需要移除
            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }
            
            // 绘制发光效果
            ctx.save();
            ctx.globalAlpha = p.alpha * 0.5;
            ctx.shadowBlur = 20;
            ctx.shadowColor = p.color;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            ctx.restore();
            
            // 绘制核心粒子
            ctx.save();
            ctx.globalAlpha = p.alpha;
            
            // 渐变填充
            const gradient = ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.radius
            );
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.3, p.color);
            gradient.addColorStop(1, p.color);
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            ctx.restore();
        }
        
        animationId = requestAnimationFrame(animate);
    }
    
    // 启动动画
    animate();
    
    // 清理资源
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        canvas.remove();
    });
})();