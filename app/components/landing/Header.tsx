import { Popover, Transition } from "@headlessui/react";
import { Link } from "@remix-run/react";
import clsx from "clsx";
import { Fragment, ReactNode } from "react";
import Container from "./Container";
import Logo from "./Logo";
import NavLink from "./NavLink";

type MobileNavLinkProps = {
  to: string;
  children: ReactNode;
};

const MobileNavLink = ({ to, children }: MobileNavLinkProps) => {
  return (
    <Popover.Button as={Link} to={to} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
};

type MobileNavIconProps = {
  open: boolean;
};

const MobileNavIcon = ({ open }: MobileNavIconProps) => {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0",
        )}
      />

      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0",
        )}
      />
    </svg>
  );
};

type NavigationLink = {
  to: string;
  label: string;
  isInMobileMenu: boolean;
};

const navigationLinks: NavigationLink[] = [
  {
    to: "#features",
    label: "Features",
    isInMobileMenu: true,
  },
  {
    to: "#testimonials",
    label: "Testimonials",
    isInMobileMenu: true,
  },
  {
    to: "#pricing",
    label: "Pricing",
    isInMobileMenu: true,
  },
  {
    to: "/contact-us",
    label: "Contact us",
    isInMobileMenu: true,
  },
];

type MobileNavigationProps = {
  isAuthenticated: boolean;
};

const MobileNavigation = ({ isAuthenticated }: MobileNavigationProps) => {
  return (
    <Popover>
      <Popover.Button
        className="ui-not-focus-visible:outline-none relative z-10 flex h-8 w-8 items-center justify-center"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>

      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-white p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            {navigationLinks
              .filter((link) => link.isInMobileMenu)
              .map((link) => (
                <MobileNavLink key={link.to} to={link.to}>
                  {link.label}
                </MobileNavLink>
              ))}

            <hr className="m-2 border-slate-300/40" />

            {isAuthenticated ? (
              <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
            ) : (
              <MobileNavLink to="/signin">Sign in</MobileNavLink>
            )}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
};

type HeaderProps = {
  isAuthenticated: boolean;
};

const Header = ({ isAuthenticated }: HeaderProps) => {
  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link to="#" aria-label="Home">
              <Logo />
            </Link>

            <div className="hidden md:flex md:gap-x-6">
              {navigationLinks.map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              {isAuthenticated ? (
                <NavLink to="/dashboard" className="font-bold">
                  My Dashboard
                </NavLink>
              ) : (
                <NavLink to="/signin" className="font-bold">
                  Sign In
                </NavLink>
              )}
            </div>

            <div className="-mr-1 md:hidden">
              <MobileNavigation isAuthenticated={isAuthenticated} />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
