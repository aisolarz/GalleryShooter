class WinScene extends Phaser.Scene {
    constructor() {
        super("winScene");
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        this.add.text(
            280,
            200,
            "YOU WIN!",
            {
                fontSize: "40px",
                fill: "#00ff00"
            }
        );

        this.add.text(
            250,
            280,
            "Final Score: " + this.finalScore,
            {
                fontSize: "28px"
            }
        );

        this.add.text(
            180,
            360,
            "The duck defeated the evil hotdog truck.",
            {
                fontSize: "24px"
            }
        );

        this.add.text(
            220,
            430,
            "Press SPACE to play again",
            {
                fontSize: "24px"
            }
        );

        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        this.duck = this.add.sprite(200, 300, "duck");
        this.duck.setScale(0.6);

        this.boss = this.add.sprite(600, 300, "boss");
        this.boss.setScale(2);
        this.boss.setTint(0xff0000);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("gameScene");
        }

        this.duck.y = 300 + Math.sin(this.time.now / 200) * 25;

        // defeated hotdog wobble
        this.boss.angle += 2;
    }
}