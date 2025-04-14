import { Zombie } from '../entities/Zombie.js';
import { Plant } from '../entities/Plant.js';
import { Pea } from '../entities/Projectile.js';

export class CollisionSystem {
    static check(a, b) {
        const aBox = a.hitbox || a;
        const bBox = b.hitbox || b;
        
        return (
            aBox.x < bBox.x + bBox.width &&
            aBox.x + aBox.width > bBox.x &&
            aBox.y < bBox.y + bBox.height &&
            aBox.y + aBox.height > bBox.y
        );
    }

    static checkAll(entities) {
        const peas = entities.filter(e => e instanceof Pea);
        const zombies = entities.filter(e => e instanceof Zombie);
        const collisions = [];

        // 豌豆 vs 僵尸
        peas.forEach(pea => {
            zombies.forEach(zombie => {
                if (this.check(pea, zombie)) {
                    collisions.push({ pea, zombie });
                }
            });
        });

        return collisions;
    }
}