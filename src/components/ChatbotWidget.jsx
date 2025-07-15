// components/ChatbotWidget.jsx
import { useEffect } from "react";

const ChatbotWidget = () => {
  useEffect(() => {
    if (!document.getElementById("omnidimension-web-widget")) {
      const script = document.createElement("script");
      script.id = "omnidimension-web-widget";
      script.async = true;
      script.src =
        "https://backend.omnidim.io/web_widget.js?secret_key=d6f1d40e85228d89cd552abfa6841d47";
      document.body.appendChild(script);
    }

    return () => {
      const script = document.getElementById("omnidimension-web-widget");
      if (script) {
        script.remove();
      }

      const iframe = document.querySelector("iframe[src*='omnidim']");
      if (iframe) {
        iframe.remove();
      }
    };
  }, []);

  return null;
};

export default ChatbotWidget;
