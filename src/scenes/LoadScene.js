class LoaderScene extends Phaser.Scene {
    
    //used to preload all assets into the system
    
    constructor() {
        super('loaderScene')
    }


    preload() {
        //load all images
        this.load.image('cardFrontImg', './assets/images/postcard.png')
        this.load.spritesheet('resultImg', './assets/images/result.png', { frameWidth: 300, frameHeight: 100 })
        this.load.spritesheet('resultImg2', './assets/images/result2.png', { frameWidth: 300, frameHeight: 100 })
        this.load.image('flipButton', 'assets/images/flip_over.png')
        this.load.image('cardBackImg', 'assets/images/postcard_back.png')
        this.load.image('particleImg', 'assets/images/plain-circle.png')

        //load sounds
        this.load.audio('placeSFX', 'assets/audio/place_word.wav')
        this.load.audio('removeSFX', 'assets/audio/remove_word.wav')
        this.load.audio('imageChangeStateSFX', 'assets/audio/apear_and_disapear.wav')

        //load fonts
        this.load.font('architectsDaughterFont', 'assets/fonts/ArchitectsDaughter.ttf')
        this.load.font('laviFont', 'assets/fonts/Lavi.ttf')
    }

    create() {
        this.scene.start('cardFrontScene1')
    }
}