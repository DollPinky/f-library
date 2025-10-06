import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-4xl">
        <strong>404</strong> : NotFound
      </h1>
      <Link
        className="font-medium text-blue-600 hover:text-blue-500 border px-5 py-2 rounded-lg"
        to={"/"}
      >
        Back to home
      </Link>
    </div>
  );
}
