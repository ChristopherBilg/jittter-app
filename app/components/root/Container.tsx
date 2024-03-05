import { Links, Meta } from "@remix-run/react";
import { ReactNode } from "react";

type ContainerProps = {
  title: string;
  children: ReactNode;
};

const Container = ({ title, children }: ContainerProps) => (
  <html lang="en" className="h-full scroll-smooth bg-white antialiased">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>

      <Meta />
      <Links />
    </head>

    <body className="flex h-full flex-col">
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        {children}
      </main>
    </body>
  </html>
);

export default Container;
