import { AtomStructure, DrawingStructure } from "~/app/db.server/mongodb/atom";
import OptimisticDeleteAtomicItemButton from "./OptimisticDeleteAtomicItemButton";

type AtomicDrawingProps = {
  atom: AtomStructure<DrawingStructure>;
};

const AtomicDrawing = ({ atom }: AtomicDrawingProps) => {
  return (
    <div className="flex justify-between space-x-2 overflow-hidden border-l-2 border-t-2 border-orange-600 bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
      <img
        className="h-auto w-11/12 rounded-md border border-gray-200 p-2"
        src={atom.data.content}
        alt=""
      />

      <OptimisticDeleteAtomicItemButton id={atom._id} />
    </div>
  );
};

export default AtomicDrawing;
