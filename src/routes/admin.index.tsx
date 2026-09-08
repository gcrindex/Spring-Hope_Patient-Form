import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "9forms.com — Form Builder Admin" },
      {
        name: "description",
        content: "9forms.com multi-industry form builder and admin portal.",
      },
    ],
  }),
  component: AdminEmbedPage,
});

function AdminEmbedPage() {
  const [iframeSrc, setIframeSrc] = useState("/admin.html");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      setIframeSrc(`/admin.html${window.location.hash}`);
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 99999,
        overflow: "hidden",
        backgroundColor: "#F4F6F9",
      }}
    >
      <iframe
        src={iframeSrc}
        title="Spring Hope — Form Builder Admin"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
