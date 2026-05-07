class TitleScene extends Phaser.Scene {
    constructor() {
        super("titleScene");
    }

    preload() {
        this.load.image("duck", "assets/duck_brown.png");
        this.load.image("car", "assets/sports_convertible.png");
    }

    create() {
        this.road = this.add.rectangle(
            400,
            420,
            800,
            120,
            0x444444
        );


        //ok idk if this is gonna work but since the background is black
        //if i make white lines moving itll look like a street??
        this.roadLine1 = this.add.rectangle(300, 420, 120, 10, 0xffffff);
        this.roadLine2 = this.add.rectangle(550, 420, 120, 10, 0xffffff);
        this.roadLine3 = this.add.rectangle(800, 420, 120, 10, 0xffffff);


        this.add.text(250, 200, "DUCK ROAD RAGE", { fontSize: "32px" });
        this.add.text(300, 300, "Press SPACE to Start");

        this.duck = this.add.sprite(150, 390, "duck");
        this.duck.setScale(0.5);

        this.car = this.add.sprite(650, 390, "car");
        this.car.setScale(2);
        this.car.setFlipX(true);


        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("gameScene");
        }

        this.duck.y = 390 + Math.sin(this.time.now / 300) * 10;
        this.car.x = 650 + Math.sin(this.time.now / 500) * 40;

        this.roadLine1.x -= 6;
        this.roadLine2.x -= 6;
        this.roadLine3.x -= 6;

        if (this.roadLine1.x < -60) this.roadLine1.x = 860;
        if (this.roadLine2.x < -60) this.roadLine2.x = 860;
        if (this.roadLine3.x < -60) this.roadLine3.x = 860;
    }
}