let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [TitleScene, GameScene, GameOverScene, WinScene]
};

let game = new Phaser.Game(config);