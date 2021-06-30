import "./styles.css";
import React from "react";
import { Nudge } from "./Nudge";
import { useState, useTimeline } from "./hooks";

export const OrgNameContext = React.createContext<string | null>(null);

export default function App() {
  const [orgName, setOrgName] = useState("Chiboatle");
  return (
    <div className="app">
      <OrgNameContext.Provider value={orgName}>
        <Nudge />
      </OrgNameContext.Provider>
      {useTimeline("App")}
    </div>
  );
}
