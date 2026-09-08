import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    throw redirect({
      href: "/admin.html#/login",
    });
  },
  head: () => ({
    meta: [
      { httpEquiv: "refresh", content: "0; url=/admin.html#/login" },
      { title: "Staff Login — 9forms.com" },
    ],
  }),
  component: () => null,
});
