import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { FormAction } from "~/app/routes/atoms/route";
import { CreateAtomSchema } from "~/app/routes/atoms/validate";

const CreateAtomicItem = () => {
  const fetcher = useFetcher();

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (fetcher.state === "idle") {
      formRef.current?.reset();
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form
      ref={formRef}
      method="POST"
      className="flex flex-col overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
      action="/atoms"
    >
      <input type="hidden" name="_action" value={FormAction.CreateNoteAtom} />

      <input
        type="text"
        name="content"
        placeholder="Add an atom"
        className="rounded-md border border-gray-200 p-2"
        maxLength={CreateAtomSchema.shape.content.maxLength ?? undefined}
        required
        // TODO: Use optimistic add
      />
    </fetcher.Form>
  );
};

export default CreateAtomicItem;
