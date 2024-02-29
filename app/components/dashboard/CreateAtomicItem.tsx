import { useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

const initialValue = [
  {
    children: [{ text: "" }],
  },
] as Descendant[];

const CreateAtomicItem = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <div className="flex flex-col overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className="rounded-md border border-gray-200 p-2"
          placeholder="Create an atom. Try typing '@', '#', or '/'"
        />
      </Slate>
    </div>
  );
};

export default CreateAtomicItem;
