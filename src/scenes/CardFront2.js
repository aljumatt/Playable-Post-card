class CardFront2 extends Phaser.Scene {
    constructor() {
        super('cardFrontScene2')
    }


    init() {
        //set vars for default
        this.slotStatus = [-1, -1, -1]
        this.words = ['ROCKET', 'HORSE', 'TRAIN']
        this.slotPositions = [
            { x: 150, y: 188 },
            { x: 459, y: 221 },
            { x: 438, y: 322 }
        ]
        this.combinations = {
            "0,1,2": 0,
            "0,2,1": 1,
            "1,0,2": 2,
            "1,2,0": 3,
            "2,0,1": 4,
            "2,1,0": 5 //here
        }

        this.dragParticles = new Array(3)
        this.isFullCur = false
    }


    create() {
        //create sound effects
        this.placeSFX = this.sound.add('placeSFX')
        this.removeSFX = this.sound.add('removeSFX')
        this.imageChangeStateSFX = this.sound.add('imageChangeStateSFX')

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
        const story = "Dear Leigh,\n\n I had the craziest morning, there was a turtle in my front yard and it was standing in front of a ________. The turtle then punched it till it fell over, and started riding a ________ that was nearby. Once I could no longer see the turtle and though the insanity was over, I saw a cat blow past me riding a ________."
        let storyText = this.add.text(width/2, height/2-50, story, {
            fontSize: '27px',
            fill: '#000000', wordWrap: {
                width: 580,
                useAdvancedWrap: true
            },
            fontFamily: 'laviFont'
        }).setOrigin(0.5)
        //storyText.scale = 0.5

        //create the places where the text locks into place
        this.slotPositions.forEach((pos, index) => {
            let zone = this.add.zone(pos.x, pos.y, 140, 50).setRectangleDropZone(140, 50)
            zone.setData('slotIndex', index)
            
            // Visual outline for testing
            //this.add.graphics().lineStyle(2, 0xffffff).strokeRect(pos.x - 70, pos.y - 25, 140, 50)
        })



        //create result sprite
        this.resultSprite = this.add.sprite(width / 2, height-height/6, 'resultImg2', 0);
        this.resultSprite.setVisible(false);

        //create text objects
        this.texts = [this.create_dragable_text(0, width/4, 3*height/4), this.create_dragable_text(1, width/2, 3*height/4), this.create_dragable_text(2, 3*width/4, 3*height/4)]
        

        //setting what happends when drag and drop
        this.input.on('dragenter', (pointer, gameObject, dropZone) => {
            const slotIdx = dropZone.getData('slotIndex');
            if (this.slotStatus[slotIdx] === -1) {
                this.tweens.add({
                    targets: gameObject,
                    scale: 1.2,
                    duration: 100,
                    ease: 'Back.easeOut'
                })
            }
        })
        this.input.on('dragleave', (pointer, gameObject, dropZone) => {
            this.tweens.add({
                targets: gameObject,
                scale: 1,
                duration: 100,
                ease: 'Back.easeOut'
            })
        });
        this.input.on('dragstart', (pointer, gameObject) => {
            gameObject.setData('startX', gameObject.x)
            gameObject.setData('startY', gameObject.y)
            const wordIdx = gameObject.getData('wordIndex')
            const currentSlot = this.slotStatus.indexOf(wordIdx)
            if (currentSlot !== -1) {
                this.slotStatus[currentSlot] = -1
                this.updateResultSprite()
                this.removeSFX.play()
            }

            gameObject.body.setAllowGravity(false)
            gameObject.body.setVelocity(0, 0)
        })
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX
            gameObject.y = dragY
            
            this.dragParticles[gameObject.getData('wordIndex')].emitParticleAt(gameObject.x, gameObject.y, 1)
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
            
            //effects
            this.placeSFX.play()
            let tweenChain = this.tweens.chain({
                targets: gameObject,
                ease: 'Back.easeOut',
                tweens : [
                    {
                        scale: 1.4,
                        duration: 100,
                    },
                    {
                        scale: 1,
                        duration: 60,
                    }
                ]
            })
            tweenChain.play()
        })
    }


    create_dragable_text(word_index, input_x, input_y) {
        //create text
        let newText = this.add.text(input_x, input_y, this.words[word_index], {
            fontSize: '20px',
            fill: '#2b5259',
            fontFamily: 'architectsDaughterFont'
        }).setInteractive({useHandCursor: true})
        newText.setOrigin(0.5)

        //add metadata
        newText.setData('wordIndex', word_index)

        //create paricle
        let particleKey = 'particle' + word_index.toString();
        if (!this.textures.exists(particleKey)) {
            let tempText = this.add.text(0, 0, this.words[word_index], {
                fontSize: '20px',
                fill: '#2b5259', // Use full white here; use particle 'tint' for transparency
                fontFamily: 'architectsDaughterFont'
            }).setVisible(false); // Hide it immediately
        this.textures.addCanvas(particleKey, tempText.canvas);
        tempText.destroy();
        }
        this.dragParticles[word_index] = this.add.particles(0, 0, particleKey, {
            speed: 0,
            scale: 1,
            blendMode: 'NORMAL',
            lifespan: 100,
            alpha: {start: 0.1, end: 0},
            emitting: false,
        })

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
                this.isFullCur = true
                this.imageChangeStateSFX.play()
            }
        } else {
            this.resultSprite.setVisible(false);
            this.flipButton.setVisible(false)
            if (this.isFullCur) {
                this.imageChangeStateSFX.play()
                this.isFullCur = false
            }
        }
    }
}