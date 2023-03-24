import LocalDatabase from "db-local";
import { mapKeys, pick } from "lodash-es";

const { Schema: createBaseSchema } = new LocalDatabase({ path: "./db" });

export const User = createSchema("User", {
  _id: { type: String, required: true, public: "id" },
  email: { type: String, required: true, public: true },
  fullName: { type: String, required: true, public: true },
  passwordHash: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  sessionSalt: { type: String, required: true },
});

function createSchema(schemaName, fields) {
  const schema = createBaseSchema(schemaName, fields);
  return Object.assign(schema, {
    $meta: fields,
    sanitize(model) {
      return mapKeys(
        pick(
          model,
          Object.entries(fields)
            .filter(([, desc]) => desc.public)
            .map(([name]) => name)
        ),
        (_value, key) => {
          if (fields[key].public !== true) return fields[key].public;
          return key;
        }
      );
    },
  });
}
