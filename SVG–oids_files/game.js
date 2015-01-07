// SVG-oids

// Globals
var ScreenWidth = 800;
var ScreenHeight = 600;

// FPS Counter
var frameCount = 0;
var lastFPSUpdateTime = 0;
var paused = false

// SVG
var svgns = "http://www.w3.org/2000/svg";       // SVG Namespace

var svgDocument;                                // Global SVG doc
// SVG-iods
var meteor;
var groupPath;
// SVG-iods
var meteorSpeedLarge = .5;
var meteorSpeedMedium = 1;
var meteorSpeedSmall = 1.5;
var meteorDataLarge = []; // Array to hold data about large meteors
var meteorDataMedium = []; // Array to hold data about large meteors
var groupDataTwin = []

// Levels
var showSplashScreen = true;
var introTime = 50; // Number of frames to display intro/level change
var introTimeElapsed = 0;
var newLevelInitialized = false;
var gameStarted = false;


/////// AsteroidData Class
/////// This thing just holds precomputed data for rendering
/////// meteors of different sizes.
function AsteroidData ()
{
    this.path;
    this.centroidOffset;
    this.radius;
    this.speed;
    this.typeArray;
}

/////// END AsteroidData Class
///////
///////

/////// Asteroid Class
///////
///////
function Asteroid(meteorData, initialPosition)
{
    this.position = new Vector2(0,0,0,0);
    this.direction = new Vector2(0,0,0,0);
    this.direction.makeRandomDirection();
    this.data = meteorData;
    this.element;
    this.rotation = 0;
    if (this.data.typeArray == meteorDataLarge) {
        this.data.speed = meteorSpeedLarge;
        this.rotationIncrement = .08;
    }
    else if (this.data.typeArray == meteorDataMedium) {
        this.data.speed = meteorSpeedMedium;
        this.rotationIncrement = 1.2;
    }
    else {
        this.data.speed = meteorSpeedSmall;
        this.rotationIncrement = 4;
    }
    if (Math.random() > .5) { this.rotationIncrement *= -1; }

    this.renderAndMove = _AsteroidRenderAndMove;

        
    var svgs = document.getElementsByTagName("svg");
    var svg = svgs[0];    
    svgDocument = svg.ownerDocument;

    // Place the meteor randomly without blowing up the ship.
    if (initialPosition == undefined) {
            this.position.x = Math.floor(Math.random()*ScreenWidth);
            this.position.y = Math.floor(Math.random()*ScreenHeight);
    }

    else {
        this.position = initialPosition;
    }

	this.element = svgDocument.createElementNS(svgns, "path");
	this.element.setAttributeNS(null, "fill", "white");
	this.element.setAttributeNS(null, "stroke", "#6d6868");
	this.element.setAttributeNS(null, "stroke-width", "1");
	this.element.setAttributeNS(null, "stroke-opacity", "1");
	this.element.setAttributeNS(null, "display", "none");	
	this.element.setAttributeNS(null, "d", this.data.path); // added for direct transforms
    svg.insertBefore(this.element, document.getElementById("clippy"));
}


function _AsteroidRenderAndMove()
{
    this.rotation = this.rotation + this.rotationIncrement;
	this.position = this.position.add(this.direction.smult(this.data.speed));
    this.element.setAttributeNS(null, "transform",
                                "rotate(" + 
                                this.rotation + "," + 
                                (this.position.x + this.data.centroidOffset.x) + "," +
                                (this.position.y + this.data.centroidOffset.y) + ")" + 
								" " +
								"translate(" +
								this.position.x + "," +
								this.position.y + ")"								
								);
    this.element.setAttributeNS(null, "display", "inherit");
    
    // Do screen wrapping
    this.position = ScreenWrap(this.position, this.data.radius * 2);
}
/////// END Asteroid Class
///////
/// Group

function GroupData ()
{
    this.element;
    this.centroidOffset;
    this.radius;
    this.speed;
    this.typeArray;
}
function Group(groupData, initialPosition)
{
    this.position = new Vector2(0,0,0,0);
    this.direction = new Vector2(0,0,0,0);
    this.direction.makeRandomDirection();
    this.data = groupData;
    this.element;
    this.rotation = 0;
    this.data.speed = meteorSpeedLarge;
    this.rotationIncrement = 1.2;


    this.renderAndMove = _GroupRenderAndMove;


    var svgs = document.getElementsByTagName("svg");
    var svg = svgs[0];
    svgDocument = svg.ownerDocument;

    // Place the meteor randomly without blowing up the ship.
    if (initialPosition == undefined) {
        this.position.x = Math.floor(Math.random()*ScreenWidth);
        this.position.y = Math.floor(Math.random()*ScreenHeight);
    }

    else {
        this.position = initialPosition;
    }

    this.element = svgDocument.getElementById("twin");
}
function _GroupRenderAndMove()
{
    this.rotation = this.rotation + this.rotationIncrement;
    this.position = this.position.add(this.direction.smult(this.data.speed));
    this.element.setAttributeNS(null, "transform",
        "rotate(" +
        this.rotation + "," +
        (this.position.x + this.data.centroidOffset.x) + "," +
        (this.position.y + this.data.centroidOffset.y) + ")" +
        " " +
        "translate(" +
        this.position.x + "," +
        this.position.y + ")"
    );
    this.element.setAttributeNS(null, "display", "inherit");

    // Do screen wrapping
    this.position = ScreenWrap(this.position, this.data.radius * 2);
}
////// Global Functions

function ScreenWrap(pos, border)
{
    if (border == undefined) { border = 0; }
    if ((pos.x + border) > ScreenWidth) {
        pos.x = 0;
    }
    if (pos.x < 0) {
        pos.x = ScreenWidth - border;
    }
    if ((pos.y + border) > ScreenHeight) {
        pos.y = 0;
    }
    if (pos.y < 0) {
        pos.y = ScreenHeight - border;
    }    
    return pos;
}


function KeyPress(key)
{
	if (key.keyCode == 32 )
		key.preventDefault();
}

function pauseOrPlay()
{
    paused = !paused;
    var s = document.getElementById("clippy");
    if(paused) {

        s.setAttribute("xlink:href", "play.png");
    } else {
        s.setAttribute("xlink:href","pause.png");
    }
}
function KeyDown(key)
{
	var code;
	if (window.event == undefined) {
		var code = key.keyCode;
	}
	else {
		code = window.event.keyCode;
	}
    if(code == 32) {
        pauseOrPlay();
    }
	key.preventDefault();
}


function KeyUp(key)
{
	var code;

    if (window.event == undefined) {
		var code = key.keyCode;
//		key.returnValue = false;
//		key.preventDefault();
	}
	else {
		code = window.event.keyCode;
	}
    //return ToggleKey(code, false, key);
}


function InitializeAsteroidData ()
{

    ast = new AsteroidData();
    ast.path = "M0,0 l14,7 l11,-13 l12,9 l15,-9 l12,20 l15,0 l-12,17 l17,16 l-5,27 l-29,-8 l-3,22 l-24,-17 l-27,-14 l8,-21 l8,-18 z";
    ast.centroidOffset = new Vector2(0,0,36,39);
    ast.radius = 41;
    ast.typeArray = meteorDataLarge;
    meteorDataLarge.push(ast);

}
function InitializeGroupData ()
{

    ast = new GroupData();
    ast.element = document.getElementById("twin");
    ast.centroidOffset = new Vector2(0,0,36,39);
    ast.radius = 41;
    ast.typeArray = meteorDataLarge;
    groupDataTwin.push(ast);

}
function RenderDestroyableObjects(objects)
{
    // All of these objects must implement:
    // Properties:
    //          numMovesRemaining -- This is just a refcount. When it reaches 0, 
    //                               it will be destroyed and removed here.
    // Methods:
    //          renderAndMove()
    //          destroy()
    // 
    objects.renderAndMove();
}

function UpdateFPS()
{
	var d = new Date();
	var currentTime = d.getTime();
	var dt = currentTime - lastFPSUpdateTime;
	lastFPSUpdateTime = currentTime;
	frameCount = 0;
}

function StartGame()
{
    ScreenWidth = document.getElementById("svgroot").width.baseVal.value;
    ScreenHeight = document.getElementById("svgroot").height.baseVal.value;

    setInterval(MainLoop, 12);
    setInterval(UpdateFPS, 500);
    // Global keyboard event handlers
	document.addEventListener("keydown", KeyDown, true);
	document.addEventListener("keyup", KeyUp, true);
	document.addEventListener("keypress", KeyPress, false);
    InitializeAsteroidData();
    InitializeGroupData();
    groupPath = new Group(groupDataTwin[0]);
    meteor=new Asteroid(meteorDataLarge[0]);

 }

function HandleLevelChange()
{   
    // This function handles the intro, level changes, and endgame
    
    // This is the degenerate case (intro) at the beginning of the game
    if (showSplashScreen) {
        introTimeElapsed++;
        // The game has just started.
        if (introTimeElapsed < introTime) {
            return true; //keep blocking
        }
        else if (introTimeElapsed > introTime && introTimeElapsed < 2*introTime)
        {
            // Make sure that the text renders on top of the meteors by
            // moving the text element to the bottom of the doc
            // Remove title text, display level text
            var svgs = document.getElementsByTagName("svg");
            var svg = svgs[0];
            return true;
        }
        else if (introTimeElapsed > 2*introTime) {
            // Go!
            introTimeElapsed = 0;
            gameStarted = true;
            showSplashScreen = false;
            return false; // allow the gameloop to run.
        }
    }
    else if (introTimeElapsed >= introTime)
    {        
        // GO!
        introTimeElapsed = 0;
        newLevelInitialized = false;
        gameStarted = true;
        return false;
    }
    return false; // No level change code.
}

function MainLoop()
{
    if(!paused) {
        frameCount++;

        if (HandleLevelChange()) {
            // Block the mainloop from running until we're ready to go.
            return;
        }
        // Compute user input
        RenderDestroyableObjects(meteor);
        RenderDestroyableObjects(groupPath);
    }
}

