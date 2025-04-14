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
            this.handleAttack(plant, col);
        } else {
            this.x -= this.speed;
            this.isAttacking = false;
        }
    }

    render(ctx) {
        // 绘制僵尸主体
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x - 30, this.y - 40, 60, 80);

        // 血条背景
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x - 30, this.y - 50, 60, 5);
        
        // 当前血量
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 30, this.y - 50, 60 * (this.health / 100), 5);
    }

    handleAttack(plant, col) {
        this.isAttacking = true;
        this.x = (col + 1) * 80 - 30; // 对齐到格子边界
        
        if (this.attackCooldown <= 0) {
            plant.health -= this.attackDamage;
            this.attackCooldown = 30;
            
            if (plant.health <= 0) {
                this.game.grid[this.row][col] = null;
            }
        }
        this.attackCooldown--;
    }

}