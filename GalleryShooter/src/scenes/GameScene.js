 console.log("GameScene file loaded");


class GameScene extends Phaser.Scene {
    constructor(){
        super("gameScene");
    }

    preload(){
        //player and enemies
        this.load.image("car", "assets/sports_convertible.png");
        this.load.image("truck", "assets/truckdelivery.png");
        this.load.image("police", "assets/police.png");
        this.load.image("duck", "assets/duck_brown.png");

        //the lasers
        this.load.image("enemyLaser", "assets/laserRed09.png");
        this.load.image("duckLaser", "assets/laserGreen16.png");

        //the boss
        this.load.image("boss", "assets/hotdog.png");

        //explosion frames
        this.load.image("explosion0", "assets/frame0000.png");
        this.load.image("explosion1", "assets/frame0001.png");
        this.load.image("explosion2", "assets/frame0002.png");
        this.load.image("explosion3", "assets/frame0003.png");
        this.load.image("explosion4", "assets/frame0004.png");
        this.load.image("explosion5", "assets/frame0005.png");
        this.load.image("explosion6", "assets/frame0006.png");
        this.load.image("explosion7", "assets/frame0007.png");
        this.load.image("explosion8", "assets/frame0008.png");

        this.load.audio("backgroundMusic", "assets/backgroundMusic.mp3")
        this.load.audio("hitSound", "assets/jingles_HIT13.ogg")


    }

    create(){
        this.my = {
            sprite: {},
            text: {}
        };
        
        let my = this.my;

        //player!!!
        my.sprite.player = this.add.sprite(
            100,
            game.config.height / 2,
            "duck"
        );

        my.sprite.player.setScale(0.5);

        //groups
        this.playerBullets = [];
        this.enemyBullets = [];
        this.enemies = [];

        //stats of the games
        this.score = 0;
        this.health = 3;
        this.bossSpawned = false;


        // hit animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "explosion0" },
                { key: "explosion1" },
                { key: "explosion2" },
                { key: "explosion3" },
                { key: "explosion4" },
                { key: "explosion5" },
                { key: "explosion6" },
                { key: "explosion7" },
                { key: "explosion8" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 0,
            hideOnComplete: true
        });

        //ALL THE SOUNDS
        
        // Hit sound 
        this.hitSound = this.sound.add('hitSound',  { volume: 3.0});

        this.backgroundMusic = this.sound.add(
            "backgroundMusic",
            {
                volume: 0.5,
                loop: true
            }
        );

        this.backgroundMusic.play();

        // CONTROLSSS
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // MOVEMENT SPEEDSSS
        this.playerSpeed = 300;
        this.bulletSpeed = 300;

        //The score texts
        my.text.score = this.add.text(
            600,
            20,
            "Score: 0",
            {
                fontSize: "24px",
                fill: "#ffffff"
            }
        );

        //HEALTH TEXT
        my.text.health = this.add.text(
            20,
            20,
            "Hearts: 3",
            {
                fontSize: "24px",
                fill: "#ffffff"
            }
        );

        //title
        this.add.text(
            20,
            60,
            "Duck Road Rage",
            {
                fontFamily: "Times",
                fontSize: 24
            }
        );


        //enemy spawning
        this.enemySpawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });
    }


    spawnEnemy() {
        if (this.bossSpawned){
            return;
        }

        let y = Phaser.Math.Between(50, 550);
        let type = Phaser.Math.Between(0,2);

        let enemy;

        if (type == 0){
            //a regular car
            enemy = this.add.sprite(800, y, "car");
            enemy.setFlipX(true);
            enemy.setScale(2.0);
            enemy.health = 1;
            enemy.speed = 150;
            enemy.canShoot = false;
            enemy.points = 10;
        }

        else if (type === 1){
            //the truck
            enemy = this.add.sprite(800, y, "truck");
            enemy.setFlipX(true);
            enemy.setScale(2.5);
            enemy.health = 3;
            enemy.speed = 100;
            enemy.canShoot = false;
            enemy.points = 30;
        }

        else{
            //POPO
            enemy = this.add.sprite(800, y, "police");
            enemy.setFlipX(true);
            enemy.setScale(2.0);
            enemy.health = 2;
            enemy.speed = 250;
            enemy.canShoot = true;
            enemy.points = 50;
        }
        this.enemies.push(enemy);
    }

    //HOTDOG BOSS
    spawnBoss(){
        this.enemySpawnTimer.remove();
        this.boss = this.add.sprite(
            700,
            300,
            "boss"
        );
        this.boss.setScale(2.0);
        this.boss.setFlipX(true);

        this.boss.health = 50;
        this.bossSpawned = true;

        //boss health displayed:
        this.bossHealthText = this.add.text(
            550,
            60,
            "Boss HP: 50",
            {
                fontSize: "24px",
                fill: "#ff0000"
            }
        );
    }

    update(time, delta) {
        let my = this.my;
        let dt = delta / 1000;

        //duck movement
        if (this.up.isDown) {
            my.sprite.player.y -= this.playerSpeed * dt;
        }

        if (this.down.isDown) {
            my.sprite.player.y += this.playerSpeed * dt;
        }

        my.sprite.player.y = Phaser.Math.Clamp(
            my.sprite.player.y,
            50,
            550
        );


        //duck shooting
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            let bullet = this.add.sprite(
                my.sprite.player.x,
                my.sprite.player.y,
                "duckLaser"
            );
            bullet.setScale(0.3);

            this.playerBullets.push(bullet);
        }

        //player bullets move
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            let bullet = this.playerBullets[i];

            if (!bullet.active) {
                this.playerBullets.splice(i, 1);
                continue;
            }

            bullet.x += this.bulletSpeed * dt;

            if (bullet.x > 850) {
                bullet.destroy();
                this.playerBullets.splice(i, 1);
            }
        }

        //enimies move
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let enemy = this.enemies[i];

            if (!enemy.active) {
                this.enemies.splice(i, 1);
                continue;
            }

            enemy.x -= enemy.speed * dt;

            if (enemy.canShoot && Math.random() < 0.01) {
                let laser = this.add.sprite(
                    enemy.x,
                    enemy.y,
                    "enemyLaser"
                );

                laser.setScale(0.3);
                this.enemyBullets.push(laser);
            }

            if (enemy.x < 50) {
                this.health--;
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }

        //move enemy bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            let laser = this.enemyBullets[i];

            if (!laser.active) {
                this.enemyBullets.splice(i, 1);
                continue;
            }

            laser.x -= 300 * dt;

            if (laser.x < 0) {
                laser.destroy();
                this.enemyBullets.splice(i, 1);
            }
        }

    

        //once the bullet hits the enemy
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            let bullet = this.playerBullets[i];

            if (!bullet.active) continue;

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                let enemy = this.enemies[j];

                if (!enemy.active) continue;

                if (
                    Phaser.Math.Distance.Between(
                        bullet.x,
                        bullet.y,
                        enemy.x,
                        enemy.y
                    ) < 50
                ) {
                    enemy.health--;
                    bullet.destroy();
                    this.playerBullets.splice(i, 1);

                    this.hitSound.play();

                    if (enemy.health <= 0) {
                        let boom = this.add.sprite(
                            enemy.x,
                            enemy.y,
                            "explosion0"
                        );

                        boom.play("puff");

                        this.score += enemy.points;
                        enemy.destroy();
                        this.enemies.splice(j, 1);
                    }

                    break;
                }
            }
            // BOSS COLLISION
            if (this.boss) {
                if (
                    Phaser.Math.Distance.Between(
                        bullet.x,
                        bullet.y,
                        this.boss.x,
                        this.boss.y
                    ) < 80
                ) {
                    this.boss.health--;
                    bullet.destroy();
                    this.playerBullets.splice(i, 1);
                    this.hitSound.play();

                    if (this.boss.health <= 0) {
                        let boom = this.add.sprite(
                            this.boss.x,
                            this.boss.y,
                            "explosion0"
                        );

                        boom.play("puff");

                        this.score += 1000;

                        this.boss.destroy();
                        this.boss = null;   // IMPORTANT

                        this.scene.start("winScene", {
                            score: this.score
                        });
                    }
                }
            }
        }

        //boooommmmm  enemy laser hits the player
        for (let laser of this.enemyBullets) {
            if (
                Phaser.Math.Distance.Between(
                    laser.x,
                    laser.y,
                    my.sprite.player.x,
                    my.sprite.player.y
                ) < 40
            ) {
                this.health--;
                laser.destroy();
            }
        }

        //score and heart stuff
        my.text.score.setText("Score: " + this.score);
        my.text.health.setText("Hearts: " + this.health);

        //boss spawns
        if (this.score >= 300 && !this.bossSpawned) {
            this.spawnBoss();
        }

        //boss movesesese
        if (this.boss) {
            this.boss.y += Math.sin(time / 300) * 4;
            this.boss.x = 650 + Math.sin(time / 500) * 50;

            this.bossHealthText.setText(
                "Boss HP: " + this.boss.health
            );

            // boss shoots faster lasers
            if (Math.random() < 0.03) {
                let bossLaser = this.add.sprite(
                    this.boss.x,
                    this.boss.y,
                    "enemyLaser"
                );

                bossLaser.setScale(0.5);

                this.enemyBullets.push(bossLaser);
            }
        }

        //game joever
        if (this.health <= 0) {
            this.backgroundMusic.stop();

            // destroy all enemy bullets
            for (let laser of this.enemyBullets) {
                if (laser.active) {
                    laser.destroy();
                }
            }

            // destroy all player bullets
            for (let bullet of this.playerBullets) {
                if (bullet.active) {
                    bullet.destroy();
                }
            }

            // destroy all enemies
            for (let enemy of this.enemies) {
                if (enemy.active) {
                    enemy.destroy();
                }
            }

            // destroy boss if it exists
            if (this.boss) {
                this.boss.destroy();
                this.boss = null;
            }

            // destroy boss hp text
            if (this.bossHealthText) {
                this.bossHealthText.destroy();
            }

            this.scene.start("gameOverScene", {
                score: this.score
            });
        }
    }

}
