import { Link } from "@remix-run/react";
import clsx from "clsx";

const NavLink = ({
  to,
  children,
  className,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Link
      to={to}
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
