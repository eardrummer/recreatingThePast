
// Variables for drawing

// the boundaries of the main square frame for the drawing
var startX, startY, finishX, finishY;

// the amount of border space
var borderSize = 0.2; // Number less than 1

// other variables
var maxSize;
var gridSize = 6;
var r, prev_r = -1;
var sideLength, colorCounter;

// For Storing all the vertices for drawing after computing
var vertexArray = [];

// For Storing the color chosen for each shape unit
var colorArray = [];

// drawMode is 0 for constantly drawing a piece,
// drawMode = 1 for drawing each color at a time and  // On clicking Emotion
// drawMode = 2 for drawing each line of each shape at a time. // On clicking Method
var drawMode = 0;

// Flags for knowing when you have entered each mode
var mode1Flag = 0, mode2Flag = 0;

// counters for each mode. c for counting how many colors to print,
// kMethod is for counting how many lines to draw for each shape
var c=0, kMethod=0;;

//var colors = ['red','blue','green','yellow','magenta','purple', 'white'];
var colors = ['#a81703','#769EE6','#3B6728','#AC9600','#7265BD','#8A55A5','#AEBCC9']

function setup() {
	createCanvas(windowWidth, windowHeight);
}



function draw() {

	if(drawMode == 0){

			// Choosing a slow 1 frame per sec in normal mode, so the picture changes every second
			frameRate(1);
	}

	background(0);

	fill(255)
	noStroke();
	textSize(20)


	// Text stuff
	// Also changes text color for when you click on Method or Emotion
	if(drawMode == 0){
	fill(255);
	text("Dialog between Emotion and Method", 190, 60)
  }
	else if(drawMode == 1){
		fill(150);
		text("Dialog between", 190, 60)
		text(" and Method", 408, 60)

		fill(255)
		text(" Emotion", 328, 60)
	}
	else if(drawMode == 2){
		fill(150);
		text("Dialog between", 190, 60)
		text(" Emotion and", 328, 60);
		fill(255)
		text(" Method", 445, 60);
	}

	text("- Recreating Vera Molnar", 340, 660)


	// Choosing the size of the entire drawing and the corners - startX, startY, finishX, finishY
	if(windowWidth < windowHeight)
		{
			maxSize = windowWidth
		}
	else {
		maxSize = windowHeight
	}

	startX = borderSize * (maxSize);
	finishX = (1-borderSize) * (maxSize);
	startY = borderSize * maxSize;
	finishY = (1-borderSize) * maxSize;

	sideLength = (finishX - startX)/gridSize;


	// 0. Simple Mode where vertices are computed every time and drawn at each i,j
	if(drawMode == 0){


				computeVertices(); // function that computes all vertices and colors. See definition below

				noFill();
				strokeWeight(2.5); // thickness of the lines
				for(let i = 0; i < gridSize; i++){
					for(let j = 0; j < gridSize; j++){

						stroke(colorArray[i][j]) // choosing the color
						beginShape();

						// 8 sets of 4 vertices going around 8 times for each shape.
						for(let k = 0; k < 8*4; k++){
							vertex(vertexArray[i][j][k].x, vertexArray[i][j][k].y);
						}
						endShape(CLOSE);
					}
				}

				 // noLoop()
	}

	// 1. Emotion mode, for drawing each color at a time.
	else if(drawMode == 1){

		// compute the vertices only once.
		if(mode1Flag == 1){
			computeVertices();
			frameRate(1);
			mode1Flag = 0;
		}

		noFill();
		strokeWeight(2.5);

		// Loop for each color
		if(c < 6){

			// Draw all the colors so far. 1st only 1 color, then 2 colors etc.
			for(let ci = 0; ci <= c; ci++){
				for(let i = 0; i < gridSize; i++){
					for(let j = 0; j < gridSize; j++){

							if(colorArray[i][j] == colors[ci]){
								stroke(colorArray[i][j])
								beginShape();

								for(let k = 0; k < 8*4; k++){
									vertex(vertexArray[i][j][k].x, vertexArray[i][j][k].y);
								}
								endShape(CLOSE);

						}
					}
					}
				}
		 c++;  // Update the number of colors to draw for the next frame.
		}

		// If finished drawing all colors, draw the entire shape once and return to normal mode.
    else{

			for(let i = 0; i < gridSize; i++){
				for(let j = 0; j < gridSize; j++){
						stroke(colorArray[i][j])
						beginShape();

						for(let k = 0; k < 8*4; k++){
							vertex(vertexArray[i][j][k].x, vertexArray[i][j][k].y);
						}
						endShape(CLOSE);
				}
			}
			drawMode = 0;
		}
	}

	// 2. Method mode for drawing one line for each shape at a time.
	else if(drawMode == 2){

		// compute the vertices only once.
		if(mode2Flag == 1){
			computeVertices();
			frameRate(5);
			mode2Flag = 0;
		}

		// IF finished drawing all the lines for each shape, draw the entire picture once
		// and go back to Normal mode.
		if(kMethod == 8*4){

			noFill();
			for(let i = 0; i < gridSize; i++){
				for(let j = 0; j < gridSize; j++){
						stroke(colorArray[i][j])
						beginShape();

						for(let k = 0; k < 8*4; k++){
							vertex(vertexArray[i][j][k].x, vertexArray[i][j][k].y);
						}
						endShape(CLOSE);
				}
			}

			drawMode = 0;
		}

		// Draw one line at a time.
		else{
			noFill();
			strokeWeight(2.5);
			for(let i = 0; i < gridSize; i++){
				for(let j = 0; j < gridSize; j++){

					stroke(colorArray[i][j])
					beginShape();

					for(let k = 0; k <= kMethod; k++){
						vertex(vertexArray[i][j][k].x, vertexArray[i][j][k].y);
					}
					endShape();
				}
			}

		}
		kMethod++; // Update the number of lines to be drawn in the next frame.
	}
}


// Main function that computes all the vertices and colors per shape.
function computeVertices(){

	// Assigns a big array which stores all vertex informations

	colorCounter = [0,0,0,0,0,0,0]
	for(let i = 0; i < gridSize; i++){
		vertexArray[i] = [];
		colorArray[i] = [];
		for(let j = 0; j < gridSize; j++){

				// Choose colors; *************************************

							while(1){
								r = int(random(0,7));

								// 90% of the time pick a color different from the last one
								if(r == prev_r && (noise(1) < .9)){
									continue;
								}

								// Keeping an upper limit on number of times a color appears
								if(colorCounter[r] > 5){
									continue;
								}
								else{
									colorCounter[r]++;
									prev_r = r;
									break;
								}
							}
						colorArray[i][j] = colors[r];
				// End of Color choice! ************************************

			// Choose Vertices ********************************************
			vertexArray[i][j] = [];
					for(let k = 0; k < 8; k++){

							let unitStartX = startX + (i*sideLength)
							let unitStartY = startY + (j*sideLength)


							// Random Gaussian Experiment
							weight = 1;
							let m = 5, std = 15; // positive shifted gaussian.

							let v1 = createVector(unitStartX + (weight * randomGaussian(m, std)), unitStartY + (weight * randomGaussian(m, std)));
							let v2 = createVector(unitStartX + sideLength - (weight * randomGaussian(m, std)), unitStartY + (weight * randomGaussian(m, std)));
							let v3 = createVector(unitStartX + sideLength - (weight * randomGaussian(m, std)), unitStartY + sideLength - (weight * randomGaussian(m, std)));
							let v4 = createVector(unitStartX + (weight * randomGaussian(m, std)), unitStartY + sideLength - (weight * randomGaussian(m, std)));

							vertexArray[i][j][4*k+0] = v1;
							vertexArray[i][j][4*k+1] = v2;
							vertexArray[i][j][4*k+2] = v3;
							vertexArray[i][j][4*k+3] = v4;

						}

		}
	}
}


// Changing mode when mouse is pressed inside the region of the text "Method" or "Emotion"
function mousePressed(){

	if(mouseY > 45 && mouseY < 55){
		if(mouseX > 330 && mouseX < 410){
			drawMode = 1; // Emotion mode
			//console.log('1')
			mode1Flag = 1;
			c = 0;
		}
		else if(mouseX > 450 && mouseX < 520 ){
			drawMode = 2; // Method mode
			//console.log('2')
			mode2Flag = 1;
			kMethod = 0;
		}
	}
	else{
		drawMode = 0;
		mode1Flag = 0;
		mode2Flag = 0;
	}
}
