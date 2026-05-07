class GameOverScene extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        this.gameOverText = this.add.text(
            300,
            100,
            "GAME OVER",
            { fontSize: "40px", fill: "#ff0000" }
        );
        
        this.add.text(280, 300, "Score: " + this.finalScore);
        this.add.text(250, 350, "Press SPACE to Restart");

        this.truck = this.add.sprite(400, 220, "truck");
        this.truck.setScale(2.5);
        this.truck.setFlipX(true);

        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("gameScene");
        }

        this.gameOverText.visible = Math.floor(this.time.now / 500) % 2 === 0;
    }
}