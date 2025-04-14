import { Plant } from '../Plant.js';

export class Peashooter extends Plant {
    constructor(row, col, game, config) {
        super(row, col, game, config);
        this.attackTimer = 0;
    }

    update() {
        if (--this.attackTimer <= 0) {
            this.game.entities.push(
                new Pea(this.x + 20, this.y, this.row)
            );
            this.attackTimer = 60;
        }
    }

    render(ctx) {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
        ctx.fill();
    }
}