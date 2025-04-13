import { Entity } from '../core/Entity.js';

export class Zombie extends Entity {
    constructor(row, gameRef ) {
        super(750, row * 80 + 40);
        this.row = row;
        this.speed = 0.5;
        this.health = 100;
        this.damage = 0.5;
        this.width = 50;
        this.height = 80;
        this.game = gameRef; // 保存引用
    }

    update() {
        this.x -= this.speed;
        if (this.x < 0) this.game.gameOver(); // 通过引用访问
        if (this.health <= 0) this.toRemove = true;
    }

    render(ctx) {
        ctx.fillStyle = 'gray';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI*2);
        ctx.fill();
        // 血条
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 25, this.y - 50, 50, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 25, this.y - 50, 50 * (this.health/100), 5);
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