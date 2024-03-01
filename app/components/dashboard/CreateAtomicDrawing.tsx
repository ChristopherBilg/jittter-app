import { Form, useSubmit } from "@remix-run/react";
import { useRef } from "react";
import { AtomType } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";

const CreateAtomicDrawing = () => {
  const submit = useSubmit();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Form
      className="flex flex-col overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.set("_createdAt", new Date().getTime().toString());

        submit(formData, { method: "POST", action: "/atoms", navigate: false });

        e.currentTarget.reset();
      }}
    >
      <input type="hidden" name="_action" value={AtomFormAction.CreateAtom} />
      <input type="hidden" name="_type" value={AtomType.Drawing} />

      <canvas
        ref={canvasRef}
        id="atomic-drawing"
        width="800"
        height="800"
      ></canvas>
    </Form>
  );
};

export default CreateAtomicDrawing;
