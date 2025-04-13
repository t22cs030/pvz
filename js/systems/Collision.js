import { Zombie } from '../entities/Zombie.js';
import { Plant } from '../entities/Plant.js';
import { Pea } from '../entities/Projectile.js';

export class CollisionSystem {
    static check(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    static checkAll(entities) {
        const collisions = [];
        // 只检查需要交互的实体组合
        const zombies = entities.filter(e => e instanceof Zombie);
        const plants = entities.filter(e => e instanceof Plant);
        const peas = entities.filter(e => e instanceof Pea);

        // 子弹 vs 僵尸
        peas.forEach(pea => {
            zombies.forEach(zombie => {
                if (this.check(pea, zombie)) {
                    collisions.push({ pea, zombie });
                }
            });
        });

        // 僵尸 vs 植物
        zombies.forEach(zombie => {
            plants.forEach(plant => {
                if (plant.row === zombie.row && 
                    this.check(zombie, plant)) {
                    collisions.push({ zombie, plant });
                }
            });
        });

        return collisions;
    }
}