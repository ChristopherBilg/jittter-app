import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "Jittter | Welcome!" },
    { name: "description", content: "Welcome to Jittter!" },
  ];
};

const Landing = () => {
  return (
    <div className="m-3">
      <h1 className="text-3xl font-bold underline">
        Welcome to the Jittter web application!
      </h1>
    </div>
  );
};

export default Landing;
