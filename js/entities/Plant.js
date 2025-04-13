import { Entity } from '../core/Entity.js';
import { Pea } from '../entities/Projectile.js';
export class Plant extends Entity {
    constructor(type, row, col,  gameRef) {
        const x = col * 80 + 40;
        const y = row * 80 + 40;
        super(x, y);
        
        this.type = type;
        this.row = row;
        this.col = col;
        this.health = 100;
        this.damage = 14

        this.cooldown = 0;
        this.attackSpeed = 60; // 帧数
        this.game = gameRef; // 保存引用
    }

    update() {
        if (this.type === 'peashooter' && this.cooldown <= 0) {
            this.game.entities.push(new Pea(this.x + 20, this.y));
            this.cooldown = this.attackSpeed;
        }
        if (this.cooldown > 0) this.cooldown--;
    }

    render(ctx) {
        ctx.fillStyle = this.getColor();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI*2);
        ctx.fill();
    }

    getColor() {
        return {
            sunflower: 'yellow',
            peashooter: 'green',
            wallnut: 'brown'
        }[this.type] || 'gray';
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