import {
  AtomStructure,
  ContactStructure,
  NoteStructure,
  ReminderStructure,
} from "~/app/db/mongodb/atom.server";
import AtomicContact from "./AtomicContact";
import AtomicNote from "./AtomicNote";
import AtomicReminder from "./AtomicReminder";

type AtomicItemProps = {
  atom: AtomStructure;
};

const AtomicItem = ({ atom }: AtomicItemProps) => {
  switch (atom.type) {
    case "note":
      return <AtomicNote atom={atom as AtomStructure<NoteStructure>} />;
    case "contact":
      return <AtomicContact atom={atom as AtomStructure<ContactStructure>} />;
    case "reminder":
      return <AtomicReminder atom={atom as AtomStructure<ReminderStructure>} />;
    default:
      return null;
  }
};

export default AtomicItem;
