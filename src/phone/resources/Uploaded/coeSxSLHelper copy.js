
const PIXELS_PER_METER = 3779.5275591; 

class coeSxSLHelper {
    #debug;
    #imageLoaded;
    #imageScale;
    #meterW;
    #meterH;
    canvas;
    ctx;
    
    //Constructor Method for the class
    // Parameter #1 = Scale factor.
    // Parameter #2 = Debug options. if debugMode is not passed in, it defaults to "false"
    constructor(is =0.9, debugMode = false, meterW, meterH){
        this.#imageScale = is;
        this.#debug = debugMode;
        this.#imageLoaded = false;
        this.meterW = meterW;
        this.meterH = meterH;
        this.canvas = this.createCanvas(this.meterW, this.meterH)     //Parameters are in METERS
        this.ctx = this.canvas.getContext("2d");
        this.setupCanvasGraphics();
    }

    setLoaded (b){
        //This function is called at the end of the image onloaded event
        //it helps determine what needs to be processed if we "erase" and image
        //and put a new one in it's place.  It cuts down on secondary processing.
        this.#imageLoaded = b;
    }

    getLoaded (){
        //Returns the private variable "imageLoaded"
        return this.#imageLoaded;
    }

    setDebug (b){
        //This sets the private variable "debug" which is used to draw a background color
        //and board on the canvas.  This can be helpful if the size and position of the canvas
        //needs to be adjusted.
        this.#debug = b;
    }

    getDebug (b){
        return this.#debug;
    }

    //Main Iterface method to adjust and place an image on a canvas
    //Parameter 1 = Image
    scaleImage (i, s) {        
        //If an Image has been loaded.  we need to clear the canvas. 
        //If we want the color background and board we need to setupCanvasGraphics again.
        if (this.getLoaded()){
            this.ctx.clearRect(0,0,this.canvas.height,this.canvas.width);
            if (this.getDebug()) {this.setupCanvasGraphics();}
        }

        this.setupBackgroundImage( i);    
        return this.canvas;
    }
   
    createCanvas (w, h) {
        var can = document.createElement("canvas");
        //Convert width to Pixels.  Studio based in Meters
        can.width = (w * PIXELS_PER_METER) * window.devicePixelRatio;
        can.height = (h * PIXELS_PER_METER) * window.devicePixelRatio;
        return can;
    }
    
    setupCanvasGraphics () {
        //Use this to create custom HTML Canvas graphics
        //This can also be used to present a backgroun & Border on 
        //the canvas to provide a sense of size / position
        let db = this.getDebug();
        if (db) {
            //The code below will add a background and Border
            this.ctx.fillStyle = "rgba(120, 255, 100, 0.5)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            //Border Code -- If needed
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 5;
            this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    getCTX () {
        return this.ctx
    }

    setupBackgroundImage ( imgsrc) {
        
        let cw = this.canvas.width;                     
        let ch = this.canvas.height;
        let ib = new Image();
        let is = this.#imageScale
        var _this = this;
        let iah = 0.5;  // iah = image Horizontal Alignment ( .5 = center)
        let iav = 0.5;  // iav = image Vertical Alignment ( .5 = center)  
        ib.src = imgsrc;
        ib.onload = function () {
            //is = Image Scale
            var IScale = (Math.min(cw / ib.width, ch / ib.height) * is);
            var cpx = 0;    //Canvas Point X
            var cpy = 0;    //Canvas Point Y    
            var xpos, ypos, iwdh, ihgt;
            cpx = cw * iah;   
            cpy = ch * iav;
            xpos = cpx - ((ib.width * IScale) / 2);
            ypos = cpy - ((ib.height * IScale) / 2);    
            iwdh = (ib.width * IScale);
            ihgt = (ib.height * IScale);                    
            _this.ctx.drawImage(ib, xpos, ypos, iwdh, ihgt);
            _this.setLoaded (true);
        }
    }
}