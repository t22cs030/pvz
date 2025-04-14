export class Sun {
    constructor(x, y, isFalling = true) {
        this.x = x;
        this.y = y;
        this.targetY = y + 500; // 下落终点
        this.isFalling = isFalling;
        this.hasStopped = false;
        this.speed = 2;
        this.value = 25; // 阳光的价值
    }

    update() {
        if (this.isFalling && !this.hasStopped) {
            this.y += this.speed;
            if (this.y >= this.targetY) {
                this.hasStopped = true;
            }
        }
    }

    checkCollect(mousePos) {
        const inRange = (
            mousePos.x > this.x - 30 && 
            mousePos.x < this.x + 30 &&
            mousePos.y > this.y - 30 && 
            mousePos.y < this.y + 30
        );
        return inRange && !this.collected;
    }

    collect() {
        this.collected = true;
        return this.value;
    }

    render(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // 绘制阳光（带光芒效果）
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // 光芒射线
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + Math.cos(angle) * 30,
                this.y + Math.sin(angle) * 30
            );
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        }
        
        ctx.restore();
    }
}