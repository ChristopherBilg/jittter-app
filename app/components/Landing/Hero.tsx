import Container from "./Container";

const Hero = () => {
  return (
    <Container className="pb-16 pt-20 text-center lg:pt-32">
      <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        Productivity workflows{" "}
        <span className="relative whitespace-nowrap text-[#2563EB]">
          made simple
        </span>{" "}
        for everyone
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        Most personal productivity and task management software is needlessly
        complicated and very opinionated. We make the opposite trade-off, and
        remove all friction, while allowing you to customize your workflows to
        your heart's content.
      </p>
    </Container>
  );
};

export default Hero;
