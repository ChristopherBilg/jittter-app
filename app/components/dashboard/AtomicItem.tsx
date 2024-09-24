import {
  AtomStructure,
  AtomType,
  ContactStructure,
  NoteStructure,
  ReminderStructure,
} from "~/app/db.server/mongodb/atom";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import AtomicContact from "./AtomicContact";
import AtomicNote from "./AtomicNote";
import AtomicReminder from "./AtomicReminder";

type AtomicItemProps = {
  atom: AtomStructure;
};

const AtomicItem = ({ atom }: AtomicItemProps) => {
  switch (atom.type) {
    case AtomType.Note:
      return <AtomicNote atom={atom as AtomStructure<NoteStructure>} />;
    case AtomType.Contact:
      return <AtomicContact atom={atom as AtomStructure<ContactStructure>} />;
    case AtomType.Reminder:
      return <AtomicReminder atom={atom as AtomStructure<ReminderStructure>} />;
    default: {
      exhaustiveMatchingGuard(atom.type);
      return null;
    }
  }
};

export default AtomicItem;
