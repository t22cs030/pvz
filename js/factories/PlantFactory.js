import { Peashooter } from '../entities/plants/Peashooter.js';
import { Sunflower } from '../entities/plants/Sunflower.js';

export class PlantFactory {
    static PLANT_TYPES = {
        peashooter: {
            class: Peashooter,
            cost: 100,
            texture: 'peashooter.png'
        },
        sunflower: {
            class: Sunflower,
            cost: 50,
            texture: 'sunflower.png'
        }
    };

    static create(type, row, col, game) {
        const config = this.PLANT_TYPES[type];
        if (!config) throw new Error(`Unknown plant type: ${type}`);
        
        return new config.class(row, col, game, config);
    }

    static getCost(type) {
        return this.PLANT_TYPES[type]?.cost || 0;
    }
}