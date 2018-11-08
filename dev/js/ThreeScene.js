import * as THREE from "three"

class ThreeScene {
    constructor(width, height) {
        // init
        this.width = width;
        this.height = height;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, width/height, 0.1, 1000 );

        // dom renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );

        // light to scene
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(70, 120, 2000); 
        this.scene.add(this.light);

        // camera pos
        this.camera.position.z = 1.5;

        // model list
        this.modelList = [];
        this.selectedIndex = 0;
    }

    getRendereDom() {
        return this.renderer.domElement;
    }

    createTexture(img) {
        const texLoader = new THREE.TextureLoader();
        texLoader.crossOrigin = '*';
        const texture = texLoader.load(img);       
        texture.minFilter = THREE.LinearFilter;
        return texture;
    }

    create(normalTex) {
        const texture = this.createTexture(normalTex);

        const cube = this._createCube(texture);
        this.scene.add(cube.mesh);
        this._rotate(cube.mesh);
        this.modelList.push(cube);

        const sphere = this._createSphere(texture);
        this.scene.add(sphere.mesh);
        this._rotate(sphere.mesh);
        this.modelList.push(sphere);

        this.changeShape(this.selectedIndex);
    }

    changeTexture(img) {
        const texture = this.createTexture(img);
        const mesh = this.modelList[this.selectedIndex].mesh;
        mesh.material.normalMap = texture; 
    }

    changeShape(index) {
        for (let i = 0; i < this.modelList.length; i++)
            this.modelList[i].mesh.visible = false;
        this.modelList[index].mesh.visible = true;
        this.selectedIndex = index;
    };

    allDispose() {
        for (let i = 0; i < this.modelList.length; i++) {
            const model = this.modelList[i];
            this.scene.remove( model.mesh );
            model.geometry.dispose();
            model.material.dispose();
            model.texture.dispose();
         }
        this.modelList = [];
        
    }

    _rotate(model) {
        requestAnimationFrame( () => this._rotate(model) );
        model.rotation.x += 0.005;
        model.rotation.y += 0.005;
        this.renderer.render( this.scene, this.camera );
    }
    
    _createCube(nomalTex) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial( { color: 0xffffff, normalMap: nomalTex } );
        return {
            mesh: new THREE.Mesh(geometry, material),
            geometry: geometry,
            material: material,
            texture: nomalTex,
        };
    }
    
    _createSphere(nomalTex) {
        const geometry = new THREE.SphereGeometry( 0.8, 32, 32 );
        const material = new THREE.MeshStandardMaterial( { color: 0xffffff, normalMap: nomalTex } );
        return {
            mesh: new THREE.Mesh(geometry, material),
            geometry: geometry,
            material: material,
            texture: nomalTex,
        };
    }
}

export default ThreeScene;