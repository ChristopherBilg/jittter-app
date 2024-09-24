import { Link } from "@remix-run/react";
import clsx from "clsx";
import { ReactNode } from "react";

const NavLink = ({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
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
