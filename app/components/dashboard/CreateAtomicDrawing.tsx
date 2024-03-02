import { PlusIcon } from "@heroicons/react/24/outline";
import { Form, useSubmit } from "@remix-run/react";
import { MouseEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { AtomType } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";

const CreateAtomicDrawing = () => {
  const submit = useSubmit();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [pressed, setPressed] = useState(false);
  const [x, setX] = useState<number | null>(null);
  const [y, setY] = useState<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    setContext(canvasRef.current.getContext("2d"));
  }, []);

  useEffect(() => {
    console.log(context);
  }, [context]);

  const drawCircle = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) => {
    if (!context) return;

    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
  };

  const drawLine = (
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) => {
    if (!context) return;

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = "black";
    context.lineWidth = 10 * 2;
    context.stroke();
  };

  const onInputDown = (
    e: MouseEvent<HTMLCanvasElement> | PointerEvent<HTMLCanvasElement>,
  ) => {
    if (!canvasRef.current) return;

    setPressed(true);

    const rect = canvasRef.current.getBoundingClientRect();
    const clickedX = e.clientX - rect.left;
    const clickedY = e.clientY - rect.top;

    setX(clickedX);
    setY(clickedY);
  };

  const onInputUp = () => {
    setPressed(false);

    setX(null);
    setY(null);
  };

  const onInputMove = (
    e: MouseEvent<HTMLCanvasElement> | PointerEvent<HTMLCanvasElement>,
  ) => {
    if (!canvasRef.current || !context || !pressed || !x || !y) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x2 = e.clientX - rect.left;
    const y2 = e.clientY - rect.top;

    drawCircle(context, x2, y2);
    drawLine(context, x, y, x2, y2);

    setX(x2);
    setY(y2);
  };

  return (
    <Form
      className="flex justify-between space-x-2 overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
      onSubmit={(e) => {
        if (!canvasRef.current || !context) return;

        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.set("_createdAt", new Date().getTime().toString());
        formData.set("content", canvasRef.current.toDataURL());

        submit(formData, { method: "POST", action: "/atoms", navigate: false });

        e.currentTarget.reset();
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
      }}
    >
      <canvas
        ref={canvasRef}
        id="atomic-drawing"
        className="w-11/12 touch-none rounded-md border border-gray-200 p-2"
        width={canvasRef.current?.clientWidth}
        height={(canvasRef.current?.clientWidth ?? 0) / 2}
        onMouseDown={onInputDown}
        onPointerDown={onInputDown}
        onMouseUp={onInputUp}
        onPointerUp={onInputUp}
        onMouseMove={onInputMove}
        onPointerMove={onInputMove}
      ></canvas>

      <button
        type="submit"
        className="h-fit rounded-md bg-green-700 text-white"
      >
        <span className="sr-only">Create drawing atom</span>
        <PlusIcon className="h-5 w-5 md:h-4 md:w-4" />
      </button>

      <input type="hidden" name="_action" value={AtomFormAction.CreateAtom} />
      <input type="hidden" name="_type" value={AtomType.Drawing} />
    </Form>
  );
};

export default CreateAtomicDrawing;
