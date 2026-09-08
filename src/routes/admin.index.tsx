import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    throw redirect({
      href: "/admin.html",
    });
  },
  head: () => ({
    meta: [
      { httpEquiv: "refresh", content: "0; url=/admin.html" },
      { title: "9forms.com — Form Builder Admin" },
    ],
  }),
  component: () => null,
});
