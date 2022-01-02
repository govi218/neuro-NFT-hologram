function STLViewer(model, elementID) {
    var elem = document.getElementById(elementID)

    var camera = new THREE.PerspectiveCamera(70, elem.clientWidth/elem.clientHeight, 1, 1000);
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(elem.clientWidth, elem.clientHeight);
    elem.appendChild(renderer.domElement);
    window.addEventListener('resize', function () {
        renderer.setSize(elem.clientWidth, elem.clientHeight);
        camera.aspect = elem.clientWidth/elem.clientHeight;
        camera.updateProjectionMatrix();
    }, false);
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.rotateSpeed = 0.25;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    // controls.autoRotate = true;
    // controls.autoRotateSpeed = .75;
    var scene = new THREE.Scene();
    const spotLight = new THREE.SpotLight( 0xf4f4f4 );
    spotLight.position.set( -100, -1000, -100 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add( spotLight );
    (new THREE.STLLoader()).load(model, function (geometry) {
        var material = new THREE.MeshPhongMaterial({
            color: 0xff5533,
            specular: 100,
            shininess: 100 });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        var middle = new THREE.Vector3();
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(middle);
        mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
            -middle.x, -middle.y, -middle.z ) );
        var largestDimension = Math.max(geometry.boundingBox.max.x,
                                       geometry.boundingBox.max.y,
                                       geometry.boundingBox.max.z)
        camera.position.z = largestDimension * 1.5;
        // camera.position.x = -10;
        camera.position.y = -100;
        var animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
    });
}
window.onload = function() {
    STLViewer("images/Skully.stl", "model")
}