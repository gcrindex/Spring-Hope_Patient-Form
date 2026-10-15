import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/business/")({
  head: () => ({
    meta: [
      { httpEquiv: "refresh", content: "0; url=/business.html" },
      { title: "9forms.com — Business Portal" },
    ],
  }),
  component: BusinessRedirectPage,
});

function BusinessRedirectPage() {
  useEffect(() => {
    try {
      const search = window.location.search || "";
      const hash = window.location.hash || "";
      window.location.replace(`/business.html${search}${hash}`);
    } catch {
      window.location.replace("/business.html");
    }
  }, []);

  return null;
}
