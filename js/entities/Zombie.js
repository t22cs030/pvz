import { Entity } from '../core/Entity.js';

export class Zombie extends Entity {
    constructor(row, gameRef ) {
        super(800, row * 80 + 40);
        this.row = row;
        this.speed = 0.1;
        this.health = 100;
        this.width = 50;
        this.height = 80;
        this.game = gameRef; // 保存引用
        this.attackCooldown = 0;
        this.attackDamage = 0.5; // 每次攻击伤害
        this.isAttacking = false;
    }

    update() {
        // 检测前方植物
        const col = Math.floor(this.x / 80);
        const plant = this.game.grid[this.row][col];
        
        if (plant) {
            this.isAttacking = true;
            if (this.attackCooldown <= 0) {
                plant.health -= this.attackDamage;
                this.attackCooldown = 30; // 0.5秒攻击间隔
                
                if (plant.health <= 0) {
                    this.game.grid[this.row][col] = null;
                    this.isAttacking = false;
                }
            }
        } else {
            this.isAttacking = false;
            this.x -= this.speed; // 正常移动
        }
        
        this.attackCooldown--;
    }

    render(ctx) {
        // 绘制僵尸
        ctx.fillStyle = this.isAttacking ? '#ff0000' : '#8B4513'; // 攻击时变红
        ctx.fillRect(this.x - 30, this.y - 40, 60, 80);
        
        // 血条
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 30, this.y - 50, 60, 5);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 30, this.y - 50, 60 * (this.health / 100), 5);
        
        // 调试信息
        if (this.game.debugMode) {
            ctx.fillStyle = 'white';
            ctx.font = '10px Arial';
            ctx.fillText(`ATK:${this.isAttacking}`, this.x - 20, this.y - 55);
        }
    }

}