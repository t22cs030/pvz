import { AssetLoader } from './AssetLoader.js';
import { Plant } from '../entities/Plant.js';
import { Zombie } from '../entities/Zombie.js';
import { CollisionSystem } from '../systems/Collision.js';
import { Pea } from '../entities/Projectile.js';


export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.entities = [];
        this.grid = Array(5).fill().map(() => Array(9).fill(null));
        this.resources = 100;
        
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
        
        // 测试植物
        const testPlants = [
            { type: 'peashooter', row: 2, col: 2 },
            { type: 'sunflower', row: 0, col: 0 },
            { type: 'wallnut', row: 4, col: 4 }
        ];
        
        // 测试僵尸
        const testZombies = [0, 1, 2, 3, 4]; // 每行一个僵尸
        
        // 创建实体
        testPlants.forEach(p => {
            this.entities.push(new Plant(p.type, p.row, p.col,this));
            this.grid[p.row][p.col] = p.type; // 更新网格状态
        });
        
        testZombies.forEach(row => {
            this.entities.push(new Zombie(row,this));
        });
        
        console.log("测试场景已加载：3植物 + 5僵尸");
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
    }

    render() {
        // 清空画布时保留上一帧内容（调试用）
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 强制绘制所有实体的调试信息
    this.entities.forEach(entity => {
        entity.render(this.ctx); // 正常渲染
        
        // 实体类型标签
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(
            `${entity.constructor.name}`, 
            entity.x - 30, 
            entity.y - 15
        );
    });
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
        const collisions = CollisionSystem.checkAll(this.entities);
        
        collisions.forEach(({ pea, zombie, plant }) => {
            // 子弹伤害处理
            if (pea && zombie) {
                zombie.health -= pea.damage;
                pea.toRemove = true;
                console.log(`子弹命中! 僵尸血量: ${zombie.health}`);
            }
            
            // 僵尸攻击处理
            if (zombie && plant) {
                plant.health -= zombie.damage;
                zombie.speed = 0; // 停止移动
                console.log(`僵尸攻击! 植物血量: ${plant.health}`);
                
                // 植物死亡处理
                if (plant.health <= 0) {
                    plant.toRemove = true;
                    this.grid[plant.row][plant.col] = null;
                    zombie.speed = 0.5; // 恢复移动
                }
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