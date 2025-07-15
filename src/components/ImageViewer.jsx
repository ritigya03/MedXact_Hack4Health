"use client";

import React from "react";

export default function ImageViewer({ url, name }) {
  return (
    <div className="text-center">
      <img
        src={url}
        alt={name}
        className="max-w-full max-h-[60vh] mx-auto rounded-lg shadow-lg"
      />
    </div>
  );
}
