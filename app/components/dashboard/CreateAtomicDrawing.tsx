import {
  ArrowDownIcon,
  ArrowUpIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
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
  const [width, setWidth] = useState(5);
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (!canvasRef.current) return;

    setContext(canvasRef.current.getContext("2d"));
  }, []);

  const onIncreaseLineWidthButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (width >= 20) setWidth(20);
    else setWidth((prev) => prev + 1);
  };

  const onDecreaseLineWidthButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (width <= 1) setWidth(1);
    else setWidth((prev) => prev - 1);
  };

  const drawCircle = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
  ) => {
    if (!context) return;

    context.beginPath();
    context.arc(x, y, width, 0, Math.PI * 2);
    context.fillStyle = color;
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
    context.strokeStyle = color;
    context.lineWidth = width * 2;
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
      method="POST"
      action="/atoms"
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

      <div className="flex flex-col space-y-2">
        <button
          type="submit"
          className="h-fit rounded-md bg-green-700 text-white"
        >
          <span className="sr-only">Create drawing atom</span>
          <PlusIcon className="h-5 w-5 md:h-4 md:w-4" />
        </button>

        <button
          className="h-fit rounded-md bg-gray-600 text-white"
          onClick={onIncreaseLineWidthButtonClick}
          disabled={width >= 20}
        >
          <span className="sr-only">Increase line width</span>
          <ArrowUpIcon className="h-5 w-5 md:h-4 md:w-4" />
        </button>

        <p className="self-center">{width}</p>

        <button
          className="h-fit rounded-md bg-gray-600 text-white"
          onClick={onDecreaseLineWidthButtonClick}
          disabled={width <= 1}
        >
          <span className="sr-only">Decrease line width</span>
          <ArrowDownIcon className="h-5 w-5 md:h-4 md:w-4" />
        </button>

        <input
          type="color"
          name="color"
          className="w-4"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <input type="hidden" name="_action" value={AtomFormAction.CreateAtom} />
      <input type="hidden" name="_type" value={AtomType.Drawing} />
    </Form>
  );
};

export default CreateAtomicDrawing;
