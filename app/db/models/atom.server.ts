export type NoteStructure = {
  data: {
    content: string;
  };
};

export type ContactStructure = {
  data: {
    fullName: string;
  };
};

export type AtomStructure<T = NoteStructure | ContactStructure> = {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  type: "note" | "contact";
} & T;

export class Atom {
  private static _baseUrl =
    "https://us-east-1.aws.data.mongodb-api.com/app/data-atlvy/endpoint/data/v1";
  private static _apiKey =
    "cHlUp98dhonFRL3PHhS0nIQzTZ1MmbD4TAXOGj2J4MaD05kDgoftyd03VCg6Apzo";

  static create = async (userId: string, document: object) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        document: {
          ...document,
          userId,
          createdAt: new Date().toUTCString(),
          updatedAt: new Date().toUTCString(),
        },
      });

      const newAtom = await fetch(`${this._baseUrl}/action/insertOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: this._apiKey,
        },
        body,
      });

      return {
        ok: newAtom.ok,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static get = async (userId: string) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        filter: {
          userId,
          deletedAt: {
            $exists: false,
          },
        },
        sort: {
          createdAt: -1,
        },
      });

      const atoms = await fetch(`${this._baseUrl}/action/find`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: this._apiKey,
        },
        body,
      });

      const atomsJson: { documents: AtomStructure[] } = await atoms.json();
      return atomsJson.documents;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  static update = async (userId: string, _id: string, document: object) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        filter: {
          _id: {
            $oid: _id,
          },
          userId,
        },
        update: {
          $set: {
            ...document,
            updatedAt: new Date().toUTCString(),
          },
        },
      });

      const updatedAtom = await fetch(`${this._baseUrl}/action/updateOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: this._apiKey,
        },
        body,
      });

      return {
        ok: updatedAtom.ok,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static softDelete = async (userId: string, _id: string) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        filter: {
          _id: {
            $oid: _id,
          },
          userId,
        },
        update: {
          $set: {
            deletedAt: new Date().toUTCString(),
          },
        },
      });

      const deletedAtom = await fetch(`${this._baseUrl}/action/updateOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey: this._apiKey,
        },
        body,
      });

      return {
        ok: deletedAtom.ok,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };
}
