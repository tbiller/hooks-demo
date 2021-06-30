import React from "react";
import { render } from "react-dom";
import Timeline from "./Timeline";

type Hook = { type: string; value: unknown };

export type RenderStep = { type: "render"; fnName: string; hooks: Hook[] };
export type SetStateStep = {
  type: "setState";
  value: unknown;
};
export type ScreenshotStep = { type: "screenshot"; element: Node | undefined };
export type EffectStep = { type: "useEffect"; deps?: unknown[] };

export type TimelineStep =
  | SetStateStep
  | ScreenshotStep
  | RenderStep
  | EffectStep;

const timeline: TimelineStep[] = [];

let freshHooks: Hook[] = [];

/** Wrapped React hooks */
export const useState: typeof React.useState = (
  ...args: Parameters<typeof React.useState>
) => {
  const [state, setState] = React.useState(...args);
  freshHooks.push({ type: "useState", value: state });

  const wrappedSetState = React.useCallback((value) => {
    timeline.push({ type: "setState", value });
    setState(value);
  }, []);

  return [state, wrappedSetState] as ReturnType<typeof React.useState>;
};

export const useContext: typeof React.useContext = (context) => {
  const result = React.useContext(context);
  freshHooks.push({ type: "useContext", value: result });
  return result;
};

export const useEffect: typeof React.useEffect = (effect, deps) => {
  React.useEffect(() => {
    timeline.push({ type: "useEffect", deps: deps as unknown[] });
    return effect();
  }, deps);
};

/** Timeline fns */

export const renderOver = (key: unknown, fnName: string) => {
  timeline.push({ type: "render", fnName, hooks: freshHooks });
  freshHooks = [];
};

function updateTimeline() {
  render(
    <Timeline steps={timeline} />,
    document.getElementById("timeline-root")
  );
}

export const refCallback = (
  key: unknown,
  el: HTMLElement | null
): false | undefined => {
  // The unmounting & mounting here refers to the function instance passed to the ref,
  // not necessarily the component itself.
  if (!el) {
    // unmounting
    return;
  }

  // element has been rendered
  // grab existing element
  const existingVersion = document.getElementById("nudge-container");
  const copy = existingVersion?.cloneNode(true);
  if (existingVersion && copy) {
    const bgColor = window.getComputedStyle(existingVersion).backgroundColor;
    ((copy.getRootNode() as unknown) as HTMLElement).style.backgroundColor = bgColor;
  }
  timeline.push({ type: "screenshot", element: copy });
  updateTimeline();
};

export const useTimeline = (fnName: string) => {
  const key = React.useRef(Math.random().toFixed(10));
  renderOver(key.current, fnName);
  return (
    <div
      ref={(ref) => {
        refCallback(key.current, ref);
      }}
    />
  );
};

export function useRerender() {
  const [state, setState] = React.useState(false);
  return () => setState(!state);
}
