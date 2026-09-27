"use client";

import {
  backPostureOptions,
  cameraAngleOptions,
  cameraDistanceOptions,
  clothingBottomOptions,
  clothingColorOptions,
  clothingMaterialOptions,
  clothingTopOptions,
  eyeDirectionOptions,
  faceExpressionOptions,
  freeHandPositionOptions,
  hairLengthOptions,
  hairStyleOptions,
  hairTextureOptions,
  handFingersStateOptions,
  handVisibilityOptions,
  headDirectionOptions,
  identityPriorityOptions,
  lightingModeOptions,
  mouthStateOptions,
  phonePositionOptions,
  poseTypeOptions,
  shoulderPositionOptions,
  shotTypeOptions,
} from "../options";
import type { SceneState } from "../types";
import { CollapsibleSection } from "./CollapsibleSection";
import { SmartSelect } from "./SmartSelect";

type UpdateField = <K extends keyof SceneState>(
  field: K,
  value: SceneState[K],
) => void;

type PromptControlsProps = {
  state: SceneState;
  resolvedState: SceneState;
  updateField: UpdateField;
};

export function PromptControls({
  state,
  resolvedState,
  updateField,
}: PromptControlsProps) {
  return (
    <div className="grid gap-4">
      <CollapsibleSection title="الكاميرا" badge="3 حقول" defaultOpen>
        <SmartSelect
          id="shot-type"
          field="shotType"
          state={resolvedState}
          label="نوع اللقطة"
          options={shotTypeOptions}
          onChange={(value) =>
            updateField("shotType", value as SceneState["shotType"])
          }
        />
        <SmartSelect
          id="camera-distance"
          field="cameraDistance"
          state={resolvedState}
          label="مسافة الكاميرا"
          options={cameraDistanceOptions}
          onChange={(value) =>
            updateField(
              "cameraDistance",
              value as SceneState["cameraDistance"],
            )
          }
        />
        <SmartSelect
          id="camera-angle"
          field="cameraAngle"
          state={resolvedState}
          label="زاوية الكاميرا"
          options={cameraAngleOptions}
          onChange={(value) =>
            updateField("cameraAngle", value as SceneState["cameraAngle"])
          }
        />
      </CollapsibleSection>

      <CollapsibleSection title="الصورة المرجعية" badge="3 حقول">
        <label
          className="flex items-center gap-3 rounded-lg border border-white/20 bg-slate-900 p-3 sm:col-span-2"
          htmlFor="reference-provided"
        >
          <input
            id="reference-provided"
            type="checkbox"
            checked={state.referenceProvided}
            onChange={(event) =>
              updateField("referenceProvided", event.target.checked)
            }
            className="h-4 w-4 accent-amber-300"
          />
          لدي صورة مرجعية
        </label>

        <SmartSelect
          id="identity-priority"
          field="identityPriority"
          state={resolvedState}
          label="أولوية الحفاظ على الهوية"
          options={identityPriorityOptions}
          onChange={(value) =>
            updateField(
              "identityPriority",
              value as SceneState["identityPriority"],
            )
          }
          className="sm:col-span-2"
        />

        <label
          className="grid gap-2 sm:col-span-2"
          htmlFor="identity-notes"
        >
          ملاحظات عن الملامح (اختياري)
          <textarea
            id="identity-notes"
            value={state.identityNotes}
            onChange={(event) =>
              updateField("identityNotes", event.target.value)
            }
            placeholder="مثال: شعر قصير، حاجب رقيق، عيون واسعة"
            rows={3}
            maxLength={200}
            className="rounded-lg border border-white/20 bg-slate-900 p-3 text-slate-100"
          />
        </label>

        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200 sm:col-span-2">
          الصورة المرجعية هنا إعداد نصي فقط. لا يتم رفع صورة فعلية في هذه المرحلة.
        </p>
      </CollapsibleSection>

      <CollapsibleSection title="الإضاءة" badge="1 حقل" defaultOpen>
        <SmartSelect
          id="lighting-mode"
          field="lightingMode"
          state={resolvedState}
          label="نمط الإضاءة"
          options={lightingModeOptions}
          onChange={(value) =>
            updateField("lightingMode", value as SceneState["lightingMode"])
          }
          className="sm:col-span-2"
        />
      </CollapsibleSection>

      <CollapsibleSection title="الملابس" badge="4 حقول">
        <SmartSelect
          id="clothing-top"
          field="clothingTop"
          state={resolvedState}
          label="القطعة العلوية"
          options={clothingTopOptions}
          onChange={(value) =>
            updateField("clothingTop", value as SceneState["clothingTop"])
          }
        />
        <SmartSelect
          id="clothing-bottom"
          field="clothingBottom"
          state={resolvedState}
          label="القطعة السفلية"
          options={clothingBottomOptions}
          onChange={(value) =>
            updateField(
              "clothingBottom",
              value as SceneState["clothingBottom"],
            )
          }
        />
        <SmartSelect
          id="clothing-material"
          field="clothingMaterial"
          state={resolvedState}
          label="المادة"
          options={clothingMaterialOptions}
          onChange={(value) =>
            updateField(
              "clothingMaterial",
              value as SceneState["clothingMaterial"],
            )
          }
        />
        <SmartSelect
          id="clothing-color"
          field="clothingColor"
          state={resolvedState}
          label="اللون"
          options={clothingColorOptions}
          onChange={(value) =>
            updateField("clothingColor", value as SceneState["clothingColor"])
          }
        />
      </CollapsibleSection>

      <CollapsibleSection title="الشعر" badge="3 حقول">
        <SmartSelect
          id="hair-style"
          field="hairStyle"
          state={resolvedState}
          label="التسريحة"
          options={hairStyleOptions}
          onChange={(value) =>
            updateField("hairStyle", value as SceneState["hairStyle"])
          }
        />
        <SmartSelect
          id="hair-length"
          field="hairLength"
          state={resolvedState}
          label="الطول"
          options={hairLengthOptions}
          onChange={(value) =>
            updateField("hairLength", value as SceneState["hairLength"])
          }
        />
        <SmartSelect
          id="hair-texture"
          field="hairTexture"
          state={resolvedState}
          label="الملمس"
          options={hairTextureOptions}
          onChange={(value) =>
            updateField("hairTexture", value as SceneState["hairTexture"])
          }
        />
      </CollapsibleSection>

      <CollapsibleSection title="الوضعية" badge="4 حقول">
        <SmartSelect
          id="pose-type"
          field="poseType"
          state={resolvedState}
          label="الوضعية"
          options={poseTypeOptions}
          onChange={(value) =>
            updateField("poseType", value as SceneState["poseType"])
          }
        />
        <SmartSelect
          id="head-direction"
          field="headDirection"
          state={resolvedState}
          label="اتجاه الرأس"
          options={headDirectionOptions}
          onChange={(value) =>
            updateField("headDirection", value as SceneState["headDirection"])
          }
        />
        <SmartSelect
          id="shoulder-position"
          field="shoulderPosition"
          state={resolvedState}
          label="وضعية الكتفين"
          options={shoulderPositionOptions}
          onChange={(value) =>
            updateField(
              "shoulderPosition",
              value as SceneState["shoulderPosition"],
            )
          }
        />
        <SmartSelect
          id="back-posture"
          field="backPosture"
          state={resolvedState}
          label="وضعية الظهر"
          options={backPostureOptions}
          onChange={(value) =>
            updateField("backPosture", value as SceneState["backPosture"])
          }
        />
      </CollapsibleSection>

      <CollapsibleSection title="تعابير الوجه" badge="3 حقول">
        <SmartSelect
          id="face-expression"
          field="faceExpression"
          state={resolvedState}
          label="تعبير الوجه"
          options={faceExpressionOptions}
          onChange={(value) =>
            updateField(
              "faceExpression",
              value as SceneState["faceExpression"],
            )
          }
        />
        <SmartSelect
          id="eye-direction"
          field="eyeDirection"
          state={resolvedState}
          label="اتجاه النظر"
          options={eyeDirectionOptions}
          onChange={(value) =>
            updateField("eyeDirection", value as SceneState["eyeDirection"])
          }
        />
        <SmartSelect
          id="mouth-state"
          field="mouthState"
          state={resolvedState}
          label="حالة الفم"
          options={mouthStateOptions}
          onChange={(value) =>
            updateField("mouthState", value as SceneState["mouthState"])
          }
        />
      </CollapsibleSection>

      <CollapsibleSection title="اليد الحرة" badge="4 حقول">
        <SmartSelect
          id="free-hand-position"
          field="freeHandPosition"
          state={resolvedState}
          label="موقع اليد الحرة"
          options={freeHandPositionOptions}
          onChange={(value) =>
            updateField(
              "freeHandPosition",
              value as SceneState["freeHandPosition"],
            )
          }
        />
        <SmartSelect
          id="phone-position"
          field="phonePosition"
          state={resolvedState}
          label="موضع الهاتف"
          options={phonePositionOptions}
          onChange={(value) =>
            updateField("phonePosition", value as SceneState["phonePosition"])
          }
        />
        <SmartSelect
          id="hand-fingers-state"
          field="handFingersState"
          state={resolvedState}
          label="حالة الأصابع"
          options={handFingersStateOptions}
          onChange={(value) =>
            updateField(
              "handFingersState",
              value as SceneState["handFingersState"],
            )
          }
        />
        <SmartSelect
          id="hand-visibility"
          field="handVisibility"
          state={resolvedState}
          label="ظهور اليد في الإطار"
          options={handVisibilityOptions}
          onChange={(value) =>
            updateField("handVisibility", value as SceneState["handVisibility"])
          }
        />
      </CollapsibleSection>
    </div>
  );
}
