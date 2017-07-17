
var renderer,camera,scene,miniRenderer, miniViewCamera,sphere,ambientLight,directionalLight, sunlight;
var angle = 0,probe1a,probe1b, orbitscale;

clock = new THREE.Clock();

window.onload = function() {
  init();
  animate();
};


function init() {
  //Main renderer
  c = document.getElementById("3dworld");
  renderer = new THREE.WebGLRenderer({canvas:c});
  renderer.setSize(c.width, c.height);

  //Mini view renderer
  minic = document.getElementById("mini3dworld");
  miniRenderer = new THREE.WebGLRenderer({canvas:minic});
  miniRenderer.setSize(minic.width, minic.height);

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1e7);
  camera.position.z = 0;
  camera.position.x = 0;
  camera.position.y = 10000;
  

  // mini view camera
  miniViewCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 1e7);
  miniViewCamera.position.z = 0;
  miniViewCamera.position.x = 0;
  miniViewCamera.position.y = 10000;
  //miniViewCamera.fov = 180;
  miniViewCamera.lookAt( scene.position );

/*
gCamera2 = new THREE.Camera( 45, gScreen.width / gScreen.height, 1, 10000 );
gCamera2.position = new THREE.Vector3(-1000, 320, 0);
gCamera2.target.position = new THREE.Vector3(0, 0, -1000);

gMiniRenderer = new THREE.CanvasRenderer(mini3dworld);
gMiniRenderer.setSize(gScreen.width * .15, gScreen.height * .15);
*/
  //scene.add( new THREE.AmbientLight( 0x00020 ) );

  // sphere - earth
  earth = new THREE.Mesh(new THREE.SphereGeometry(200, 50, 50), new THREE.MeshLambertMaterial({
    color: 0x0000ff
  }));
  earth.position.z = 0;
  earth.position.x = 2000;
  earth.position.y = 0;
  earth.overdraw = true;
  scene.add(earth);


  // sphere - moon
  moon = new THREE.Mesh(new THREE.SphereGeometry(200, 50, 50), new THREE.MeshLambertMaterial({
    color: 0xff4933
  }));
  //moon.position.z = 0;
  //moon.position.x = earth.position.x + 500;
  //moon.position.y = 0;
  moon.position.set( earth.position.x + 500, 0, 0 );
  moon.scale.set( 0.23, 0.23, 0.23 );
  moon.overdraw = true;
  scene.add(moon);

  // sphere - sun
  sun = new THREE.Mesh(new THREE.SphereGeometry(200, 50, 50), new THREE.MeshLambertMaterial({
    color: 0xf3ff33, transparent: true
  }));
  sun.position.z = 0;
  sun.position.x = 0;
  sun.position.y = 0;
  sun.scale.set( 5.0, 5.0, 5.0 );
  sun.overdraw = true;
  scene.add(sun);

  // sphere - asteroid
  asteroid = new THREE.Mesh(new THREE.SphereGeometry(200, 50, 50), new THREE.MeshLambertMaterial({
    color: 0xff4933
  }));
  asteroid.position.z = 0;
  asteroid.position.x = 3000;
  asteroid.position.y = 0;
  //asteroid.scale.set( 5.0, 5.0, 5.0 );
  asteroid.scale.set( 0.23, 0.23, 0.23 );
  asteroid.overdraw = true;
  scene.add(asteroid);

  // sphere - space probe1
  probe1 = new THREE.Mesh(new THREE.SphereGeometry(200, 50, 50), new THREE.MeshLambertMaterial({
    color: 0xff4933
  }));

  //probe1 orbit calculation (GM = 1)
  var r = 6628140;//radius
  var v = 4000;//launch velocity
  var zenithangle = .7853;//1.5707;//1.5533;
  var gmsun = 3.986005e14;
  orbitscale = .001;
  probe1a = 1 / ((2/r) - ((v*v)/gmsun));//semi-major axis
  var gutse = Math.pow((r*v*v)/gmsun - 1,2) * Math.pow(Math.sin(zenithangle),2) + Math.pow(Math.cos(zenithangle),2);
  var probe1e = Math.sqrt( gutse );//eccentricity
  probe1b = probe1a * Math.sqrt(1 - Math.pow(probe1e,2));
  var q = 0;//45 * .017;//angle between the X-axis and the major axis of the ellipse in radians
  //alert(probe1b);
  //Calculate initial position
  //probe1.position.x = orbitscale * (probe1a*Math.cos(0)*Math.cos(0) - probe1b*Math.sin(0)*Math.sin(0));
  //probe1.position.z = orbitscale * (probe1a*Math.cos(0)*Math.sin(0) + probe1b*Math.sin(0)*Math.cos(0));
  //probe1.position.x = earth.position.x;
  //probe1.position.z = earth.position.z;
  //alert(probe1.position.y);

  //probe1.position.z = 0;
  //probe1.position.x = 3000;
  //probe1.position.y = 0;
  //probe1.scale.set( 5.0, 5.0, 5.0 );
  probe1.scale.set( 0.23, 0.23, 0.23 );
  probe1.overdraw = true;
  scene.add(probe1);


  // add subtle ambient lighting
  ambientLight = new THREE.AmbientLight(0x555555);
  scene.add(ambientLight);

  //sunlight
  sunlight = new THREE.PointLight( 0xffffff, 100, 5000 );
  sunlight.position.z = 0;
  sunlight.position.x = 0;
  sunlight.position.y = 0;
  //sunlight.position.set( 0, 0, 0 );
  scene.add( sunlight );

  // add directional light source
  //directionalLight = new THREE.DirectionalLight(0xffffff);
  //directionalLight.position.set(1, 1, 1).normalize();
  //scene.add(directionalLight);

  //renderer.render(scene, camera);

}

function animate() {

  requestAnimationFrame( animate );
  updateOrbits();
  render();

};

function render() {

camera.lookAt( scene.position );
  //main camera
  //renderer.clear();
  renderer.render( scene, camera );

  //mini view camera
  //miniRenderer.clear();
  miniRenderer.render( scene, miniViewCamera );
  //miniRenderer.render( scene, camera );
/*
renderer.setViewport( 0, 0, c.width, c.height );
renderer.clear();

// left side
renderer.setViewport( 1, 1,   0.5 * c.width - 2, c.height - 2 );
renderer.render( scene, camera );


// right side
renderer.setViewport( 0.5 * c.width + 1, 1,   0.5 * c.width - 2, c.height - 2 );
renderer.render( scene, miniViewCamera );
*/
};

/*
*	Use this for calculating orbits: http://www.braeunig.us/space/orbmech.htm
*	Equation of elipse: http://en.wikipedia.org/wiki/Ellipse#Ellipses_in_computer_graphics
*/
function updateOrbits() {

  var a = 3000;//asteroid orbit semi-major axis
  var b = 2000;//asteroid orbit semi-minor axis
  var q = 45 * .017;//angle between the X-axis and the major axis of the ellipse in radians

  var delta = clock.getDelta();
  //var angle = delta * 0.1;
  angle = angle + 1;
  if(angle > 360) angle = 0;
  rotation = angle * .017;

  var moonangle = rotation * 2.0;
  var asteroidangle = rotation;

  //earth rotation around the sun
  earth.position.x = 2000 * Math.sin( rotation );
  earth.position.z = 2000 * Math.cos( rotation );
  //earth.position.y = 2000 * Math.sin( angle );

  //moon rotation around the earth
  moon.position.x = 500 * Math.sin( moonangle ) + earth.position.x ;
  moon.position.z = 500 * Math.cos( moonangle ) + earth.position.z ;
  //earth.position.y = 2000 * Math.sin( angle );

  //asteroid rotation around the sun
  //asteroid.position.x = 500 * Math.sin( moonangle ) + earth.position.x ;
  //asteroid.position.z = 500 * Math.cos( moonangle ) + earth.position.z ;
  //asteroid.position.y = 2000 * Math.sin( angle );

  asteroid.position.x = a*Math.cos(asteroidangle)*Math.cos(q) - b*Math.sin(asteroidangle)*Math.sin(q);
  asteroid.position.z = a*Math.cos(asteroidangle)*Math.sin(q) + b*Math.sin(asteroidangle)*Math.cos(q);

  //probe1 orbit around the sun
  probe1.position.x = orbitscale * (probe1a*Math.cos(rotation)*Math.cos(0) - probe1b*Math.sin(rotation)*Math.sin(0));
  probe1.position.z = orbitscale * (probe1a*Math.cos(rotation)*Math.sin(0) + probe1b*Math.sin(rotation)*Math.cos(0));

/*
camera.position.x = asteroid.position.x;
camera.position.z = asteroid.position.z;
camera.position.y = 4000;
camera.lookAt( asteroid.position );
*/

  /*			earth.position = new THREE.Vector3(
  Math.cos( angle ) * earth.position.x - Math.sin( angle) * earth.position.z,
  0,
  Math.sin( angle ) * earth.position.x + Math.cos( angle) * earth.position.z
  );
  //earth.rotation.y -= angle;

  //moon rotation around the earth
  moon.position = new THREE.Vector3(
  Math.cos( moonangle ) * (moon.position.x) - Math.sin( moonangle) * (moon.position.z),
  0,
  Math.sin( moonangle ) * (moon.position.x)  + Math.cos( moonangle) * (moon.position.z)
  );
*/

};

/*
* Handle Launch Probe button click.
*/
function launchprobe(){


}

