import {
  RenderStep,
  SetStateStep,
  ScreenshotStep,
  TimelineStep,
  EffectStep
} from "./hooks";
import React, { Fragment, useEffect } from "react";

function ScreenshotComponent({ step }: { step: ScreenshotStep }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current && step.element) {
      ref.current.appendChild(step.element);
    }
  }, [step]);

  return (
    <div className="timeline-step">
      <div className="timeline-step-header">Painting to the screen</div>
      <div style={{ zoom: 0.5 }} ref={ref}></div>
    </div>
  );
}

function SetStateComponent({ step }: { step: SetStateStep }) {
  return (
    <div className="timeline-step">
      <div className="timeline-step-header">Render triggered</div>
      <pre>setState({`${JSON.stringify(step.value, null, 2)}`})</pre>
    </div>
  );
}
function EffectComponent({ step }: { step: EffectStep }) {
  return (
    <div className="timeline-step">
      <div className="timeline-step-header">Calling useEffects</div>
      <div style={{ width: "200px", maxHeight: "100px", overflow: "hidden" }}>
        useEffect called with dependencies: {JSON.stringify(step.deps, null, 2)}
      </div>
    </div>
  );
}
function RenderStepComponent({ step }: { step: RenderStep }) {
  return (
    <div className="timeline-step">
      <div className="timeline-step-header">
        {/* <img src= */}
        Rendering {`<${step.fnName} />`}
      </div>
      <div>
        <pre>{`function ${step.fnName}() {
    ...
    ...
}`}</pre>{" "}
      </div>
      {step.hooks.map((hook, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid gray",
            margin: "4px 0px"
          }}
        >
          <div
            style={{ flex: 1, backgroundColor: "lightblue", padding: "4px" }}
          >
            {hook.type}
          </div>
          <div style={{ flex: 0.4, fontWeight: "bold", padding: "4px" }}>
            {JSON.stringify(hook.value, null, 2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Timeline({ steps }: { steps: TimelineStep[] }) {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scroll({
        left: ref.current.scrollWidth,
        behavior: "smooth"
      });
    }
  }, [steps.length]);
  function renderStep(step: TimelineStep) {
    switch (step.type) {
      case "render":
        return <RenderStepComponent step={step} />;
      case "setState":
        return <SetStateComponent step={step} />;
      case "screenshot":
        return <ScreenshotComponent step={step} />;
      case "useEffect":
        return <EffectComponent step={step} />;
      default:
        return null;
    }
  }
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        overflow: "scroll"
      }}
    >
      {steps.map((step, idx) => {
        if (
          step.type === "screenshot" &&
          idx > 0 &&
          steps[idx - 1].type === "screenshot"
        ) {
          return null;
        }
        return (
          <Fragment key={idx}>
            {renderStep(step)}
            {(idx < steps.length - 1 && steps[idx + 1].type === "setState") ||
            idx === steps.length - 1 ? (
              <div
                style={{
                  minWidth: "100px",
                  height: "0",
                  border: "1px dashed gray",
                  borderWidth: "1px 0px"
                }}
              />
            ) : (
              <>
                <div style={{ minWidth: "15px", border: "1px solid black" }} />
              </>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
