import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Spring Hope — Form Builder Admin" },
      {
        name: "description",
        content: "Spring Hope clinical intake forms administration portal.",
      },
    ],
  }),
  component: AdminEmbedPage,
});

function AdminEmbedPage() {
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
        src="/admin.html"
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
