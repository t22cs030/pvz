import { Plant } from '../Plant.js';

export class Wallnut extends Plant {
    constructor(row, col, game, config) {
        super(row, col, game, config);
        this.health = 4000;
    }

    update() {
        // Wallnut 不会攻击或产生阳光，所以这里不需要实现任何逻辑
        // 你可以添加一些逻辑来处理 Wallnut 的生命值或其他状态
    }

    render(ctx) {
        ctx.fillStyle = 'brown';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
    }
}