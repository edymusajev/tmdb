import { Link } from "@tanstack/react-router";

export function BackToHomeLink() {
  return (
    <Link
      to="/"
      className="text-blue-500 hover:underline mb-4 inline-block"
      search={(prev) => ({ ...prev, page: prev.page ?? 1 })}
    >
      &larr; Back to Home
    </Link>
  );
}
