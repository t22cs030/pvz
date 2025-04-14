import { AssetLoader } from './AssetLoader.js';
import { Plant } from '../entities/Plant.js';
import { Zombie } from '../entities/Zombie.js';
import { CollisionSystem } from '../systems/Collision.js';
import { Pea } from '../entities/Projectile.js';
import { PlantFactory } from '../factories/PlantFactory.js';
import { Sun } from '../entities/Sun.js';


export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.entities = [];
        this.grid = Array(5).fill().map(() => Array(9).fill(null));
        this.resources = 100;
        this.suns = [];
        this.mousePos = { x: 0, y: 0 };
        this.setupSunListeners();
        
        // 先创建实体，再启动游戏循环
        this.setupTestScene(); 
        this.setupEventListeners();
        
        // 验证实体
        console.log("实体坐标示例 - 豌豆射手:", this.entities[0].x, this.entities[0].y);
        console.log("实体坐标示例 - 僵尸:", this.entities[3].x, this.entities[3].y);
        
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    // 专门的测试场景方法
    setupTestScene() {
       // 清空现有实体
        this.entities = [];
        
        // 测试僵尸
        const testZombies = [0, 1, 2, 3, 4]; // 每行一个僵尸
        
        // 创建实体
        
        testZombies.forEach(row => {
            this.entities.push(new Zombie(row,this));
        });
        
        console.log("测试场景已加载：3植物 + 5僵尸");

        // 测试阳光
        this.suns.push(new Sun(100, -50));
        this.suns.push(new Sun(200, -50));
        
        // 测试工厂创建
        this.entities.push(
            PlantFactory.create('sunflower', 2, 2, this),
            PlantFactory.create('peashooter', 3, 4, this),
            PlantFactory.create('wallnut', 4, 8, this)
        );
    }

    setupSunListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mousePos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });
    }

    gameLoop(timestamp) {
        // 简化的游戏循环
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        // 更新所有实体
        this.entities.forEach(entity => entity.update());
        
        // 碰撞检测
        this.handleCollisions();
        
        // 移除超出边界的实体
        this.cleanupEntities();

        // 阳光系统更新
        this.suns.forEach((sun, index) => {
            sun.update();
            if (sun.checkCollect(this.mousePos)) {
                this.resources += sun.collect();
                this.suns.splice(index, 1);
            }
        });

        this.handleCollisions();
    }

    render() {
        // 绘制网格线（调试用）
    this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 9; col++) {
            this.ctx.strokeRect(col * 80, row * 80, 80, 80);
        }
    }

    // 绘制实体碰撞框
    this.entities.forEach(e => {
        this.ctx.strokeStyle = 'red';
        this.ctx.strokeRect(
            e.x - e.width/2, 
            e.y - e.height/2, 
            e.width, 
            e.height
        );
    });
        // 正确使用this.ctx
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 所有其他渲染操作也要用this.ctx
        this.entities.forEach(entity => {
            entity.render(this.ctx); // 传递ctx给实体
        });
        
        // 阳光渲染
        this.suns.forEach(sun => sun.render(this.ctx));
        
        // 调试信息（可选）
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`阳光: ${this.resources}`, 20, 30);
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            console.log(`Clicked at (${x}, ${y})`);
        });
    }

    handleCollisions() {
        // 碰撞
        const bullets = this.entities.filter(e => e instanceof Pea);
        const zombies = this.entities.filter(e => e instanceof Zombie);
        const bulletHits = CollisionSystem.checkBulletZombie(bullets, zombies);

        bulletHits.forEach(({ bullet, zombie }) => {
            zombie.health -= bullet.damage;
            bullet.toRemove = true;
        });

        // 僵尸-植物碰撞（网格检测）
        const gridHits = CollisionSystem.checkZombiePlantCollision(zombies, this.grid);
        gridHits.forEach(({ zombie, plant, col }) => {
            zombie.isAttacking = true;
            zombie.x = (col + 1) * 80 - 30; // 对齐网格
            
            if (zombie.attackCooldown <= 0) {
                plant.health -= 0.5;
                zombie.attackCooldown = 30;
            }
        });
    }

    cleanupEntities() {
        this.entities = this.entities.filter(entity => {
            // 保留未标记删除且在屏幕内的实体
            return !entity.toRemove && 
                   entity.x > -50 && 
                   entity.x < this.canvas.width + 50;
        });
    }
}