let _,

    isThing,

    Clock,
    clock,
    dt = 1,

    backgroundImg,
    laserImg,
    asteroidImg,
    shipImg,
    subatomicFont,

    Asteroid,
    Ship,
    Laser,

    asteroids = [],
    lasers = [],
    ships = [],
    clocks = [],
    player,

    spawnAsteroid;

function preload() {
    backgroundImg = loadImage('background.png');
    laserImg = loadImage('laser.png');
    asteroidImg = loadImage('asteroid.png');
    shipImg = loadImage('ship.png');
    subatomicFont = loadFont('subatomic.ttf');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    angleMode(RADIANS);

    isThing = (maybeisthing) => {
        return maybeisthing !== undefined && (typeof maybeisthing === "number" ? !isNaN(maybeisthing) : true) && maybeisthing !== null;
    };

    textFont(subatomicFont, 20);


    Asteroid = (function () {
        let O = function (config) {
            Object.assign(this, config);
        };
        O.methods = {
            display: function () {
                imageMode(CENTER);
                image(asteroidImg, this.x, this.y);
            },
            move: function () {
                console.log(dt);
                this.x += this.xv * dt;
                this.y += this.yv * dt;
            },
        };
        Object.assign(O.prototype, O.methods);

        return O;
    })();
    Laser = (function () {
        let O = function (config) {
            Object.assign(this, config);
        };
        O.methods = {
            display: function () {
                imageMode(CENTER);
                image(laserImg, this.x, this.y);
            },
        };
        Object.assign(O.prototype, O.methods);

        return O;
    })();
    Ship = (function () {
        let O = function (config) {
            Object.assign(this, config);
            let defaults = {
                canShoot: false,
                shootTimer: 0,
                maxShootTimer: 500,
            };

            let essentials = ['x', 'y'];
            for (var i = 0; i < essentials.length; i++) {
                if (!this.hasOwnProperty(essentials[i])) {
                    throw new Error(`Undefined property \`${essentials[i]}\``);
                }
            }
        };
        O.methods = {
            display: function () {
                imageMode(CENTER);
                image(shipImg, this.x, this.y);
            },
            shoot: function () {
                if (this.canShoot) {
                    this.canShoot = false;
                }
                this.shootTimer += clock.dt;
                if (this.shootTimer > this.maxShootTimer) {
                    this.canShoot = true;
                }
            },
            update: function () {
                this.shoot();

            }
        };
        Object.assign(O.prototype, O.methods);

        return O;
    })();


    Clock = (function () {
        O = function (config = {}) {
            clocks.push(this);
            Object.assign(this, config);
            let defaults = {
                time: 0,
                lastTick: 0,
            };

            let essentials = [];
            for (var i = 0; i < essentials.length; i++) {
                if (!this.hasOwnProperty(essentials[i])) {
                    throw new Error(`Undefined property \`${essentials[i]}\``);
                }
            }
        };
        O.methods = {
            tick: function () {

                let t = this.time - this.lastTick;
                this.lastTick = millis();
                return this.time;
            },
            updateTime: function () {
                console.log(O.dt);
                this.time += O.dt;
            },
        };
        Object.assign(O.prototype, O.methods);
        O.t = O.dt = 0;
        return O;
    });
    clock = new Clock();



    ships.push(new Ship({
        x: 0,
        y: 0,
    }));
    player = ships[0];

    spawnAsteroid = function () {
        let randDir = Math.random() * Math.PI,
            randMag = (Math.random() * 2 + 4);
        asteroids.push(new Asteroid({
            x: Math.random() * (width + 200) - 100,
            y: Math.random() * 100 - 200,
            xv: Math.cos(randDir) * randMag,
            yv: Math.sin(randDir) * randMag,
        }));
    };
}




function draw() {
    O.t = millis() / 1000;
    dt = O.dt = (O.t - O.pt) / 1000;
    O.pt = millis() / 1000;
    clocks.forEach((obj, indx) => {
        obj.updateTime();
    });

    background(0);

    if (Math.random() < 0.1) {
        spawnAsteroid();
    }

    if (isThing(player)) {
        [player.x, player.y] = [mouseX, mouseY];
        player.display();
        player.update();
    }

    asteroids.forEach((obj, indx) => {
        obj.move();
        obj.display();
    });



}