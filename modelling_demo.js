var gl;

var canvas;

// GLSL programs
var program;

// Render Mode
var WIREFRAME=1;
var FILLED=2;
var renderMode = WIREFRAME;

var projection;
var modelView;
var view;

var axo_gamma, axo_theta, x, z, angG, angB, angY, angW, dC, step;

matrixStack = [];

function pushMatrix()
{
    matrixStack.push(mat4(modelView[0], modelView[1], modelView[2], modelView[3]));
}

function popMatrix() 
{
    modelView = matrixStack.pop();
}

function multTranslation(t) {
    modelView = mult(modelView, translate(t));
}

function multRotX(angle) {
    modelView = mult(modelView, rotateX(angle));
}

function multRotY(angle) {
    modelView = mult(modelView, rotateY(angle));
}

function multRotZ(angle) {
    modelView = mult(modelView, rotateZ(angle));
}

function multMatrix(m) {
    modelView = mult(modelView, m);
}
function multScale(s) {
    modelView = mult(modelView, scalem(s));
}

function initialize() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0,0,canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    
    program = initShaders(gl, "vertex-shader-2", "fragment-shader-2");
    
    cubeInit(gl);
    sphereInit(gl);
    cylinderInit(gl);
    
    setupProjection();
    setupView();
	
	//Init Variables
	step = 0.05;
	document.getElementById("axo_gamma").value = (axo_gamma = ((Math.asin(Math.sqrt(Math.tan(radians(42))*Math.tan(radians(7))))) * 180.0)/Math.PI);
    document.getElementById("axo_theta").value = (axo_theta = ((Math.atan(Math.sqrt(Math.tan(radians(42))/Math.tan(radians(7))))-(Math.PI/2)) * 180.0)/Math.PI);
	document.getElementById("x").value = (x = 0);
	document.getElementById("z").value = (z = 0);
	document.getElementById("angG").value = (angG = 0);
	document.getElementById("angB").value = (angB = 0);
	document.getElementById("angY").value = (angY = 0);
	document.getElementById("angW").value = (angW = 0);
	document.getElementById("dC").value = (dC = 0.25);
	
	//Add Event Listeners
	document.getElementById("axo_gamma").addEventListener("input", onAxoGammaSlide);
    document.getElementById("axo_theta").addEventListener("input", onAxoThetaSlide);
    document.getElementById("x").addEventListener("input", onXSlide);
    document.getElementById("z").addEventListener("input", onZSlide);
    document.getElementById("angG").addEventListener("input", onAngGSlide);
    document.getElementById("angB").addEventListener("input", onAngBSlide);
    document.getElementById("angY").addEventListener("input", onAngYSlide);
    document.getElementById("angW").addEventListener("input", onAngWSlide);
    document.getElementById("dC").addEventListener("input", onDCSlide);
	window.addEventListener("keydown", onKeyDown);
}

function setupProjection() {
    projection = ortho(-10, 10, -5, 15, -15, 15);
}

function setupView() {
    view = mult(rotateX(axo_gamma), rotateY(axo_theta));
    modelView = mat4(view[0], view[1], view[2], view[3]);
}

function setMaterialColor(color) {
    var uColor = gl.getUniformLocation(program, "color");
    gl.uniform3fv(uColor, color);
}

function sendMatrices()
{
    // Send the current model view matrix
    var mView = gl.getUniformLocation(program, "mView");
    gl.uniformMatrix4fv(mView, false, flatten(view));
    
    // Send the normals transformation matrix
    var mViewVectors = gl.getUniformLocation(program, "mViewVectors");
    gl.uniformMatrix4fv(mViewVectors, false, flatten(normalMatrix(view, false)));  

    // Send the current model view matrix
    var mModelView = gl.getUniformLocation(program, "mModelView");
    gl.uniformMatrix4fv(mModelView, false, flatten(modelView));
    
    // Send the normals transformation matrix
    var mNormals = gl.getUniformLocation(program, "mNormals");
    gl.uniformMatrix4fv(mNormals, false, flatten(normalMatrix(modelView, false)));  
}

function draw_sphere(color)
{
    setMaterialColor(color);
    sendMatrices();
    sphereDrawFilled(gl, program);
}

function draw_cube(color)
{
    setMaterialColor(color);
    sendMatrices();
    cubeDrawFilled(gl, program);
}

function draw_cylinder(color)
{
    setMaterialColor(color);
    sendMatrices();
    cylinderDrawFilled(gl, program);
}

function draw_scene()
{    
    pushMatrix();
        multScale([8,0.01,8]);
        multTranslation([0,-0.5,0]);
        draw_cube([1,1,1]); //base
    popMatrix();
    multTranslation([x,0,z]);
    pushMatrix();
        multScale([3,0.5,3]);
        multTranslation([0,0.5,0]);
        draw_cube([1,0,0]); //cube_r_1
    popMatrix();
    multTranslation([0,0.5,0]);
    multRotY(angG);
    pushMatrix();
        multScale([1.5,0.65,1.5]);
        multTranslation([0,0.5,0]);
        draw_cylinder([0,1,0]); //cylinder_g
    popMatrix();
    multTranslation([0,0.65,0]);
    pushMatrix();
        multScale([0.65,1.5,0.65]);
        multTranslation([0,0.5,0]);
        draw_cube([1,0,0]); //cube_r_2
    popMatrix();
    multTranslation([0,1.5,0]);
    multRotZ(angB);
    pushMatrix();
        multRotX(90);
        draw_cylinder([0,0,1]); //cylinder_b
    popMatrix();
    pushMatrix();
        multScale([0.65,2.5,0.65]);
        multTranslation([0,0.5,0]);
        draw_cube([1,0,0]); //cube_r_3
    popMatrix();
    multTranslation([0,2.5,0]);
    multRotZ(angY);
    pushMatrix();
        multRotX(90);
        draw_cylinder([1,1,0]); //cylinder_y
    popMatrix();
    pushMatrix();
        multScale([0.65,3.5,0.65]);
        multTranslation([0,0.5,0]);
        draw_cube([1,0,0]); //cube_r_4
    popMatrix();
    multTranslation([0,3.5,0]);
    multRotY(angW);
    pushMatrix();
        multScale([2,0.75,2]);
        multTranslation([0,0.5,0]);
        draw_cylinder([1,1,1]); //cylinder_w
    popMatrix();
    multTranslation([0,0.75,0]);
    pushMatrix();
        multTranslation([-dC,0,0]);
        multScale([0.30,1.65,0.5]);
        multTranslation([-0.5,0.5,0]);
        draw_cube([1,1,0]); //cube_y_1
    popMatrix();
    multTranslation([dC,0,0]);
    multScale([0.30,1.65,0.5]);
    multTranslation([0.5,0.5,0]);
    draw_cube([1,1,0]); //cube_y_2
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);
    
    setupView();
    
    // Send the current projection matrix
    var mProjection = gl.getUniformLocation(program, "mProjection");
    gl.uniformMatrix4fv(mProjection, false, flatten(projection));
        
    draw_scene();
    
    requestAnimFrame(render);
}


window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl) { alert("WebGL isn't available"); }
    
    initialize();
            
    render();
}

function onAxoGammaSlide(event){
	axo_gamma = event.target.value;
	console.log("[Axo_Gamma Slide] axo_gamma: "+axo_gamma); //DEBUG
}

function onAxoThetaSlide(event){
	axo_theta = event.target.value;
	console.log("[Axo_Theta Slide] axo_theta: "+axo_theta); //DEBUG
}

function onXSlide(event){
	x = event.target.value;
	console.log("[X Slide] x: "+x); //DEBUG
}

function onZSlide(event){
	z = event.target.value;
	console.log("[Z Slide] z: "+z); //DEBUG
}

function onAngGSlide(event){
	angG = event.target.value;
	console.log("[Ang_G Slide] angG: "+angG); //DEBUG
}

function onAngBSlide(event){
	angB = event.target.value;
	console.log("[Ang_B Slide] angB: "+angB); //DEBUG
}

function onAngYSlide(event){
	angY = event.target.value;
	console.log("[Ang_Y Slide] angY: "+angY); //DEBUG
}

function onAngWSlide(event){
	angW = event.target.value;
	console.log("[Ang_W Slide] angW: "+angW); //DEBUG
}

function onDCSlide(event){
	dC = event.target.value;
	console.log("[D_C Slide] dC: "+dC); //DEBUG
}

function onKeyDown(event){
    switch (event.keyCode){
        case 81:
			if((angG - 50*step) >= -180){
				document.getElementById("angG").value = (angG -= 50*step);
			}
            console.log("[Key Down - Q] angG: "+angG); //DEBUG
            break;
        case 87:
            if ((angG + 50*step) <= 180){
                document.getElementById("angG").value = (angG += 50*step);
            }
            console.log("[Key Down - W] angG: "+angG); //DEBUG
            break;
		case 90:
			if((angB - 50*step) >= -95){
				document.getElementById("angB").value = (angB -= 50*step);
			}
            console.log("[Key Down - Z] angB: "+angB); //DEBUG
            break;
        case 88:
            if ((angB + 50*step) <= 95){
                document.getElementById("angB").value = (angB += 50*step);
            }
            console.log("[Key Down - X] angB: "+angB); //DEBUG
            break;
		case 65:
			if((angY - 50*step) >= -95){
				document.getElementById("angY").value = (angY -= 50*step);
			}
            console.log("[Key Down - A] angY: "+angY); //DEBUG
            break;
        case 83:
            if ((angY + 50*step) <= 95){
                document.getElementById("angY").value = (angY += 50*step);
            }
            console.log("[Key Down - S] angY: "+angY); //DEBUG
            break;	
		case 75:
			if((angW - 50*step) >= -180){
				document.getElementById("angW").value = (angW -= 50*step);
			}
            console.log("[Key Down - K] angW: "+angW); //DEBUG
            break;
        case 76:
            if ((angW + 50*step) <= 180){
                document.getElementById("angW").value = (angW += 50*step);
            }
            console.log("[Key Down - L] angW: "+angW); //DEBUG
            break
		case 79:
			if((dC - step) >= 0){
				document.getElementById("dC").value = (dC -= step);
			}
            console.log("[Key Down - O] dC: "+dC); //DEBUG
            break;
        case 80:
            if ((dC + step) <= 0.5){
                document.getElementById("dC").value = (dC += step);
            }
            console.log("[Key Down - P] dC: "+dC); //DEBUG
            break;
		case 37:
			if((x - step) >= -2.5){
				document.getElementById("x").value = (x -= step);
			}
            console.log("[Key Down - Left] x: "+x); //DEBUG
            break;
        case 39:
            if ((x + step) <= 2.5){
                document.getElementById("x").value = (x += step);
            }
            console.log("[Key Down - Right] x: "+x); //DEBUG
            break;
		case 38:
			if((z - step) >= -2.5){
				document.getElementById("z").value = (z -= step);
			}
            console.log("[Key Down - Up] z: "+z); //DEBUG
            break;
        case 40:
            if ((z + step) <= 2.5){
                document.getElementById("z").value = (z += step);
            }
            console.log("[Key Down - Down] z: "+z); //DEBUG
            break;
        case 84:
            if((axo_gamma - 50*step) >= -180){
                document.getElementById("axo_gamma").value = (axo_gamma -= 50*step);
            }
            console.log("[Key Down - T] axo_gamma: "+axo_gamma); //DEBUG
            break;
        case 71:
            if ((axo_gamma + 50*step) <= 180){
                document.getElementById("axo_gamma").value = (axo_gamma += 50*step);
            }
            console.log("[Key Down - G] axo_gamma: "+axo_gamma); //DEBUG
            break;
        case 78:
            if((axo_theta - 50*step) >= -180){
                document.getElementById("axo_theta").value = (axo_theta -= 50*step);
            }
            console.log("[Key Down - N] axo_theta: "+axo_theta); //DEBUG
            break;
        case 77:
            if ((axo_theta + 50*step) <= 180){
                document.getElementById("axo_theta").value = (axo_theta += 50*step);
            }
            console.log("[Key Down - M] axo_theta: "+axo_theta); //DEBUG
            break;
        default:
            console.log("[Key Down - "+event.keyCode+"]"); //DEBUG
            break;
    }
}