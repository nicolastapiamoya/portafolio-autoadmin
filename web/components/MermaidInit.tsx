"use client"
import { useEffect } from "react"

export default function MermaidInit() {
  useEffect(() => {
    import("mermaid").then((m) => {
      m.default.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#0d1520",
          primaryTextColor: "#00d4ff",
          primaryBorderColor: "#00d4ff",
          lineColor: "#00d4ff",
          secondaryColor: "#060c12",
          tertiaryColor: "#080d14",
          background: "#03080d",
          mainBkg: "#0d1520",
          nodeBorder: "#00d4ff",
          clusterBkg: "#060c12",
          titleColor: "#00d4ff",
          edgeLabelBackground: "#0d1520",
          fontFamily: "ui-monospace, monospace",
        },
        securityLevel: "loose",
      })
      m.default.run({ querySelector: ".mermaid" })
    })
  }, [])

  return null
}
