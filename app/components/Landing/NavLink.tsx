import { Link } from "@remix-run/react";
import clsx from "clsx";

const NavLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Link
      to={href}
      prefetch="viewport"
      className={clsx(
        "inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
