import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Welcome to Jittter!" }];
};

const LandingRoute = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Jittter!</h1>

        <Link to="/login" className="text-blue-500 underline">
          Login
        </Link>

        <Link to="/dashboard" className="text-blue-500 underline">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default LandingRoute;
