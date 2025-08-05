import { type } from "arktype";

import { serverEnv } from "~/env/server";

const OwnerEmailAddressesArk = type("string")
  .pipe((v) => v.split(",").map((v) => v.trim()))
  .pipe(type("string.email[]"));

const ownerEmails = OwnerEmailAddressesArk.assert(serverEnv.OWNER_EMAIL_ADDRESSES);

export function isOwner(email: string) {
  return ownerEmails.includes(email);
}
