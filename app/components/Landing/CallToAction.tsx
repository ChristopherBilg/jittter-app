import Button from "./Button";
import Container from "./Container";

const CallToAction = () => {
  return (
    <section className="relative overflow-hidden bg-blue-600 py-32">
      <img
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src=""
        alt=""
        width={0}
        height={0}
      />

      {/* TODO: Clean up the UI for this component. */}
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Get started today
          </h2>

          <p className="mt-4 text-lg tracking-tight text-white">
            It's time to take control of your life. Create an account and start
            your journey today.
          </p>

          <Button to="/register" variant="solid" className="mt-10">
            Register Now
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default CallToAction;
