import { Scene } from '@babylonjs/core/scene';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateCylinder } from '@babylonjs/core';

const BASE_URL = import.meta.env.BASE_URL || '/';

class Renderer {
    constructor(canvas, engine, material_callback, ground_mesh_callback) {
        this.canvas = canvas;
        this.engine = engine;
        this.scenes = [
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.1, 0.1, 0.1, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.9, 0.1, 0.2),
                lights: [],
                models: []
            },
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.0, 0.0, 0.0, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.0, 0.0, 0.0, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            },
            {
                scene: new Scene(this.engine),
                background_color: new Color4(0.0, 0.0, 0.0, 1.0),
                materials: null,
                ground_subdivisions: [50, 50],
                ground_mesh: null,
                camera: null,
                ambient: new Color3(0.2, 0.2, 0.2),
                lights: [],
                models: []
            }
        ];
        this.active_scene = 0;
        this.active_light = 0;
        this.shading_alg = 'gouraud';
        
        // create event listener for W, A, S, D button handling
        document.addEventListener('keydown', (event) => {
            this.onKeyDown(event, this.active_light, this.active_scene, this.scenes);
        })
        
        this.scenes.forEach((scene, idx) => {
            scene.materials = material_callback(scene.scene);
            scene.ground_mesh = ground_mesh_callback(scene.scene, scene.ground_subdivisions);
            this['createScene'+ idx](idx);
        });
    }
    createScene0(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        let light1 = new PointLight('light1', new Vector3(0.0, 3.0, 0.0), scene);
        light1.diffuse = new Color3(1.0, 1.0, 1.0);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light1);

        let light2 = new PointLight('light2', new Vector3(5.0, 5.0, 5.0), scene);
        light2.diffuse = new Color3(1.0, 1.0, 1.0);
        light2.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light2);

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.80, 0.65, 0.75),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];
        
        // Create other models
        let sphere = CreateSphere('sphere', {segments: 16}, scene);
        sphere.position = new Vector3(1.0, 0.5, 3.0);
        sphere.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);
        
        let box = CreateBox('box', {width: 2, height: 1, depth: 1}, scene);
        box.position = new Vector3(-1.0, 0.5, 2.0);
        box.metadata = {
            mat_color: new Color3(0.75, 0.15, 0.05),
            mat_texture: white_texture,
            mat_specular: new Color3(0.4, 0.4, 0.4),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        }
        box.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(box);

        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    createScene1(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        let light1 = new PointLight('light1', new Vector3(-1.0, 0.5, 2.0), scene);
        light1.diffuse = new Color3(1.0, 1.0, 1.0);
        light1.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light1);

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.10, 0.65, 0.15),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];
        
        // Create other models
        let sphere = CreateSphere('sphere', {segments: 32}, scene);
        sphere.position = new Vector3(1.0, 0.5, 3.0);
        sphere.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere);

        // Create mesh model
        let stairs = new Mesh('stairs', scene);
        let vertex_positions = [
            // facing left
            0.1, 0.9, 0.2, // 0
            0.3, 0.9, 0.2, // 1
            0.3, 0.7, 0.2, // 2
            0.5, 0.7, 0.2, // 3
            0.5, 0.5, 0.2, // 4
            0.7, 0.5, 0.2, // 5
            0.7, 0.3, 0.2, // 6
            0.9, 0.3, 0.2, // 7
            0.9, 0.1, 0.2, // 8
            0.7, 0.1, 0.2, // 9
            0.5, 0.1, 0.2, // 10
            0.3, 0.1, 0.2, // 11
            0.1, 0.1, 0.2, // 12

            // facing right
            0.1, 0.9, -0.2, // 13
            0.3, 0.9, -0.2, // 14
            0.3, 0.7, -0.2, // 15
            0.5, 0.7, -0.2, // 16
            0.5, 0.5, -0.2, // 17
            0.7, 0.5, -0.2, // 18
            0.7, 0.3, -0.2, // 19
            0.9, 0.3, -0.2, // 20
            0.9, 0.1, -0.2, // 21
            0.7, 0.1, -0.2, // 22
            0.5, 0.1, -0.2, // 23
            0.3, 0.1, -0.2, // 24
            0.1, 0.1, -0.2, // 25

            // facing up
            // 0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20
            0.1, 0.9, 0.2, // (0) 26
            0.3, 0.9, 0.2, // (1) 27
            0.3, 0.7, 0.2, // (2) 28
            0.5, 0.7, 0.2, // (3) 29
            0.5, 0.5, 0.2, // (4) 30
            0.7, 0.5, 0.2, // (5) 31
            0.7, 0.3, 0.2, // (6) 32
            0.9, 0.3, 0.2, // (7) 33
            0.1, 0.9, -0.2, // (13) 34
            0.3, 0.9, -0.2, // (14) 35
            0.3, 0.7, -0.2, // (15) 36
            0.5, 0.7, -0.2, // (16) 37
            0.5, 0.5, -0.2, // (17) 38
            0.7, 0.5, -0.2, // (18) 39
            0.7, 0.3, -0.2, // (19) 40
            0.9, 0.3, -0.2, // (20) 41

            // facing down
            // 8, 12, 21, 25
            0.9, 0.1, 0.2, // (8) 42
            0.1, 0.1, 0.2, // (12) 43
            0.9, 0.1, -0.2, // (21) 44
            0.1, 0.1, -0.2, // (25) 45

            // facing forward
            // 1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 20, 21
            0.1, 0.9, 0.2, // (0) 46
            0.3, 0.9, 0.2, // (1) 47
            0.3, 0.7, 0.2, // (2) 48
            0.5, 0.7, 0.2, // (3) 49
            0.5, 0.5, 0.2, // (4) 50
            0.7, 0.5, 0.2, // (5) 51
            0.7, 0.3, 0.2, // (6) 52
            0.9, 0.3, 0.2, // (7) 53
            0.9, 0.1, 0.2, // (8) 54
            0.3, 0.9, -0.2, // (14) 55
            0.3, 0.7, -0.2, // (15) 56
            0.5, 0.7, -0.2, // (16) 57
            0.5, 0.5, -0.2, // (17) 58
            0.7, 0.5, -0.2, // (18) 59
            0.7, 0.3, -0.2, // (19) 60
            0.9, 0.3, -0.2, // (20) 61
            0.9, 0.1, -0.2, // (21) 62

            // facing back
            // 0, 12, 13, 25
            0.1, 0.9, 0.2, // (0) 63
            0.1, 0.1, 0.2, // (12) 64
            0.1, 0.9, -0.2, // (13) 65
            0.1, 0.1, -0.2 // (25) 66
        ];

        let vertex_normals = [
            // facing left
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            // facing right
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            // facing up
            // 0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 15, 16, 17, 18, 19, 20
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            // facing down
            // 8, 12, 21, 25
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,

            // facing forward
            // 1, 2, 3, 4, 5, 6, 7, 8, 14, 15, 16, 17, 18, 19, 20, 21
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            // facing back
            // 0, 12, 13, 25
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
        ];

        let stairs_indices = [
            // left side of stairs - done
            0, 1, 12,
            1, 11, 12,
            2, 3, 11,
            3, 10, 11,
            4, 5, 10,
            5, 9, 10,
            6, 7, 9,
            7, 8, 9,
            
            // right side of stairs - done
            13, 14, 25,
            14, 24, 25,
            15, 16, 24,
            16, 23, 24,
            17, 18, 23,
            18, 22, 23,
            19, 20, 22,
            20, 21, 22,

            // back of stairs
            63, 64, 65,
            64, 65, 66,

            // top of stairs
            26, 34, 35,
            26, 27, 35,
            28, 29, 36,
            29, 36, 37,
            30, 38, 39,
            30, 31, 39,
            32, 33, 40,
            33, 40, 41,

            // bottom of stairs
            43, 42, 45,
            42, 43, 45,

            // front of stairs
            47, 48, 55,
            48, 55, 56,
            49, 50, 57,
            50, 57, 58,
            51, 52, 59,
            52, 59, 60,
            53, 54, 61,
            54, 61, 62
        ];
        let vertex_data = new VertexData();
        vertex_data.positions = vertex_positions;
        vertex_data.indices = stairs_indices;
        vertex_data.normals = vertex_normals;
        vertex_data.applyToMesh(stairs);

        stairs.position = new Vector3(-1.0, 0.5, 2.0);
        stairs.metadata = {
            mat_color: new Color3(0.8, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }

        stairs.scaling = new Vector3(4.0, 4.0, 4.0);
        stairs.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(stairs);


        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    createScene2(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        // Create ground mesh
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.80, 0.65, 0.75),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];
        
        // Create other models
        let cylinder0 = CreateCylinder("cylinder0", {
            diameterTop: 1,
            diameterBottom: 1,
            height: 2,
            tessellation: 24
        }, scene);
        cylinder0.position = new Vector3(3.0, 0.5, 3.0);
        cylinder0.metadata = {
            mat_color: new Color3(0.8, 0.1, 0.1),
            mat_texture: white_texture,
            mat_specular: new Color3(0.9, 0.9, 0.9),
            mat_shininess: 64,
            texture_scale: new Vector2(1.0, 1.0)
        }
        cylinder0.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(cylinder0);

        let cylinder1 = CreateCylinder("cylinder1", {
            diameterTop: 1,
            diameterBottom: 1,
            height: 2,
            tessellation: 24
        }, scene);
        cylinder1.position = new Vector3(1.0, 0.5, 3.0);
        cylinder1.metadata = {
            mat_color: new Color3(0.2, 0.4, 0.7),
            mat_texture: white_texture,
            mat_specular: new Color3(0.5, 0.5, 0.5),
            mat_shininess: 4,
            texture_scale: new Vector2(1.0, 1.0)
        }
        cylinder1.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(cylinder1);

        let cylinder2 = CreateCylinder("cylinder2", {
            diameterTop: 1,
            diameterBottom: 1,
            height: 2,
            tessellation: 24
        }, scene);
        cylinder2.position = new Vector3(-1.0, 0.5, 3.0);
        cylinder2.metadata = {
            mat_color: new Color3(0.1, 0.6, 0.3),
            mat_texture: white_texture,
            mat_specular: new Color3(0.1, 0.1, 0.1),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0)
        }
        cylinder2.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(cylinder2);

        let cylinder3 = CreateCylinder("cylinder3", {
            diameterTop: 1,
            diameterBottom: 1,
            height: 2,
            tessellation: 24
        }, scene);
        cylinder3.position = new Vector3(-3.0, 0.5, 3.0);
        cylinder3.metadata = {
            mat_color: new Color3(0.10, 0.35, 0.88),
            mat_texture: white_texture,
            mat_specular: new Color3(0.5, 0.5, 0.5),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        cylinder3.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(cylinder3);

        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    createScene3(scene_idx) {
        let current_scene = this.scenes[scene_idx];
        let scene = current_scene.scene;
        let materials = current_scene.materials;
        let ground_mesh = current_scene.ground_mesh;

        // Set scene-wide / environment values
        scene.clearColor = current_scene.background_color;
        scene.ambientColor = current_scene.ambient;
        scene.useRightHandedSystem = true;

        // Create camera
        current_scene.camera = new UniversalCamera('camera', new Vector3(0.0, 1.8, 10.0), scene);
        current_scene.camera.setTarget(new Vector3(0.0, 1.8, 0.0));
        current_scene.camera.upVector = new Vector3(0.0, 1.0, 0.0);
        current_scene.camera.attachControl(this.canvas, true);
        current_scene.camera.fov = 35.0 * (Math.PI / 180);
        current_scene.camera.minZ = 0.1;
        current_scene.camera.maxZ = 100.0;

        // Create point light sources
        let light0 = new PointLight('light0', new Vector3(1.0, 1.0, 5.0), scene);
        light0.diffuse = new Color3(1.0, 1.0, 1.0);
        light0.specular = new Color3(1.0, 1.0, 1.0);
        current_scene.lights.push(light0);

        // Ground Mesh creation 
        let white_texture = RawTexture.CreateRGBTexture(new Uint8Array([255, 255, 255]), 1, 1, scene);
        let ground_heightmap = new Texture(BASE_URL + 'heightmaps/default.png', scene);
        ground_mesh.scaling = new Vector3(20.0, 1.0, 20.0);
        ground_mesh.metadata = {
            mat_color: new Color3(0.80, 0.65, 0.75),
            mat_texture: white_texture,
            mat_specular: new Color3(0.0, 0.0, 0.0),
            mat_shininess: 1,
            texture_scale: new Vector2(1.0, 1.0),
            height_scalar: 1.0,
            heightmap: ground_heightmap
        }
        ground_mesh.material = materials['ground_' + this.shading_alg];

        
        // Create other models
        let sphere0 = CreateSphere('sphere0', {segments: 16}, scene);
        sphere0.position = new Vector3(1.0, 0.5, 3.0);
        sphere0.metadata = {
            mat_color: new Color3(0.73, 0.21, 0.89),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            // height_scalar: 1.0,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere0.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere0);

        let sphere1 = CreateSphere('sphere1', {segments: 16}, scene);
        sphere1.position = new Vector3(3.0, 0.5, 3.0);
        sphere1.metadata = {
            mat_color: new Color3(0.45, 0.12, 0.67),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere1.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere1);

        let sphere2 = CreateSphere('sphere2', {segments: 16}, scene);
        sphere2.position = new Vector3(-1.0, 0.5, 3.0);
        sphere2.metadata = {
            mat_color: new Color3(0.34, 0.98, 0.56),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere2.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere2);

        let sphere3 = CreateSphere('sphere3', {segments: 16}, scene);
        sphere3.position = new Vector3(-1.0, 2.5, 3.0);
        sphere3.metadata = {
            mat_color: new Color3(0.09, 0.87, 0.32),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere3.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere3);

        let sphere4 = CreateSphere('sphere4', {segments: 16}, scene);
        sphere4.position = new Vector3(1.0, 2.5, 3.0);
        sphere4.metadata = {
            mat_color: new Color3(168/255, 115/255, 50/155),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere4.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere4);

        let sphere5 = CreateSphere('sphere5', {segments: 16}, scene);
        sphere5.position = new Vector3(3.0, 2.5, 3.0);
        sphere5.metadata = {
            mat_color: new Color3(54/255, 50/255, 158/255),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere5.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere5);

        let sphere6 = CreateSphere('sphere6', {segments: 16}, scene);
        sphere6.position = new Vector3(3.0, 4.5, 3.0);
        sphere6.metadata = {
            mat_color: new Color3(0.14, 0.78, 0.29),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere6.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere6);

        let sphere7 = CreateSphere('sphere7', {segments: 16}, scene);
        sphere7.position = new Vector3(1.0, 4.5, 3.0);
        sphere7.metadata = {
            mat_color: new Color3(0.68, 0.37, 0.91),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere7.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere7);

        let sphere8 = CreateSphere('sphere8', {segments: 16}, scene);
        sphere8.position = new Vector3(-1.0, 4.5, 3.0);
        sphere8.metadata = {
            mat_color: new Color3(168/255, 50/255, 74/255),
            mat_texture: white_texture,
            mat_specular: new Color3(1.0, 1.0, 1.0),
            mat_shininess: 128,
            texture_scale: new Vector2(1.0, 1.0)
        }
        sphere8.material = materials['illum_' + this.shading_alg];
        current_scene.models.push(sphere8);
        

        // Animation function - called before each frame gets rendered
        scene.onBeforeRenderObservable.add(() => {
            // update models and lights here (if needed)
            // ...

            // update uniforms in shader programs
            this.updateShaderUniforms(scene_idx, materials['illum_' + this.shading_alg]);
            this.updateShaderUniforms(scene_idx, materials['ground_' + this.shading_alg]);
        });
    }

    updateShaderUniforms(scene_idx, shader) {
        let current_scene = this.scenes[scene_idx];
        shader.setVector3('camera_position', current_scene.camera.position);
        shader.setColor3('ambient', current_scene.scene.ambientColor);
        shader.setInt('num_lights', current_scene.lights.length);
        let light_positions = [];
        let light_colors = [];
        current_scene.lights.forEach((light) => {
            light_positions.push(light.position.x, light.position.y, light.position.z);
            light_colors.push(light.diffuse);
        });
        shader.setArray3('light_positions', light_positions);
        shader.setColor3Array('light_colors', light_colors);
    }

    getActiveScene() {
        return this.scenes[this.active_scene].scene;
    }
    
    setActiveScene(idx) {
        this.active_scene = idx;
    }

    setShadingAlgorithm(algorithm) {
        this.shading_alg = algorithm;

        this.scenes.forEach((scene) => {
            let materials = scene.materials;
            let ground_mesh = scene.ground_mesh;

            ground_mesh.material = materials['ground_' + this.shading_alg];
            scene.models.forEach((model) => {
                model.material = materials['illum_' + this.shading_alg];
            });
        });
    }

    setHeightScale(scale) {
        let i = 0;
        this.scenes.forEach((scene) => {
            console.log(i);
            i++;
            let ground_mesh = scene.ground_mesh;
            ground_mesh.metadata.height_scalar = scale; //we don't have ground for scene 3....
            console.log(ground_mesh.metadata.height_scalar);
            console.log('here');// does get here but still has an issue 
        });
    }

    setActiveLight(idx) {
        console.log(idx);
        this.active_light = idx;
    }

    onKeyDown(event, active_light, active_scene, scenes) {
        let translate_distance = 1;
        switch (event.keyCode) {
            case 65: // A key
                scenes[active_scene].lights[active_light].position.x -= translate_distance;
                break;
            case 68: // D key
                scenes[active_scene].lights[active_light].position.x += translate_distance;
                break;
            case 83: // S key
                scenes[active_scene].lights[active_light].position.z += translate_distance;
                break;
            case 87: // W key
                scenes[active_scene].lights[active_light].position.z -= translate_distance;
                break;
            case 70: // F key
                scenes[active_scene].lights[active_light].position.y -= translate_distance;
                break;
            case 82: // R key
                scenes[active_scene].lights[active_light].position.y += translate_distance;
                break;
        }
    }
}

export { Renderer }