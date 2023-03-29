class Play extends Phaser.Scene {
    constructor(scene) {
        super('Play');
    }

    preload() {
        this.load.path = './assets/';
        this.load.image('bg_road', 'bg_road_posterized.png');
        this.load.image('car_white', 'car_white_posterized.png');
        this.load.image('dashboard', 'dashboard.png');
        this.load.image('car_cop', 'car_cop_posterized.png');
    }

    create() {
        // set world bounds to handle road "wall" collision
        this.physics.world.bounds.setTo(game.config.width/4, 0, game.config.width/2, game.config.height);
        this.physics.world.setBoundsCollision(true, true, false, false); // check left and right, not up or down

        this.background = this.add.tileSprite(centerX, 0, game.config.width, game.config.height, 'bg_road').setOrigin(0.5, 0);
        this.playerCar = this.physics.add.sprite(centerX, game.config.height/5*4, 'car_white');
        this.playerCar.setDebugBodyColor(0xFACADE);
        this.playerCar.setCollideWorldBounds(true);
        this.playerCar.setImmovable(true);

        this.copCar = this.physics.add.sprite(centerX, 0, 'car_cop');
        this.copCar.setBounce(1);
        this.copCar.setMaxVelocity(maxCarVelocity);
        this.copCar.setCollideWorldBounds(true);
        this.copCar.setVelocity(50, 200);

        this.dashboard = this.add.image(centerX, game.config.height + 100, 'dashboard').setOrigin(0.5, 1);

        // text
        text = this.add.text(10, 30, '', { font: '14px Courier', fill: '#ffffff' });
    }

    update() {
        // no update unless a gamepad is present
        //if (this.input.gamepad.total === 0) { return; }
    
        // clear debug array
        let debug = [];

        // get gamepads
        let pads = this.input.gamepad.gamepads;
        // let pads = this.input.gamepad.getAll();
        // let pads = navigator.getGamepads();
    
        // repeat for each connected gamepad
        for (let i = 0; i < pads.length; i++) {
            // store current gamepad
            let pad = pads[i];
    
            // bounce out of the for loop if the current pad doesn't exist
            if (!pad) { continue; }
    
            /* 
                Get gamepad information
                id: browser-dependent string w/ controller info (eg, controller name, USB vendor, 4-digit product string)
                index: unique integer for each gamepad currently connected
                timestamp: timestamp containing the most recent time this gamepad was updated
            */
            debug.push(pad.id);
            debug.push('Index: ' + pad.index + ' Timestamp: ' + pad.timestamp);
    
            // store gamepad buttons to string
            let buttons = '';
            /*
                Button values vary in value from 0 (not pressed) to 1 (on)
                Analog buttons return 0–1 range
                Button assignments tested on 8BitDo Pro 2
                B0: B
                B1: A
                B2: Y
                B3: X
                B4: L (shoulder)
                B5: R (shoulder)
                B6: L2 (shoulder) | analog
                B7: R2 (shoulder) | analog
                B8: select
                B9: start
                B10: left stick down
                B11: right stick down
                B12: D-pad up
                B13: D-pad down
                B14: left
                B15: right
                B16: special button
            */
            // loop through each button on the current gamepad
            for (let b = 0; b < pad.buttons.length; b++) {
                // store current button...
                let button = pad.buttons[b];
                // ...and add it to the buttons string
                buttons = buttons.concat('B' + button.index + ': ' + button.value + '  ');
                // buttons = buttons.concat('B' + b + ': ' + button.value + '  ');
    
                // a hacky way of formatting the debug text output
                if (b > 0 && b % 4 === 0) {
                    debug.push(buttons);
                    buttons = '';
                }
            }
            // push buttons string to debug array
            debug.push(buttons);
    
            // store gamepad axes to string
            let axes = '';
            /*
                Gamepad axes vary in value from -1 to 1 | center = 0
                Tested on 8BitDo Pro 2
                Axis 0: left stick  | left  (-1) / right (1)
                Axis 1: left stick  | up    (-1) / down  (1)
                Axis 2: right stick | left  (-1) / right (1)
                Axis 3: right stick | up    (-1) / down  (1)
            */
            // loop through each axis on the current gamepad
            for (let a = 0; a < pad.axes.length; a++) {
                // store current axis...
                let axis = pad.axes[a];
                // ...and add it to the axis string
                axes = axes.concat('A' + axis.index + ': ' + axis.getValue() + '  ');
                // axes = axes.concat('A' + a + ': ' + axis + '  ');
            }
            // push axes string (and a 'carriage return') to debug array
            debug.push(axes);
            debug.push('');

            // player car input
            this.playerCar.body.setDragX(carAcceleration/2);

            // handle D-pad control
            if (pad.left) {
                this.playerCar.setAccelerationX(-carAcceleration);
            } else if (pad.right) {
                this.playerCar.setAccelerationX(carAcceleration);
            } else if (pad.axes.length) {
                let axisHorizontal = pad.axes[0].getValue();
                this.playerCar.body.setAccelerationX(carAcceleration * axisHorizontal);
            }

            // update R2 value property
            this.R2value = pad.buttons[7].value;
            this.L2value = pad.buttons[6].value;
        }

        // use R2/L2 for gas/brake by changing tile sprite scroll speed
        if (scrollSpeed >= 0) {
            scrollSpeed -= 0.1;     // allows car to coast to a stop with no player input
            if (this.L2value > 0) {
                scrollSpeed -= 0.5 * this.L2value;
            }
        }
        if (this.R2value > 0 && scrollSpeed < maxScrollSpeed) {
            scrollSpeed += 0.25 * this.R2value;
        }
        if (scrollSpeed < 0) { scrollSpeed = 0; }   // prevent backward drift
        // update tile sprite
        this.background.tilePositionY -= scrollSpeed;

        // collision
        this.physics.collide(this.playerCar, this.copCar);
        
        // print debug text (uncomment if you want to see gamepad info)
        //text.setText(debug);
    }
}