class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    create() {
        this.add.text(250, 200, "DUCK ROAD RAGE", { fontSize: "32px" });
        this.add.text(300, 300, "Press SPACE to Start");

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