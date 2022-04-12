// import logo from './logo.svg';
// import { Face, Pose, Hand } from "kalidokit";
import React from 'react';
import { Holistic } from "@mediapipe/holistic"
import { Camera } from "@mediapipe/camera_utils"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { VRM, VRMSchema, VRMUtils } from '@pixiv/three-vrm';
import * as THREE from 'three';
import * as Kalidokit from "kalidokit";

var currentVrm;
var oldLookTarget = new THREE.Euler();
const clock = new THREE.Clock();
const renderer =  new THREE.WebGLRenderer({alpha:true});
var orbitCamera;
var orbitControls

function ChatRoom() {

    /* State Defnewion */
    const [ videoElement, setVideoElement ] = React.useState(null);
    const [ camera, setCamera ] = React.useState(null)
    const [ holistic, setHolistic ] = React.useState(null)
    const [ loader, setLoader ] = React.useState(null)
    const [ scene, setScene ] = React.useState(null)

    
    /* Initalizing Functions */

    const newVideoElement = () => setVideoElement(document.querySelector(".input_video"));

    const newHolistic = () =>{
        setHolistic(new Holistic({
            locateFile: file => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
            }
        }))
    }

    const initHolistic = () => {
        holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
            refineFaceLandmarks: true,
        });

        holistic.onResults(onResults);
    }

    const newLoader = () => {
        const _loader = new GLTFLoader();
        _loader.crossOrigin = "anonymous";
        // Import model from URL, add your own model here
        setLoader(_loader)
    }

    const newCamera = () => setCamera(new Camera(videoElement, {
        onFrame: async () => {
            await holistic.send({image: videoElement});
        },
        width: 640,
        height: 480
    }))

    const newScene = () => {
        setScene( new THREE.Scene() )
    }

    const newLight = () => {
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1.0, 1.0, 1.0).normalize();
        scene.add(light);
    }

    const initRenderingPipeline = () => {

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        orbitCamera = new THREE.PerspectiveCamera(35,window.innerWidth / window.innerHeight,0.1,1000);
        orbitCamera.position.set(0.0, 1.4, 0.7);

        orbitControls = new OrbitControls(orbitCamera, renderer.domElement);
        orbitControls.screenSpacePanning = true;
        orbitControls.target.set(0.0, 1.4, 0.0);
        orbitControls.update();
    }




    /* Logic Functions */

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const loadVRM = () => {
        loader.load(
            "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981",
    
            gltf => {
                VRMUtils.removeUnnecessaryJoints(gltf.scene);
    
                VRM.from(gltf).then(vrm => {
                    scene.add(vrm.scene);
                    currentVrm = vrm
                    // setCurrentVrm(vrm);
                    currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
                    console.log("DEBUG 2")
                });
            },
    
            progress =>
                console.log(
                    "Loading model...",
                    100.0 * (progress.loaded / progress.total),
                    "%"
                ),
    
            error => console.error(error)
        );
    }


    const rigRotation = (
        name,
        rotation = { x: 0, y: 0, z: 0 },
        dampener = 1,
        lerpAmount = 0.3
    ) => {
        if (!currentVrm) {return}
        const Part = currentVrm.humanoid.getBoneNode(
            VRMSchema.HumanoidBoneName[name]
        );
        if (!Part) {return}
        
        let euler = new THREE.Euler(
            rotation.x * dampener,
            rotation.y * dampener,
            rotation.z * dampener
        );
        let quaternion = new THREE.Quaternion().setFromEuler(euler);
        Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
    };

    // Animate Position Helper Function
    const rigPosition = (
        name,
        position = { x: 0, y: 0, z: 0 },
        dampener = 1,
        lerpAmount = 0.3
    ) => {
        if (!currentVrm) {return}
        const Part = currentVrm.humanoid.getBoneNode(
        VRMSchema.HumanoidBoneName[name]
        );
        if (!Part) {return}
        let vector = new THREE.Vector3(
            position.x * dampener,
            position.y * dampener,
            position.z * dampener
        );
        Part.position.lerp(vector, lerpAmount); // interpolate
    };



    const rigFace = (riggedFace) => {

        // Renaming sime useful functions for easy use.
        const remap = Kalidokit.Utils.remap;
        const clamp = Kalidokit.Utils.clamp;
        const lerp = Kalidokit.Vector.lerp;

        if(!currentVrm){return}
        rigRotation("Neck", riggedFace.head, 0.7);
    
        // Blendshapes and Preset Name Schema
        const Blendshape = currentVrm.blendShapeProxy;
        const PresetName = VRMSchema.BlendShapePresetName;
      
        // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
        // for VRM, 1 is closed, 0 is open.
        riggedFace.eye.l = lerp(clamp(1 - riggedFace.eye.l, 0, 1),Blendshape.getValue(PresetName.Blink), .5)
        riggedFace.eye.r = lerp(clamp(1 - riggedFace.eye.r, 0, 1),Blendshape.getValue(PresetName.Blink), .5)
        riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye,riggedFace.head.y)
        Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);
        
        // Interpolate and set mouth blendshapes
        Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I,Blendshape.getValue(PresetName.I), .5));
        Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A,Blendshape.getValue(PresetName.A), .5));
        Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E,Blendshape.getValue(PresetName.E), .5));
        Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O,Blendshape.getValue(PresetName.O), .5));
        Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U,Blendshape.getValue(PresetName.U), .5));
    
        //PUPILS
        //interpolate pupil and keep a copy of the value
        let lookTarget =
          new THREE.Euler(
            lerp(oldLookTarget.x , riggedFace.pupil.y, .4),
            lerp(oldLookTarget.y, riggedFace.pupil.x, .4),
            0,
            "XYZ"
          )
        oldLookTarget.copy(lookTarget)
        currentVrm.lookAt.applyer.lookAt(lookTarget);
    }

    


    const onResults = (results) => {
        // Animate model
        var vrm = currentVrm;
        if (!vrm) return;

        // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
        let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;
    
        const faceLandmarks = results.faceLandmarks;
        // Pose 3D Landmarks are with respect to Hip distance in meters
        const pose3DLandmarks = results.ea;
        // Pose 2D landmarks are with respect to videoWidth and videoHeight
        const pose2DLandmarks = results.poseLandmarks;
        // Be careful, hand landmarks may be reversed
        const leftHandLandmarks = results.rightHandLandmarks;
        const rightHandLandmarks = results.leftHandLandmarks;
    
        // Animate Face
        if (faceLandmarks) {
            riggedFace = Kalidokit.Face.solve(faceLandmarks,{
                runtime:"mediapipe",
                video:videoElement
            });

            console.log(riggedFace)
            rigFace(riggedFace)
        }
        
            // Animate Pose
        if (pose2DLandmarks && pose3DLandmarks) {
            riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
                runtime: "mediapipe",
                video:videoElement,
            });
            rigRotation("Hips", riggedPose.Hips.rotation, 0.7);
            rigPosition(
                "Hips",
                {
                    x: -riggedPose.Hips.position.x, // Reverse direction
                    y: riggedPose.Hips.position.y + 1, // Add a bit of height
                    z: -riggedPose.Hips.position.z // Reverse direction
                },
                1,
                0.07
            );
        
            rigRotation("Chest", riggedPose.Spine, 0.25, .3);
            rigRotation("Spine", riggedPose.Spine, 0.45, .3);
        
            rigRotation("RightUpperArm", riggedPose.RightUpperArm, 1, .3);
            rigRotation("RightLowerArm", riggedPose.RightLowerArm, 1, .3);
            rigRotation("LeftUpperArm", riggedPose.LeftUpperArm, 1, .3);
            rigRotation("LeftLowerArm", riggedPose.LeftLowerArm, 1, .3);
        
            rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg, 1, .3);
            rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg, 1, .3);
            rigRotation("RightUpperLeg", riggedPose.RightUpperLeg, 1, .3);
            rigRotation("RightLowerLeg", riggedPose.RightLowerLeg, 1, .3);
        }
        
            // Animate Hands
        if (leftHandLandmarks) {
            riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
            rigRotation("LeftHand", {
                // Combine pose rotation Z and hand rotation X Y
                z: riggedPose.LeftHand.z,
                y: riggedLeftHand.LeftWrist.y,
                x: riggedLeftHand.LeftWrist.x
            });
            rigRotation("LeftRingProximal", riggedLeftHand.LeftRingProximal);
            rigRotation("LeftRingIntermediate", riggedLeftHand.LeftRingIntermediate);
            rigRotation("LeftRingDistal", riggedLeftHand.LeftRingDistal);
            rigRotation("LeftIndexProximal", riggedLeftHand.LeftIndexProximal);
            rigRotation("LeftIndexIntermediate", riggedLeftHand.LeftIndexIntermediate);
            rigRotation("LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
            rigRotation("LeftMiddleProximal", riggedLeftHand.LeftMiddleProximal);
            rigRotation("LeftMiddleIntermediate", riggedLeftHand.LeftMiddleIntermediate);
            rigRotation("LeftMiddleDistal", riggedLeftHand.LeftMiddleDistal);
            rigRotation("LeftThumbProximal", riggedLeftHand.LeftThumbProximal);
            rigRotation("LeftThumbIntermediate", riggedLeftHand.LeftThumbIntermediate);
            rigRotation("LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
            rigRotation("LeftLittleProximal", riggedLeftHand.LeftLittleProximal);
            rigRotation("LeftLittleIntermediate", riggedLeftHand.LeftLittleIntermediate);
            rigRotation("LeftLittleDistal", riggedLeftHand.LeftLittleDistal);
        }
            
        if (rightHandLandmarks) {
            riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
            rigRotation("RightHand", {
                // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
                z: riggedPose.RightHand.z,
                y: riggedRightHand.RightWrist.y,
                x: riggedRightHand.RightWrist.x
            });
            rigRotation("RightRingProximal", riggedRightHand.RightRingProximal);
            rigRotation("RightRingIntermediate", riggedRightHand.RightRingIntermediate);
            rigRotation("RightRingDistal", riggedRightHand.RightRingDistal);
            rigRotation("RightIndexProximal", riggedRightHand.RightIndexProximal);
            rigRotation("RightIndexIntermediate",riggedRightHand.RightIndexIntermediate);
            rigRotation("RightIndexDistal", riggedRightHand.RightIndexDistal);
            rigRotation("RightMiddleProximal", riggedRightHand.RightMiddleProximal);
            rigRotation("RightMiddleIntermediate", riggedRightHand.RightMiddleIntermediate);
            rigRotation("RightMiddleDistal", riggedRightHand.RightMiddleDistal);
            rigRotation("RightThumbProximal", riggedRightHand.RightThumbProximal);
            rigRotation("RightThumbIntermediate", riggedRightHand.RightThumbIntermediate);
            rigRotation("RightThumbDistal", riggedRightHand.RightThumbDistal);
            rigRotation("RightLittleProximal", riggedRightHand.RightLittleProximal);
            rigRotation("RightLittleIntermediate", riggedRightHand.RightLittleIntermediate);
            rigRotation("RightLittleDistal", riggedRightHand.RightLittleDistal);
        }
    }


    /* Animation Related Functions */
    function animate() {
        requestAnimationFrame(animate);
      
        if (currentVrm) {
          // Update model to render physics
          currentVrm.update(clock.getDelta());
        }
        renderer.render(scene, orbitCamera);
    }
    



    /* Lifecycle Hooks */

    // Init HTML element reference and some mudules
    React.useEffect(()=>{
        newVideoElement()
        newHolistic()
        newLoader()
        newScene()
        initRenderingPipeline()
    },[])

    // When videoElement is found, new "@mediapipe/camera_utils".Camera
    React.useEffect(()=>{
        if(videoElement) newCamera()
    },[videoElement])

    // When Camera is Ready, start it.
    React.useEffect(()=>{
        if(camera) camera.start();
    },[camera])


    React.useEffect(()=>{
        if(loader && scene) loadVRM();    
    },[loadVRM, loader, scene])

    React.useEffect(()=>{
        if(scene){
            newLight()
            animate()
        }
    },[scene])

    React.useEffect(()=>{
        if(holistic) initHolistic()
    },[holistic])

    // React.useState(()=>{
    //     console.log("DEBUG ",currentVrm)
    // },[currentVrm])

    return(
        <div className='ChatRoom'>
            <video
                className="input_video" width="300px" height="200px"  autoPlay muted
                style={{
                    position:"absolute",
                    left:10,top:10,
                }}
            ></video>       
        </div>
    )
}

export default ChatRoom