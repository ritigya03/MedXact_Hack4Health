// components/VaccineChatbot.jsx
"use client";
import { useEffect } from "react";

const VaccineChatbot = () => {
  useEffect(() => {
    // Cleanup any previous MedXact Advisor widget
    const oldWidget = document.getElementById("omnidimension-dashboard-widget");
    if (oldWidget) oldWidget.remove();

    const oldIframe = document.querySelector("iframe[src*='omnidim']");
    if (oldIframe) oldIframe.remove();

    // Load new Vaccine Advisor widget
    const scriptId = "omnidimension-vaccine-widget";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src =
        "https://backend.omnidim.io/web_widget.js?secret_key=d6f1d40e85228d89cd552abfa6841d47"; // ideally use a separate key if possible
      document.body.appendChild(script);

      script.onload = () => {
        const interval = setInterval(() => {
          const iframe = document.querySelector("iframe[src*='omnidim']");
          if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            const header = iframeDoc?.querySelector("header div");

            if (header) {
              header.textContent = "💉 Vaccine Advisor";
              clearInterval(interval);
            }
          }
        }, 500);
      };
    }

    return () => {
      const script = document.getElementById(scriptId);
      if (script) script.remove();

      const iframe = document.querySelector("iframe[src*='omnidim']");
      if (iframe) iframe.remove();
    };
  }, []);

  return null;
};

export default VaccineChatbot;
