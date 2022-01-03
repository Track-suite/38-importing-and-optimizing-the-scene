import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { BackSide } from 'three'

/**
 * Spector Js
 */
const SPECTOR = require('spectorjs')
const spector = new SPECTOR.Spector()
spector.displayUI()

/**
 * Base
 */
// Debug
const debugObject = {}
const gui = new dat.GUI({
    width: 400
})





// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
 const bakedTexture = textureLoader.load('baked.jpg')
 bakedTexture.flipY = false
//  bakedTexture.encoding = THREE.sRGBEncoding

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })

// Portal light material
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

/**
 * Model
 */
 gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
    
       gltf.scene.traverse((child)=>
       {
        //    console.log(child)
           child.material = bakedMaterial
       }) 
       scene.add(gltf.scene)

    //    Get each object
       const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
       const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight')
       const poleLight1Mesh = gltf.scene.children.find((child) => child.name === 'poleLight1')
       const poleLight2Mesh = gltf.scene.children.find((child) => child.name === 'poleLight2')

    //    Apply materials
    bakedMesh.material = bakedMaterial
    poleLight1Mesh.material = poleLightMaterial
    poleLight2Mesh.material = poleLightMaterial
    portalLightMesh.material = portalLightMaterial
    }
)

/**
 * Fireflies
 */
// Geometry


const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionArray = new Float32Array(firefliesCount * 3)

for(let i = 0; i < firefliesCount; i++)
{
    positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
    positionArray[i * 3 + 1] = Math.random() * 1.5
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4
}

firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))

// Material
const firefliesMaterial = new THREE.PointsMaterial({ size: 0.1, sizeAttenuation: true })

// Points
const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputEncoding = THREE.sRGBEncoding
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Clear color
debugObject.clearColor = '#322a2a'
renderer.setClearColor(debugObject.clearColor)
gui.addColor(debugObject, 'clearColor')
// gui
//     .addColor(debugObject, 'clearColor')
//     .onChange(() =>
//     {
//         renderer.setClearColor(debugObject.clearColor)
//     })

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()