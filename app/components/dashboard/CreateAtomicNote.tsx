import { Form, useSubmit } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { CreateNoteAtomSchema } from "~/app/routes/atoms/validate";

type CreateAtomicNoteProps = {
  backoutOfScope: () => void;
};

const CreateAtomicNote = ({ backoutOfScope }: CreateAtomicNoteProps) => {
  const submit = useSubmit();

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      <input type="hidden" name="_type" value="note" />

      <input
        ref={inputRef}
        type="text"
        name="content"
        placeholder="Add a note"
        className="rounded-md border border-gray-200 p-2"
        maxLength={CreateNoteAtomSchema.shape.content.maxLength ?? undefined}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && e.currentTarget.value === "") {
            backoutOfScope();
          }
        }}
        required
      />
    </Form>
  );
};

export default CreateAtomicNote;
