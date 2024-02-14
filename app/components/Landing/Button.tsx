import { Link } from "@remix-run/react";
import clsx from "clsx";
import { ComponentProps } from "react";

const Button = (
  props: ComponentProps<typeof Link> & { variant: "solid" | "outline" },
) => {
  return (
    <Link
      {...props}
      className={clsx(
        props.variant === "solid" &&
          "group inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
        props.variant === "outline" &&
          "group inline-flex items-center justify-center rounded-full px-4 py-2 text-sm ring-1 focus:outline-none",
      )}
      prefetch="viewport"
    />
  );
};

export default Button;
