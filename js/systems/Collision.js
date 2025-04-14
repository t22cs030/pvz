import { Zombie } from '../entities/Zombie.js';
import { Plant } from '../entities/Plant.js';
import { Pea } from '../entities/Projectile.js';

export class CollisionSystem {
    static check(entity1, entity2) {
        return (
            entity1.x < entity2.x + entity2.width &&
            entity1.x + entity1.width > entity2.x &&
            entity1.y < entity2.y + entity2.height &&
            entity1.y + entity1.height > entity2.y
        );
    }

    static checkZombiePlantCollision(zombies, grid) {
        const collisions = [];
        
        zombies.forEach(zombie => {
            const col = Math.floor(zombie.x / 80);
            const plant = grid[zombie.row][col];
            
            if (plant) {
                collisions.push({
                    zombie,
                    plant,
                    col
                });
            }
        });
        
        return collisions;
    }

    static checkBulletZombie(bullets, zombies) {
        const hits = [];
        bullets.forEach(bullet => {
            zombies.forEach(zombie => {
                if (this.check(bullet, zombie)) {
                    hits.push({ bullet, zombie });
                }
            });
        });
        return hits;
    }
}