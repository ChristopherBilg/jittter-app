import { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Let us know what you're thinking",
    },
  ];
};

const ContactUsRoute = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl">Contact Us</h1>

      <div className="flex flex-col space-y-4">
        <Link to="/">Main page</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/account">Account Settings</Link>
        <Link to="/signout">Sign Out</Link>
      </div>
    </div>
  );
};

export default ContactUsRoute;
