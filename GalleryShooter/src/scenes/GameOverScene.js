class GameOverScene extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        this.add.text(300, 250, "GAME OVER");
        this.add.text(280, 300, "Score: " + this.finalScore);
        this.add.text(250, 350, "Press SPACE to Restart");

        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("gameScene");
        }
    }
}