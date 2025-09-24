import React, { useState, useEffect } from "react";
import { Download, Copy, Check } from "lucide-react";
import "./yamlPreview.css";
import type { DbtTestSource } from "../types";
import { generateDbtSourceYaml } from "../utils";

interface YamlPreviewProps {
  sources: DbtTestSource[];
}

function YamlPreviewPanel({ sources }: YamlPreviewProps): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const [yamlContent, setYamlContent] = useState<string>("");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(yamlContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadYaml = () => {
    const blob = new Blob([yamlContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sources.yml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (sources.length === 0) {
      setYamlContent("version: 2\n\nsources: []");
      return;
    }
    const yaml = generateDbtSourceYaml(sources);

    setYamlContent(yaml);
  }, [sources]);

  return (
    <>
      <div className="yaml-panel">
        <div className="yaml-sticky">
          <div className="yaml-header">
            <h2 className="yaml-title">YAML Preview</h2>
            <div className="yaml-actions">
              <button
                onClick={copyToClipboard}
                className={`yaml-btn yaml-btn-copy`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={downloadYaml}
                className={`yaml-btn yaml-btn-download`}
              >
                <Download size={20} />
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="yaml-wrapper">
          <div className="yaml-box">
            <pre className="yaml-pre">
              {yamlContent || "YAML content will appear here..."}
            </pre>
          </div>
        </div>
      </div>
    </>
  );
}

export default YamlPreviewPanel;
