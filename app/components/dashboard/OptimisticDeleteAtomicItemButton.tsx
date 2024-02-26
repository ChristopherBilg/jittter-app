import { XMarkIcon } from "@heroicons/react/24/outline";
import { Form, useSubmit } from "@remix-run/react";
import { AtomFormAction } from "~/app/routes/atoms/route";

type OptimisticDeleteAtomicItemButtonProps = {
  id: string;
};

const OptimisticDeleteAtomicItemButton = ({
  id,
}: OptimisticDeleteAtomicItemButtonProps) => {
  const submit = useSubmit();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        submit(formData, { method: "POST", action: "/atoms", navigate: false });
      }}
    >
      <input type="hidden" name="_action" value={AtomFormAction.DeleteAtom} />
      <input type="hidden" name="atomId" value={id} />

      <button type="submit" className="rounded-md bg-red-300 text-white">
        <span className="sr-only">Delete atom, {id}</span>
        <XMarkIcon className="h-5 w-5 md:h-4 md:w-4" />
      </button>
    </Form>
  );
};

export default OptimisticDeleteAtomicItemButton;
