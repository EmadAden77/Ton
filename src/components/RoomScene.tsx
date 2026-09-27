import type { SceneState } from "@/features/prompt-studio/types";

interface RoomSceneProps {
  poseType: SceneState["poseType"];
  headDirection: SceneState["headDirection"];
}

const POSE_POSITIONS: Record<
  SceneState["poseType"],
  { x: number; y: number; rotation: number }
> = {
  standing: { x: 215, y: 160, rotation: 0 },
  "standing-window": { x: 200, y: 70, rotation: 180 },
  "standing-wardrobe": { x: 315, y: 125, rotation: 90 },
  "leaning-dresser": { x: 350, y: 230, rotation: 65 },
  "sitting-chair": { x: 320, y: 230, rotation: -90 },
  "sitting-bed": { x: 90, y: 175, rotation: 90 },
  "sitting-bed-edge": { x: 120, y: 205, rotation: 90 },
  "sitting-bed-cross-legged": { x: 78, y: 125, rotation: 35 },
  "reclining-headboard": { x: 72, y: 82, rotation: 0 },
  "lying-bed": { x: 70, y: 110, rotation: 0 },
};

const HEAD_ROTATIONS: Record<SceneState["headDirection"], number> = {
  forward: 0,
  "slightly-left": -20,
  "slightly-right": 20,
  down: 0,
  "up-soft": 0,
};

export default function RoomScene({ poseType, headDirection }: RoomSceneProps) {
  const position = POSE_POSITIONS[poseType];
  const rotation = position.rotation + HEAD_ROTATIONS[headDirection];
  const markerColor = headDirection === "down" ? "#60a5fa" : "#7dd3fc";

  return (
    <svg
      width="400"
      height="300"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="room-scene-title room-scene-description"
      className="min-h-[225px] w-full max-w-[400px]"
    >
      <title id="room-scene-title">عرض الغرفة من الأعلى</title>
      <desc id="room-scene-description">
        مخطط مبسط للغرفة يوضح الأثاث وموقع الشخص واتجاهه حسب الوضعية المختارة.
      </desc>

      <rect width="400" height="300" rx="12" fill="#6b6b6b" />

      <rect x="20" y="60" width="100" height="100" rx="8" fill="#3a3a3a" />
      <rect x="28" y="68" width="84" height="18" rx="5" fill="#2f2f2f" />
      <circle cx="130" cy="60" r="10" fill="#d6b477" />

      <rect x="120" y="12" width="170" height="18" rx="3" fill="#1e1e1e" />

      <rect x="300" y="50" width="35" height="150" rx="4" fill="#4a4a4a" />
      <rect x="340" y="50" width="40" height="150" rx="4" fill="#4a4a4a" />
      <line x1="317.5" y1="55" x2="317.5" y2="195" stroke="#707070" />
      <line x1="360" y1="55" x2="360" y2="195" stroke="#707070" />

      <rect x="340" y="210" width="40" height="50" rx="3" fill="#4a4a4a" />

      <rect x="150" y="100" width="130" height="120" rx="6" fill="#b8a890" />

      <path
        d="M20 300 L20 280 A20 20 0 0 1 40 300"
        fill="none"
        stroke="#d1d5db"
        strokeWidth="3"
      />

      <rect x="4" y="95" width="8" height="60" rx="2" fill="#cbd5e1" />

      <text x="18" y="28" fill="#e2e8f0" fontSize="12" fontWeight="600">
        أنت هنا
      </text>

      <g
        transform={`translate(${position.x} ${position.y}) rotate(${rotation})`}
      >
        <circle
          r="20"
          fill={markerColor}
          stroke="#0f172a"
          strokeWidth="2"
          opacity="0.95"
        />

        <circle cx="0" cy="-7" r="4" fill="#0f172a" />
        <line
          x1="0"
          y1="-2"
          x2="0"
          y2="8"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="-7"
          y1="2"
          x2="7"
          y2="2"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="8"
          x2="-6"
          y2="14"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="0"
          y1="8"
          x2="6"
          y2="14"
          stroke="#0f172a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path d="M0 -28 L-6 -20 L6 -20 Z" fill="#bae6fd" />
      </g>
    </svg>
  );
}
