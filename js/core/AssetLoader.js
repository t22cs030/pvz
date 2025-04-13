export class AssetLoader {
    constructor() {
        this.images = {};
    }

    loadImage(name, path) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.images[name] = img;
                resolve();
            };
            img.src = path;
        });
    }
}