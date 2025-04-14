import { Entity } from '../core/Entity.js';

export class Pea extends Entity {
    constructor(x, y) {
        super(x, y);
        this.speed = 2.5;
        this.damage = 20;
        this.width = 15;
        this.height = 15;
    }

    update() {
        this.x += this.speed;
    }

    render(ctx) {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 8, 0, Math.PI*2);
        ctx.fill();
    }

    get hitbox() {
        return {
            x: this.x - this.width/2, // 中心坐标转左上角
            y: this.y - this.height/2,
            width: this.width,
            height: this.height
        };
    }
    
    // 在碰撞检测时使用hitbox
    static check(a, b) {
        const aBox = a.hitbox;
        const bBox = b.hitbox;
        return (
            aBox.x < bBox.x + bBox.width &&
            aBox.x + aBox.width > bBox.x &&
            aBox.y < bBox.y + bBox.height &&
            aBox.y + aBox.height > bBox.y
        );
    }
}