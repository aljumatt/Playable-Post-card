class CardFront extends Phaser.Scene {
    constructor() {
        super('cardFrontScene')
    }


    preload() {
        //load all images
        this.load.image('cardFrontImg', './assets/images/postcard.png')
        this.load.spritesheet('resultImg', './assets/images/result.png', { frameWidth: 300, frameHeight: 100 })
        this.load.image('flipButton', 'assets/images/flip_over.png')
        this.load.image('cardBackImg', 'assets/images/postcard_back.png')
    }


    init() {
        //set vars for default
        this.slotStatus = [-1, -1, -1]
        this.words = ['GLOW', 'FLOAT', 'YELL']
        this.slotPositions = [
            { x: 280, y: 175 },
            { x: 90, y: 265 },
            { x: 145, y: 300 }
        ]
        this.combinations = {
            "0,1,2": 0,
            "0,2,1": 1,
            "1,0,2": 2,
            "1,2,0": 3,
            "2,0,1": 4,
            "2,1,0": 5
        }
    }


    create() {
        //spawn background card image
        this.cardFrontImg = this.add.sprite(width/2, height/2, 'cardFrontImg')

        //spawn flip over button
        this.flipButton = this.add.image(width-width/8, height-height/6, 'flipButton')
        this.flipButton.setInteractive()
        this.flipButton.on('pointerdown', () => {
            //do interaction
            this.scene.start('cardBackScene')
        })
        this.flipButton.setVisible(false)


        //create the actual story text
        const story = "Dear Leigh,\n\n I went on a walk the other day and saw a turtle. The turtle stoped to ______ in the middle of the field. Then suddenly, without warning, it started to ______ towards the sky. Finaly it ______ until the stars came out."
        this.add.text(width/2, height/2-50, story, {fontSize: '32px',
            fill: '#000000', wordWrap: {
                width: 600,
                useAdvancedWrap: true
        }}).setOrigin(0.5)


        //create the places where the text locks into place
        this.slotPositions.forEach((pos, index) => {
            let zone = this.add.zone(pos.x, pos.y, 120, 30).setRectangleDropZone(120, 30)
            zone.setData('slotIndex', index)
    
            // Visual outline for test
            //this.add.graphics().lineStyle(2, 0xffffff).strokeRect(pos.x - 60, pos.y - 15, 120, 30)
        })



        //create result sprite
        this.resultSprite = this.add.sprite(width / 2, height-height/6, 'resultImg', 0);
        this.resultSprite.setVisible(false);

        //create text objects
        this.texts = [this.create_dragable_text(0, width/4, 3*height/4), this.create_dragable_text(1, width/2, 3*height/4), this.create_dragable_text(2, 3*width/4, 3*height/4)]
        

        //setting what happends when drag and drop
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setData('startX', gameObject.x)
            gameObject.setData('startY', gameObject.y)
            const wordIdx = gameObject.getData('wordIndex')
            const currentSlot = this.slotStatus.indexOf(wordIdx)
            if (currentSlot !== -1) {
                this.slotStatus[currentSlot] = -1
                this.updateResultSprite()
            }

            gameObject.body.setAllowGravity(false)
            gameObject.body.setVelocity(0, 0)
        })
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX
            gameObject.y = dragY
        })
        this.input.on('dragend', (pointer, gameObject, dropped) => {
            if (!dropped) {
                gameObject.body.setAllowGravity(true)
            }
        })
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            const slotIdx = dropZone.getData('slotIndex')
            const wordIdx = gameObject.getData('wordIndex')
            if (this.slotStatus[slotIdx] !== -1) {
                gameObject.x = gameObject.getData('startX')
                gameObject.y = gameObject.getData('startY')
                gameObject.body.setAllowGravity(true)
                return 
            }
            gameObject.x = dropZone.x
            gameObject.y = dropZone.y
            gameObject.body.setAllowGravity(false)
    
            this.slotStatus[slotIdx] = wordIdx
            this.updateResultSprite()
        })
    }


    create_dragable_text(word_index, input_x, input_y) {
        //create text
        let newText = this.add.text(input_x, input_y, this.words[word_index], { fontSize: '32px', fill: '#002f14' }).setInteractive({useHandCursor: true})
        newText.setOrigin(0.5)

        //add metadata
        newText.setData('wordIndex', word_index)

        //add physics
        this.physics.add.existing(newText)
        newText.body.setBounce(0.6)
        newText.body.setDrag(0.01)
        newText.body.setGravityY(300)
        newText.body.setCollideWorldBounds(true)

        //make dragable
        this.input.setDraggable(newText)

        //return it
        return newText
    }


    updateResultSprite() {
        const isFull = !this.slotStatus.includes(-1);

        if (isFull) {
            const currentCombo = this.slotStatus.join(',');
            const targetFrame = this.combinations[currentCombo];
            if (targetFrame !== undefined) {
                this.resultSprite.setFrame(targetFrame);
                this.resultSprite.setScale(0).setAlpha(0);
                this.resultSprite.setVisible(true);
                this.flipButton.setVisible(true)
                //tween animation
                this.tweens.add({
                    targets: this.resultSprite,
                    scale: 1,
                    alpha: 1,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
        } else {
            this.resultSprite.setVisible(false);
            this.flipButton.setVisible(false)
        }
    }
}