export class Plant {
    constructor(row, col, game, config = {}) {
        this.x = col * 80 + 40;
        this.y = row * 80 + 40;
        this.row = row;
        this.col = col;
        this.game = game;
        this.health = 100;
        this.config = config;
        this.width = 60;
        this.height = 70;
    }

    // 子类需要实现的方法
    update() {}
    render(ctx) {
        // 默认绘制调试矩形
        ctx.strokeStyle = 'green';
        ctx.strokeRect(this.x - 30, this.y - 30, 60, 60);
        // 血条渲染
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 30, this.y - 45, 60, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 30, this.y - 45, 60 * (this.health / 100), 5);
        
    }
}