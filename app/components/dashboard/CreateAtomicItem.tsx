import { useEffect, useRef, useState } from "react";
import { AtomStructure } from "~/app/db.server/mongodb/atom";
import CreateAtomicNote from "./CreateAtomicNote";

const CreateAtomicItem = () => {
  const [currentAtomTypeSelected, setCurrentAtomTypeSelected] = useState<
    AtomStructure["type"] | null
  >(null);

  const backoutOfScope = () => setCurrentAtomTypeSelected(null);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (currentAtomTypeSelected === null) inputRef.current?.focus();
  }, [currentAtomTypeSelected]);

  switch (currentAtomTypeSelected) {
    case "note":
      return <CreateAtomicNote backoutOfScope={backoutOfScope} />;
    case "contact": // TODO: Implement creating a contact
    case "reminder": // TODO: Implement creating a reminder
    default:
      return (
        <div className="flex flex-col overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Use / to view available atoms"
            className="rounded-md border border-gray-200 p-2"
            onKeyDown={(e) => {
              // TODO: Implement real / command handling
              if (e.key === "/" && e.currentTarget.value === "") {
                e.preventDefault();
                setCurrentAtomTypeSelected("note");
              }
            }}
            maxLength={128}
          />
        </div>
      );
  }
};

export default CreateAtomicItem;
