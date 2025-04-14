import { Plant } from '../Plant.js';
import { Sun } from '../Sun.js';

export class Sunflower extends Plant {
    constructor(row, col, game, config) {
        super(row, col, game);
        this.produceTimer = config?.produceRate || 300;
        this.sunValue = config?.sunValue || 25;
    }

    update() {
        if (--this.produceTimer <= 0) {
            this.game.suns.push(
                new Sun(
                    this.x + Math.random() * 40 - 20,
                    this.y - 30,
                    false // 不是下落阳光
                )
            );
            this.produceTimer = 1500;
        }
    }

    render(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
    }
}