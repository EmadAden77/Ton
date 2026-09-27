"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  buildNegativePrompt,
  buildPromptEnglish,
} from "@/features/prompt-studio/promptBuilder";
import type { SceneState } from "@/features/prompt-studio/types";
import {
  Camera,
  Sun,
  Moon,
  Lightbulb,
  RotateCcw,
  Eye,
  EyeOff,
  Smartphone,
  Sliders,
  Bed,
  Armchair,
  Sparkles,
  Check,
  Info,
  Layers,
  Palette,
} from "lucide-react";

interface Vector3Values {
  x: number;
  y: number;
  z: number;
}

interface JointAngles {
  rx: number;
  ry: number;
  rz: number;
}

interface PoseJoints {
  head: JointAngles;
  spine: JointAngles;
  leftShoulder: JointAngles;
  rightShoulder: JointAngles;
  rightElbow: JointAngles;
  leftLeg: JointAngles;
  rightLeg: JointAngles;
}

interface Pose {
  id: string;
  title: string;
  shortTitle: string;
  category: "bed" | "sofa";
  description: string;
  position: Vector3Values;
  rotation: Vector3Values;
  joints: PoseJoints;
  camera: {
    position: Vector3Values;
    target: Vector3Values;
  };
}

type LightingModeKey = "warm" | "white" | "night";

interface LightingMode {
  id: LightingModeKey;
  name: string;
  bg: number;
  ambientColor: number;
  ambientIntensity: number;
  keyColor: number;
  keyIntensity: number;
  lampColor: number;
  lampIntensity: number;
  screenLight: number;
}

interface CharacterRig {
  rootGroup: THREE.Group;
  pelvis: THREE.Group;
  torso: THREE.Group;
  headGroup: THREE.Group;
  leftShoulder: THREE.Group;
  rightShoulder: THREE.Group;
  rightForearm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  screenLight: THREE.PointLight;
}

interface AnimationTargets {
  charPos: THREE.Vector3;
  charRot: THREE.Euler;
  joints: PoseJoints;
  camPos: THREE.Vector3;
  camTarget: THREE.Vector3;
}

const mapPoseToSceneState = (poseId: string): SceneState["poseType"] => {
  if (poseId.startsWith("lying")) return "lying-bed";
  if (poseId === "sitting_edge_bed" || poseId === "sitting_middle_bed") {
    return "sitting-bed";
  }
  if (poseId === "sitting_sofa" || poseId === "sitting_side_sofa") {
    return "sitting-chair";
  }
  return "standing";
};

const mapLightingToSceneState = (
  modeKey: LightingModeKey,
): SceneState["lightingMode"] => {
  if (modeKey === "warm") return "as-in-photo";
  if (modeKey === "night") return "phone-screen";
  return "daylight-open";
};

/**
 * Pose Presets Matrix
 * Each pose defines character transforms, articulated joint angles, smartphone position,
 * and camera target focal points for seamless transitions.
 */
const SELFIE_POSES: Pose[] = [
  {
    id: "lying_back_bed",
    title: "1. الاستلقاء على الظهر فوق السرير",
    shortTitle: "استلقاء على الظهر",
    category: "bed",
    description:
      "الشخص مستلقٍ على ظهره، يحمل الهاتف فوق وجهه لالتقاط صورة سيلفي علوية.",
    position: { x: -1.8, y: 0.88, z: -1.2 },
    rotation: { x: -Math.PI / 2, y: 0, z: 0 },
    joints: {
      head: { rx: 0.35, ry: 0, rz: 0 },
      spine: { rx: 0, ry: 0, rz: 0 },
      leftShoulder: { rx: 0.2, ry: 0, rz: -0.3 },
      rightShoulder: { rx: -1.25, ry: -0.3, rz: 0.4 },
      rightElbow: { rx: 0.5, ry: 0, rz: 0 },
      leftLeg: { rx: 0.05, ry: 0, rz: 0 },
      rightLeg: { rx: 0.05, ry: 0, rz: 0 },
    },
    camera: {
      position: { x: -1.8, y: 2.7, z: 0.3 },
      target: { x: -1.8, y: 0.95, z: -1.2 },
    },
  },
  {
    id: "lying_right_bed",
    title: "2. الاستلقاء على الجانب الأيمن",
    shortTitle: "الجانب الأيمن",
    category: "bed",
    description:
      "مستلقٍ على الجانب الأيمن، الرأس على الوسادة، والهاتف أمام الوجه.",
    position: { x: -1.8, y: 0.82, z: -1.2 },
    rotation: { x: -Math.PI / 2, y: 0, z: -Math.PI / 2 },
    joints: {
      head: { rx: 0.1, ry: 0.2, rz: 0.25 },
      spine: { rx: 0, ry: 0, rz: 0 },
      leftShoulder: { rx: -0.9, ry: 0.4, rz: -0.4 },
      rightShoulder: { rx: 0.4, ry: 0, rz: 0.8 },
      rightElbow: { rx: 0.2, ry: 0, rz: 0 },
      leftLeg: { rx: 0.4, ry: 0, rz: 0 },
      rightLeg: { rx: 0.2, ry: 0, rz: 0 },
    },
    camera: {
      position: { x: -0.1, y: 1.85, z: -0.7 },
      target: { x: -1.8, y: 0.9, z: -1.2 },
    },
  },
  {
    id: "lying_left_bed",
    title: "3. الاستلقاء على الجانب الأيسر",
    shortTitle: "الجانب الأيسر",
    category: "bed",
    description: "مستلقٍ على الجانب الأيسر بزاوية مريحة مع ظهور الوجه والهاتف.",
    position: { x: -1.8, y: 0.82, z: -1.2 },
    rotation: { x: -Math.PI / 2, y: 0, z: Math.PI / 2 },
    joints: {
      head: { rx: 0.1, ry: -0.2, rz: -0.25 },
      spine: { rx: 0, ry: 0, rz: 0 },
      leftShoulder: { rx: 0.3, ry: 0, rz: -0.8 },
      rightShoulder: { rx: -0.95, ry: -0.4, rz: 0.4 },
      rightElbow: { rx: 0.4, ry: 0, rz: 0 },
      leftLeg: { rx: 0.2, ry: 0, rz: 0 },
      rightLeg: { rx: 0.4, ry: 0, rz: 0 },
    },
    camera: {
      position: { x: -3.5, y: 1.85, z: -0.7 },
      target: { x: -1.8, y: 0.9, z: -1.2 },
    },
  },
  {
    id: "lying_prone_bed",
    title: "4. الاستلقاء على البطن",
    shortTitle: "استلقاء على البطن",
    category: "bed",
    description: "مستلقٍ على البطن فوق السرير، يرفع القدمين ويمد الهاتف أمامه.",
    position: { x: -1.8, y: 0.82, z: -1.0 },
    rotation: { x: Math.PI / 2, y: Math.PI, z: 0 },
    joints: {
      head: { rx: -0.45, ry: 0, rz: 0 },
      spine: { rx: -0.25, ry: 0, rz: 0 },
      leftShoulder: { rx: -1.3, ry: 0.2, rz: -0.2 },
      rightShoulder: { rx: -1.35, ry: -0.3, rz: 0.3 },
      rightElbow: { rx: 0.8, ry: 0, rz: 0 },
      leftLeg: { rx: -0.85, ry: 0, rz: 0 },
      rightLeg: { rx: -0.95, ry: 0, rz: 0 },
    },
    camera: {
      position: { x: -1.8, y: 1.8, z: 0.9 },
      target: { x: -1.8, y: 1.15, z: -1.2 },
    },
  },
  {
    id: "sitting_edge_bed",
    title: "5. الجلوس على حافة السرير",
    shortTitle: "حافة السرير",
    category: "bed",
    description:
      "جالس على حافة السرير، جسمه مائل قليلاً والهاتف مرفوع أمام الوجه.",
    position: { x: -0.3, y: 0.72, z: -0.4 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    joints: {
      head: { rx: -0.1, ry: -0.2, rz: 0.1 },
      spine: { rx: 0.1, ry: 0, rz: 0 },
      leftShoulder: { rx: 0.2, ry: 0, rz: -0.3 },
      rightShoulder: { rx: -1.15, ry: -0.4, rz: 0.3 },
      rightElbow: { rx: 0.6, ry: 0, rz: 0 },
      leftLeg: { rx: 1.4, ry: 0, rz: 0 },
      rightLeg: { rx: 1.4, ry: 0, rz: 0 },
    },
    camera: {
      position: { x: 1.5, y: 1.45, z: 1.1 },
      target: { x: -0.3, y: 1.05, z: -0.4 },
    },
  },
  {
    id: "sitting_middle_bed",
    title: "6. الجلوس في منتصف السرير",
    shortTitle: "منتصف السرير",
    category: "bed",
    description:
      "جالس بظهر مستقيم فوق السرير يلتقط سيلفي بزاوية مرتفعة وجذابة.",
    position: { x: -1.8, y: 0.78, z: -1.4 },
    rotation: { x: 0, y: 0.3, z: 0 },
    joints: {
      head: { rx: -0.15, ry: -0.2, rz: 0.15 },
      spine: { rx: 0.05, ry: 0, rz: 0 },
      leftShoulder: { rx: 0.3, ry: 0, rz: -0.4 },
      rightShoulder: { rx: -1.35, ry: -0.5, rz: 0.4 },
      rightElbow: { rx: 0.4, ry: 0, rz: 0 },
      leftLeg: { rx: 1.2, ry: 0.4, rz: 0 },
      rightLeg: { rx: 1.2, ry: -0.4, rz: 0 },
    },
    camera: {
      position: { x: -0.4, y: 1.7, z: 0.7 },
      target: { x: -1.8, y: 1.15, z: -1.3 },
    },
  },
  {
    id: "sitting_sofa",
    title: "7. الجلوس على الأريكة",
    shortTitle: "على الأريكة",
    category: "sofa",
    description: "جالس على كرسي الاسترخاء بوضعية مريحة يحمل الهاتف بثبات.",
    position: { x: 2.4, y: 0.68, z: 1.1 },
    rotation: { x: 0, y: -0.6, z: 0 },
    joints: {
      head: { rx: -0.1, ry: 0.3, rz: 0.05 },
      spine: { rx: -0.15, ry: 0, rz: 0 },
      leftShoulder: { rx: 0.3, ry: 0, rz: -0.5 },
      rightShoulder: { rx: -1.1, ry: -0.3, rz: 0.2 },
      rightElbow: { rx: 0.5, ry: 0, rz: 0 },
      leftLeg: { rx: 1.35, ry: 0, rz: 0 },
      rightLeg: { rx: 1.35, ry: 0, rz: 0 },
    },
    camera: {
      position: { x: 0.7, y: 1.45, z: 2.8 },
      target: { x: 2.4, y: 0.95, z: 1.1 },
    },
  },
  {
    id: "sitting_side_sofa",
    title: "8. الجلوس جانبياً على الأريكة",
    shortTitle: "جانبي على الأريكة",
    category: "sofa",
    description:
      "جالس بزاوية جانبية على الأريكة مع الالتفات نحو كاميرا الهاتف.",
    position: { x: 2.45, y: 0.68, z: 1.1 },
    rotation: { x: 0, y: 0.8, z: 0 },
    joints: {
      head: { rx: 0.15, ry: -0.35, rz: -0.1 },
      spine: { rx: 0.1, ry: 0.1, rz: 0 },
      leftShoulder: { rx: 0.4, ry: 0, rz: -0.3 },
      rightShoulder: { rx: -0.95, ry: 0.2, rz: 0.2 },
      rightElbow: { rx: 0.7, ry: 0, rz: 0 },
      leftLeg: { rx: 1.2, ry: -0.5, rz: 0 },
      rightLeg: { rx: 1.2, ry: -0.3, rz: 0 },
    },
    camera: {
      position: { x: 3.9, y: 1.55, z: 2.5 },
      target: { x: 2.4, y: 0.95, z: 1.1 },
    },
  },
];

/* LIGHTING MODES CONFIGURATION */
const LIGHTING_MODES: Record<LightingModeKey, LightingMode> = {
  warm: {
    id: "warm",
    name: "إضاءة دافئة",
    bg: 0x1c1714,
    ambientColor: 0xffe3ca,
    ambientIntensity: 0.75,
    keyColor: 0xffcb9a,
    keyIntensity: 1.3,
    lampColor: 0xffa044,
    lampIntensity: 3.2,
    screenLight: 0xaa77ff,
  },
  white: {
    id: "white",
    name: "إضاءة بيضاء",
    bg: 0x12171e,
    ambientColor: 0xf0f5fa,
    ambientIntensity: 0.95,
    keyColor: 0xffffff,
    keyIntensity: 1.6,
    lampColor: 0xfff2e3,
    lampIntensity: 1.5,
    screenLight: 0x66ccff,
  },
  night: {
    id: "night",
    name: "ليلية خافتة",
    bg: 0x0a0c12,
    ambientColor: 0x182238,
    ambientIntensity: 0.35,
    keyColor: 0x3d5a80,
    keyIntensity: 0.45,
    lampColor: 0xff9100,
    lampIntensity: 4.5,
    screenLight: 0x00f0ff,
  },
};

/**
 * Procedurally generates the 3D bedroom environment including Bed,
 * Armchair, Nightstand, Windows, Floor, Rug, Plants, and Decorative Wall.
 */
function createBedroomEnvironment(scene: THREE.Scene): THREE.Group {
  const roomGroup = new THREE.Group();

  // Materials
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x8c5a3c,
    roughness: 0.35,
    metalness: 0.1,
  });

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xebdcd0,
    roughness: 0.8,
  });

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d2b1f,
    roughness: 0.4,
    metalness: 0.05,
  });

  const mattressMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8f9fa,
    roughness: 0.9,
  });

  const blanketMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b5998, // Elegant modern navy
    roughness: 0.7,
  });

  const pillowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
  });

  const sofaMaterial = new THREE.MeshStandardMaterial({
    color: 0xd97724, // Warm terracotta accent
    roughness: 0.6,
  });

  const rugMaterial = new THREE.MeshStandardMaterial({
    color: 0xded2c3,
    roughness: 0.95,
  });

  // 1. FLOOR
  const floorGeo = new THREE.PlaneGeometry(10, 10);
  const floor = new THREE.Mesh(floorGeo, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  roomGroup.add(floor);

  // Floor Grid Accent lines (Parquet illusion)
  const gridHelper = new THREE.GridHelper(10, 20, 0x5a4130, 0x4a3425);
  gridHelper.position.y = 0.001;
  roomGroup.add(gridHelper);

  // 2. WALLS
  // Back Wall
  const backWallGeo = new THREE.BoxGeometry(10, 4.5, 0.2);
  const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
  backWall.position.set(0, 2.25, -5.1);
  backWall.receiveShadow = true;
  roomGroup.add(backWall);

  // Left Wall
  const leftWallGeo = new THREE.BoxGeometry(0.2, 4.5, 10);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMaterial);
  leftWall.position.set(-5.1, 2.25, 0);
  leftWall.receiveShadow = true;
  roomGroup.add(leftWall);

  // Decorative Slat Wall Panel behind Bed
  const slatGroup = new THREE.Group();
  for (let i = -3.6; i <= 0.2; i += 0.2) {
    const slatGeo = new THREE.BoxGeometry(0.12, 4.4, 0.05);
    const slatMat = new THREE.MeshStandardMaterial({
      color: 0x5c3a21,
      roughness: 0.4,
    });
    const slat = new THREE.Mesh(slatGeo, slatMat);
    slat.position.set(i, 2.2, -4.95);
    slat.castShadow = true;
    slatGroup.add(slat);
  }
  roomGroup.add(slatGroup);

  // 3. RUG
  const rugGeo = new THREE.BoxGeometry(4.2, 0.02, 4.8);
  const rug = new THREE.Mesh(rugGeo, rugMaterial);
  rug.position.set(-1.6, 0.01, -0.8);
  rug.receiveShadow = true;
  roomGroup.add(rug);

  // 4. THE BED
  const bedGroup = new THREE.Group();
  bedGroup.position.set(-1.8, 0, -1.2);

  // Bed Frame
  const frameGeo = new THREE.BoxGeometry(3.1, 0.35, 3.7);
  const frame = new THREE.Mesh(frameGeo, woodMaterial);
  frame.position.set(0, 0.175, 0);
  frame.castShadow = true;
  frame.receiveShadow = true;
  bedGroup.add(frame);

  // Headboard
  const headboardGeo = new THREE.BoxGeometry(3.3, 1.8, 0.2);
  const headboard = new THREE.Mesh(headboardGeo, woodMaterial);
  headboard.position.set(0, 0.9, -1.8);
  headboard.castShadow = true;
  bedGroup.add(headboard);

  // Mattress
  const mattressGeo = new THREE.BoxGeometry(2.9, 0.45, 3.4);
  const mattress = new THREE.Mesh(mattressGeo, mattressMaterial);
  mattress.position.set(0, 0.525, 0.05);
  mattress.castShadow = true;
  mattress.receiveShadow = true;
  bedGroup.add(mattress);

  // Blanket/Duvet
  const blanketGeo = new THREE.BoxGeometry(2.92, 0.2, 2.1);
  const blanket = new THREE.Mesh(blanketGeo, blanketMaterial);
  blanket.position.set(0, 0.65, 0.6);
  blanket.castShadow = true;
  bedGroup.add(blanket);

  // Pillows
  for (const offset of [-0.85, 0.85]) {
    const pillowGeo = new THREE.BoxGeometry(0.9, 0.18, 0.55);
    const pillow = new THREE.Mesh(pillowGeo, pillowMaterial);
    pillow.position.set(offset, 0.8, -1.2);
    pillow.rotation.x = 0.2;
    pillow.castShadow = true;
    bedGroup.add(pillow);
  }

  roomGroup.add(bedGroup);

  // 5. NIGHTSTAND & LAMP
  const nightstandGroup = new THREE.Group();
  nightstandGroup.position.set(-3.8, 0, -2.6);

  const standGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
  const stand = new THREE.Mesh(standGeo, woodMaterial);
  stand.position.y = 0.3;
  stand.castShadow = true;
  nightstandGroup.add(stand);

  // Lamp Base & Shade
  const lampBaseGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.3, 16);
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.8,
    roughness: 0.2,
  });
  const lampBase = new THREE.Mesh(lampBaseGeo, lampMat);
  lampBase.position.set(0, 0.75, 0);
  nightstandGroup.add(lampBase);

  const shadeGeo = new THREE.CylinderGeometry(0.22, 0.3, 0.35, 16);
  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0xfff5e6,
    roughness: 0.3,
    emissive: 0x332211,
  });
  const shade = new THREE.Mesh(shadeGeo, shadeMat);
  shade.position.set(0, 1.0, 0);
  nightstandGroup.add(shade);

  roomGroup.add(nightstandGroup);

  // 6. SOFA / ARMCHAIR
  const sofaGroup = new THREE.Group();
  sofaGroup.position.set(2.4, 0, 1.1);
  sofaGroup.rotation.y = -0.6;

  // Base / Seat
  const seatGeo = new THREE.BoxGeometry(1.6, 0.4, 1.4);
  const seat = new THREE.Mesh(seatGeo, sofaMaterial);
  seat.position.y = 0.2;
  seat.castShadow = true;
  sofaGroup.add(seat);

  // Cushion
  const cushionGeo = new THREE.BoxGeometry(1.45, 0.22, 1.25);
  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0xeb8b38,
    roughness: 0.7,
  });
  const cushion = new THREE.Mesh(cushionGeo, cushionMat);
  cushion.position.y = 0.45;
  cushion.castShadow = true;
  sofaGroup.add(cushion);

  // Backrest
  const backGeo = new THREE.BoxGeometry(1.6, 1.1, 0.3);
  const back = new THREE.Mesh(backGeo, sofaMaterial);
  back.position.set(0, 0.8, -0.55);
  back.castShadow = true;
  sofaGroup.add(back);

  // Armrests
  for (const side of [-0.75, 0.75]) {
    const armGeo = new THREE.BoxGeometry(0.25, 0.6, 1.4);
    const arm = new THREE.Mesh(armGeo, sofaMaterial);
    arm.position.set(side, 0.5, 0);
    arm.castShadow = true;
    sofaGroup.add(arm);
  }

  roomGroup.add(sofaGroup);

  // 7. WINDOW
  const windowGroup = new THREE.Group();
  windowGroup.position.set(1.5, 2.4, -4.95);

  const frameOuterGeo = new THREE.BoxGeometry(2.4, 2.8, 0.1);
  const frameOuter = new THREE.Mesh(
    frameOuterGeo,
    new THREE.MeshStandardMaterial({ color: 0x222222 }),
  );
  windowGroup.add(frameOuter);

  const glassGeo = new THREE.PlaneGeometry(2.2, 2.6);
  const glassMat = new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.4,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.z = 0.06;
  windowGroup.add(glass);

  roomGroup.add(windowGroup);

  // 8. COFFEE TABLE & PLANT
  const coffeeTableGroup = new THREE.Group();
  coffeeTableGroup.position.set(1.0, 0, 1.7);

  const tableTopGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.06, 24);
  const tableTop = new THREE.Mesh(tableTopGeo, woodMaterial);
  tableTop.position.y = 0.42;
  tableTop.castShadow = true;
  coffeeTableGroup.add(tableTop);

  const legGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.42, 12);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(Math.cos(angle) * 0.35, 0.21, Math.sin(angle) * 0.35);
    leg.rotation.z = Math.cos(angle) * -0.15;
    leg.rotation.x = Math.sin(angle) * 0.15;
    leg.castShadow = true;
    coffeeTableGroup.add(leg);
  }

  // Plant Pot
  const potGeo = new THREE.CylinderGeometry(0.12, 0.09, 0.2, 16);
  const pot = new THREE.Mesh(
    potGeo,
    new THREE.MeshStandardMaterial({ color: 0xffffff }),
  );
  pot.position.set(0, 0.55, 0);
  coffeeTableGroup.add(pot);

  const plantGeo = new THREE.DodecahedronGeometry(0.18);
  const plant = new THREE.Mesh(
    plantGeo,
    new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 }),
  );
  plant.position.set(0, 0.72, 0);
  coffeeTableGroup.add(plant);

  roomGroup.add(coffeeTableGroup);

  scene.add(roomGroup);
  return roomGroup;
}

/**
 * Constructs an articulated 3D stylized human character with joint hierarchy:
 * Root -> Pelvis -> Torso -> Neck -> Head
 * Torso -> Shoulders -> Arms -> Forearms -> Hands (holds Smartphone)
 * Pelvis -> Thighs -> Lower Legs -> Feet
 */
function createArticulatedCharacter(scene: THREE.Scene): CharacterRig {
  const rootGroup = new THREE.Group();
  rootGroup.name = "CharacterRoot";

  // Materials
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xf3c5a5,
    roughness: 0.5,
    metalness: 0.05,
  });

  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c1d11,
    roughness: 0.8,
  });

  const shirtMaterial = new THREE.MeshStandardMaterial({
    color: 0xe63946, // Modern vibrant red sweater
    roughness: 0.6,
  });

  const pantsMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d3557, // Deep denim blue
    roughness: 0.7,
  });

  const phoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.2,
  });

  const screenMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
  });

  // HIERARCHY SETUP
  const pelvis = new THREE.Group();
  pelvis.name = "pelvis";
  rootGroup.add(pelvis);

  // Lower Body Geometry (Hips)
  const hipMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.18, 0.26),
    pantsMaterial,
  );
  hipMesh.position.y = 0.09;
  hipMesh.castShadow = true;
  pelvis.add(hipMesh);

  // TORSO
  const torso = new THREE.Group();
  torso.name = "torso";
  torso.position.y = 0.18;
  pelvis.add(torso);

  const chestMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.42, 0.24),
    shirtMaterial,
  );
  chestMesh.position.y = 0.21;
  chestMesh.castShadow = true;
  torso.add(chestMesh);

  // HEAD & NECK
  const headGroup = new THREE.Group();
  headGroup.name = "headGroup";
  headGroup.position.y = 0.44;
  torso.add(headGroup);

  // Neck
  const neckMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.08, 0.1, 16),
    skinMaterial,
  );
  neckMesh.position.y = 0.05;
  headGroup.add(neckMesh);

  // Head Mesh
  const headMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 24, 24),
    skinMaterial,
  );
  headMesh.scale.set(1, 1.15, 1);
  headMesh.position.y = 0.22;
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Stylized Hair Cap
  const hairMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.17, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMaterial,
  );
  hairMesh.position.set(0, 0.24, -0.01);
  headGroup.add(hairMesh);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  for (const eyeX of [-0.06, 0.06]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.02, 12, 12), eyeMat);
    eye.position.set(eyeX, 0.23, 0.14);
    headGroup.add(eye);
  }

  // LEFT ARM
  const leftShoulder = new THREE.Group();
  leftShoulder.name = "leftShoulder";
  leftShoulder.position.set(-0.22, 0.38, 0);
  torso.add(leftShoulder);

  const leftArmMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.05, 0.28, 12),
    shirtMaterial,
  );
  leftArmMesh.position.y = -0.14;
  leftArmMesh.castShadow = true;
  leftShoulder.add(leftArmMesh);

  const leftForearm = new THREE.Group();
  leftForearm.name = "leftForearm";
  leftForearm.position.y = -0.28;
  leftShoulder.add(leftForearm);

  const leftHandMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.048, 0.04, 0.26, 12),
    skinMaterial,
  );
  leftHandMesh.position.y = -0.13;
  leftHandMesh.castShadow = true;
  leftForearm.add(leftHandMesh);

  // RIGHT ARM (Holding Phone)
  const rightShoulder = new THREE.Group();
  rightShoulder.name = "rightShoulder";
  rightShoulder.position.set(0.22, 0.38, 0);
  torso.add(rightShoulder);

  const rightArmMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.05, 0.28, 12),
    shirtMaterial,
  );
  rightArmMesh.position.y = -0.14;
  rightArmMesh.castShadow = true;
  rightShoulder.add(rightArmMesh);

  const rightForearm = new THREE.Group();
  rightForearm.name = "rightForearm";
  rightForearm.position.y = -0.28;
  rightShoulder.add(rightForearm);

  const rightHandMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.048, 0.04, 0.24, 12),
    skinMaterial,
  );
  rightHandMesh.position.y = -0.12;
  rightHandMesh.castShadow = true;
  rightForearm.add(rightHandMesh);

  // SMARTPHONE
  const phoneGroup = new THREE.Group();
  phoneGroup.name = "phoneGroup";
  phoneGroup.position.set(0, -0.24, 0.08);
  phoneGroup.rotation.x = Math.PI / 4;
  rightForearm.add(phoneGroup);

  const phoneBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.24, 0.015),
    phoneMaterial,
  );
  phoneBody.castShadow = true;
  phoneGroup.add(phoneBody);

  const phoneScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.11, 0.22),
    screenMaterial,
  );
  phoneScreen.position.z = 0.009;
  phoneGroup.add(phoneScreen);

  // Phone screen glow light on face
  const screenLight = new THREE.PointLight(0xa855f7, 1.2, 1.5);
  screenLight.position.set(0, 0, 0.1);
  phoneGroup.add(screenLight);

  // LEFT LEG
  const leftLeg = new THREE.Group();
  leftLeg.name = "leftLeg";
  leftLeg.position.set(-0.1, 0, 0);
  pelvis.add(leftLeg);

  const leftThigh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.06, 0.38, 12),
    pantsMaterial,
  );
  leftThigh.position.y = -0.19;
  leftThigh.castShadow = true;
  leftLeg.add(leftThigh);

  const leftLowerLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.058, 0.05, 0.36, 12),
    skinMaterial,
  );
  leftLowerLeg.position.y = -0.56;
  leftLowerLeg.castShadow = true;
  leftLeg.add(leftLowerLeg);

  // RIGHT LEG
  const rightLeg = new THREE.Group();
  rightLeg.name = "rightLeg";
  rightLeg.position.set(0.1, 0, 0);
  pelvis.add(rightLeg);

  const rightThigh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.06, 0.38, 12),
    pantsMaterial,
  );
  rightThigh.position.y = -0.19;
  rightThigh.castShadow = true;
  rightLeg.add(rightThigh);

  const rightLowerLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.058, 0.05, 0.36, 12),
    skinMaterial,
  );
  rightLowerLeg.position.y = -0.56;
  rightLowerLeg.castShadow = true;
  rightLeg.add(rightLowerLeg);

  scene.add(rootGroup);

  return {
    rootGroup,
    pelvis,
    torso,
    headGroup,
    leftShoulder,
    rightShoulder,
    rightForearm,
    leftLeg,
    rightLeg,
    screenLight,
  };
}

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // State variables
  const [activePoseId, setActivePoseId] = useState<string>("lying_back_bed");
  const [activeLighting, setActiveLighting] = useState<LightingModeKey>("warm");
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [sceneState, setSceneState] = useState<SceneState>({
    shotType: "front-selfie",
    lightingMode: "as-in-photo",
    cameraDistance: "arm-length",
    cameraAngle: "eye-level",
    phonePosition: "front-of-face",
    clothingTop: "t-shirt",
    clothingBottom: "shorts",
    clothingMaterial: "cotton",
    clothingColor: "neutral",
    referenceProvided: false,
    identityPriority: "balanced",
    identityNotes: "",
    hairStyle: "natural",
    hairLength: "medium",
    hairTexture: "wavy",
    poseType: "standing",
    headDirection: "forward",
    shoulderPosition: "relaxed",
    handPlacement: "at-side",
    backPosture: "relaxed",
    faceExpression: "neutral",
    eyeDirection: "camera",
    mouthState: "closed",
    freeHandPosition: "at-side",
    handFingersState: "relaxed",
    handVisibility: "fully-visible",
    scenario: "none",
  });

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const characterRef = useRef<CharacterRig | null>(null);
  const lightsRef = useRef<{
    ambientLight?: THREE.AmbientLight;
    keyLight?: THREE.DirectionalLight;
    lampLight?: THREE.PointLight;
  }>({});

  // Targets for animation interpolation (Lerp)
  const animTargetsRef = useRef<AnimationTargets>({
    charPos: new THREE.Vector3(-1.8, 0.88, -1.2),
    charRot: new THREE.Euler(-Math.PI / 2, 0, 0),
    joints: {
      head: { rx: 0.35, ry: 0, rz: 0 },
      spine: { rx: 0, ry: 0, rz: 0 },
      leftShoulder: { rx: 0.2, ry: 0, rz: -0.3 },
      rightShoulder: { rx: -1.25, ry: -0.3, rz: 0.4 },
      rightElbow: { rx: 0.5, ry: 0, rz: 0 },
      leftLeg: { rx: 0.05, ry: 0, rz: 0 },
      rightLeg: { rx: 0.05, ry: 0, rz: 0 },
    },
    camPos: new THREE.Vector3(-1.8, 2.7, 0.3),
    camTarget: new THREE.Vector3(-1.8, 0.95, -1.2),
  });

  const currentPose =
    SELFIE_POSES.find((p) => p.id === activePoseId) || SELFIE_POSES[0];
  const englishPrompt = buildPromptEnglish(sceneState);
  const negativePrompt = buildNegativePrompt(sceneState);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE
    const scene = new THREE.Scene();
    const activeLightConfig = LIGHTING_MODES[activeLighting];
    scene.background = new THREE.Color(activeLightConfig.bg);
    scene.fog = new THREE.FogExp2(activeLightConfig.bg, 0.08);
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50,
    );
    camera.position.set(-1.8, 2.7, 0.3);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // prevent going below floor
    controls.minDistance = 1.2;
    controls.maxDistance = 8.5;
    controls.target.set(-1.8, 0.95, -1.2);
    controlsRef.current = controls;

    // 5. LIGHTS
    const ambientLight = new THREE.AmbientLight(
      activeLightConfig.ambientColor,
      activeLightConfig.ambientIntensity,
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
      activeLightConfig.keyColor,
      activeLightConfig.keyIntensity,
    );
    keyLight.position.set(3, 5, 2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const lampLight = new THREE.PointLight(
      activeLightConfig.lampColor,
      activeLightConfig.lampIntensity,
      6,
    );
    lampLight.position.set(-3.8, 1.1, -2.6);
    lampLight.castShadow = true;
    scene.add(lampLight);

    lightsRef.current = { ambientLight, keyLight, lampLight };

    // 6. ENVIRONMENT & CHARACTER
    createBedroomEnvironment(scene);
    const character = createArticulatedCharacter(scene);
    characterRef.current = character;

    setIsLoading(false);

    // 7. ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const lerpFactor = Math.min(delta * 4.5, 1.0); // Smooth fluid transitions

      // A. Smoothly interpolate character root position & rotation
      if (characterRef.current) {
        const charRoot = characterRef.current.rootGroup;
        const targets = animTargetsRef.current;

        charRoot.position.lerp(targets.charPos, lerpFactor);

        // Quaternion lerp for rotation
        const targetQuaternion = new THREE.Quaternion().setFromEuler(
          targets.charRot,
        );
        charRoot.quaternion.slerp(targetQuaternion, lerpFactor);

        // B. Interpolate joint angles
        const {
          headGroup,
          torso,
          leftShoulder,
          rightShoulder,
          rightForearm,
          leftLeg,
          rightLeg,
        } = characterRef.current;
        const j = targets.joints;

        headGroup.rotation.x = THREE.MathUtils.lerp(
          headGroup.rotation.x,
          j.head.rx,
          lerpFactor,
        );
        headGroup.rotation.y = THREE.MathUtils.lerp(
          headGroup.rotation.y,
          j.head.ry,
          lerpFactor,
        );
        headGroup.rotation.z = THREE.MathUtils.lerp(
          headGroup.rotation.z,
          j.head.rz,
          lerpFactor,
        );

        torso.rotation.x = THREE.MathUtils.lerp(
          torso.rotation.x,
          j.spine.rx,
          lerpFactor,
        );
        torso.rotation.y = THREE.MathUtils.lerp(
          torso.rotation.y,
          j.spine.ry,
          lerpFactor,
        );

        leftShoulder.rotation.x = THREE.MathUtils.lerp(
          leftShoulder.rotation.x,
          j.leftShoulder.rx,
          lerpFactor,
        );
        leftShoulder.rotation.y = THREE.MathUtils.lerp(
          leftShoulder.rotation.y,
          j.leftShoulder.ry,
          lerpFactor,
        );
        leftShoulder.rotation.z = THREE.MathUtils.lerp(
          leftShoulder.rotation.z,
          j.leftShoulder.rz,
          lerpFactor,
        );

        rightShoulder.rotation.x = THREE.MathUtils.lerp(
          rightShoulder.rotation.x,
          j.rightShoulder.rx,
          lerpFactor,
        );
        rightShoulder.rotation.y = THREE.MathUtils.lerp(
          rightShoulder.rotation.y,
          j.rightShoulder.ry,
          lerpFactor,
        );
        rightShoulder.rotation.z = THREE.MathUtils.lerp(
          rightShoulder.rotation.z,
          j.rightShoulder.rz,
          lerpFactor,
        );

        rightForearm.rotation.x = THREE.MathUtils.lerp(
          rightForearm.rotation.x,
          j.rightElbow.rx,
          lerpFactor,
        );

        leftLeg.rotation.x = THREE.MathUtils.lerp(
          leftLeg.rotation.x,
          j.leftLeg.rx,
          lerpFactor,
        );
        rightLeg.rotation.x = THREE.MathUtils.lerp(
          rightLeg.rotation.x,
          j.rightLeg.rx,
          lerpFactor,
        );
      }

      // C. Smoothly interpolate camera position & controls target
      if (cameraRef.current && controlsRef.current) {
        const targets = animTargetsRef.current;
        cameraRef.current.position.lerp(targets.camPos, lerpFactor);
        controlsRef.current.target.lerp(targets.camTarget, lerpFactor);
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. RESIZE HANDLER
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Update animation targets when pose changes
  const selectPose = useCallback((pose: Pose) => {
    setActivePoseId(pose.id);
    setSceneState((prev) => ({
      ...prev,
      poseType: mapPoseToSceneState(pose.id),
    }));
    animTargetsRef.current = {
      charPos: new THREE.Vector3(
        pose.position.x,
        pose.position.y,
        pose.position.z,
      ),
      charRot: new THREE.Euler(
        pose.rotation.x,
        pose.rotation.y,
        pose.rotation.z,
      ),
      joints: pose.joints,
      camPos: new THREE.Vector3(
        pose.camera.position.x,
        pose.camera.position.y,
        pose.camera.position.z,
      ),
      camTarget: new THREE.Vector3(
        pose.camera.target.x,
        pose.camera.target.y,
        pose.camera.target.z,
      ),
    };
  }, []);

  // Update light colors/intensities when lighting mode changes
  const changeLightingMode = useCallback((modeKey: LightingModeKey) => {
    setActiveLighting(modeKey);
    setSceneState((prev) => ({
      ...prev,
      lightingMode: mapLightingToSceneState(modeKey),
    }));
    const config = LIGHTING_MODES[modeKey];
    if (!config || !sceneRef.current) return;

    sceneRef.current.background = new THREE.Color(config.bg);
    sceneRef.current.fog!.color = new THREE.Color(config.bg);

    const { ambientLight, keyLight, lampLight } = lightsRef.current;
    if (ambientLight) {
      ambientLight.color.setHex(config.ambientColor);
      ambientLight.intensity = config.ambientIntensity;
    }
    if (keyLight) {
      keyLight.color.setHex(config.keyColor);
      keyLight.intensity = config.keyIntensity;
    }
    if (lampLight) {
      lampLight.color.setHex(config.lampColor);
      lampLight.intensity = config.lampIntensity;
    }
    if (characterRef.current && characterRef.current.screenLight) {
      characterRef.current.screenLight.color.setHex(config.screenLight);
    }
  }, []);

  // Reset to default initial pose
  const resetToDefault = useCallback(() => {
    selectPose(SELFIE_POSES[0]);
    changeLightingMode("warm");
  }, [selectPose, changeLightingMode]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none dir-rtl"
      dir="rtl"
    >
      {/* 3D CANVAS CONTAINER */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md z-50 transition-opacity duration-500">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <Sparkles className="absolute w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <p className="text-lg font-bold text-amber-300">
            جاري تحميل الغرفة ثلاثية الأبعاد...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            تجهيز الأثاث والإضاءة والنموذج
          </p>
        </div>
      )}

      {/* TOP HEADER & ACTIVE POSE BANNER */}
      <div className="absolute top-4 inset-x-4 flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none z-20">
        {/* App Title */}
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-slate-800 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl text-white shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base text-slate-100 leading-tight">
              غرفة النوم الحديثة 3D
            </h1>
            <p className="text-[11px] text-slate-400">
              محاكي وضعيات تصوير السيلفي
            </p>
          </div>
        </div>

        {/* Active Pose Title Indicator */}
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md border border-amber-500/30 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <Smartphone className="w-5 h-5 text-amber-400 animate-bounce" />
          <div className="text-center md:text-right">
            <span className="text-[10px] uppercase tracking-wider text-amber-400/90 font-semibold block">
              الوضعية الحالية:
            </span>
            <span className="text-xs md:text-sm font-bold text-amber-200">
              {currentPose.title}
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={resetToDefault}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded-xl text-slate-200 hover:text-amber-400 transition-all shadow-lg active:scale-95"
            title="إعادة الوضعية الافتراضية"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPanelVisible(!isPanelVisible)}
            className="p-2.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 rounded-xl text-slate-200 hover:text-amber-400 transition-all shadow-lg active:scale-95 flex items-center gap-1.5 text-xs font-medium"
            title="إظهار/إخفاء لوحة التحكم"
          >
            {isPanelVisible ? (
              <EyeOff className="w-4 h-4 text-rose-400" />
            ) : (
              <Eye className="w-4 h-4 text-emerald-400" />
            )}
            <span className="hidden sm:inline">
              {isPanelVisible ? "إخفاء التحكم" : "إظهار التحكم"}
            </span>
          </button>
        </div>
      </div>

      {/* CONTROLS PANEL (RESPONSIVE: SIDEBAR ON DESKTOP, BOTTOM DRAWER ON MOBILE) */}
      {isPanelVisible && (
        <div className="absolute bottom-0 inset-x-0 md:inset-x-auto md:top-20 md:left-4 md:bottom-6 w-full md:w-96 max-h-[60vh] md:max-h-[calc(100vh-7rem)] bg-slate-900/90 backdrop-blur-xl border-t md:border border-slate-800/90 rounded-t-3xl md:rounded-3xl shadow-2xl z-30 flex flex-col transition-all duration-300">
          {/* Panel Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-sm text-slate-100">
                اختيار وضعية السيلفي
              </h2>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
              8 وضعيات
            </span>
          </div>

          {/* LIGHTING CONTROLS */}
          <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800/60">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              نمط الإضاءة:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => changeLightingMode("warm")}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                  activeLighting === "warm"
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>دافئة</span>
              </button>

              <button
                onClick={() => changeLightingMode("white")}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                  activeLighting === "white"
                    ? "bg-sky-500/20 border-sky-500/50 text-sky-300 shadow-sm"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-sky-400" />
                <span>بيضاء</span>
              </button>

              <button
                onClick={() => changeLightingMode("night")}
                className={`py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                  activeLighting === "night"
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>ليلية</span>
              </button>
            </div>
          </div>

          {/* POSES LIST (SCROLLABLE) */}
          <div className="p-3 overflow-y-auto space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-700">
            {SELFIE_POSES.map((pose, idx) => {
              const isActive = pose.id === activePoseId;
              const IconComponent = pose.category === "bed" ? Bed : Armchair;

              return (
                <button
                  key={pose.id}
                  onClick={() => selectPose(pose)}
                  className={`w-full text-right p-3 rounded-2xl border transition-all duration-200 flex items-start gap-3 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-l from-amber-500/20 to-rose-500/10 border-amber-500/60 shadow-lg shadow-amber-500/5"
                      : "bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/50 text-slate-300"
                  }`}
                >
                  {/* Category Badge Icon */}
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-colors ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                        : "bg-slate-700/50 text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Pose Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3
                        className={`text-xs md:text-sm font-bold truncate ${isActive ? "text-amber-200" : "text-slate-200"}`}
                      >
                        {pose.title}
                      </h3>
                      {isActive && (
                        <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {pose.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <section className="p-4 border-t border-slate-800 bg-slate-900/95">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-200">
                Prompt (English)
              </h3>
            </div>
            <pre
              dir="ltr"
              className="max-h-28 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950/70 p-3 text-left text-[10px] leading-relaxed text-slate-300"
            >
              {englishPrompt}
            </pre>

            <div className="flex items-center justify-between mt-4 mb-3">
              <h3 className="text-sm font-bold text-slate-200">
                Negative Prompt
              </h3>
            </div>
            <pre
              dir="ltr"
              className="max-h-24 overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950/70 p-3 text-left text-[10px] leading-relaxed text-slate-300"
            >
              {negativePrompt}
            </pre>
          </section>

          {/* FOOTER INSTRUCTIONS */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 rounded-b-3xl flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-amber-400" />
              يمكنك تدوير المشهد بالسحب بالماوس أو اللمس
            </span>
            <span className="text-slate-500">Three.js + React</span>
          </div>
        </div>
      )}
    </div>
  );
}
