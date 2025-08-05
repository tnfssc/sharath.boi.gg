import { useQueryClient } from "@tanstack/react-query";

import { auth } from "~/lib/auth";
import { queries } from "~/query";

import { Button } from "./ui/button";
import { EasyTooltip } from "./ui/easy-tooltip";

export const AccountButton = () => {
  const authState = auth.useSession();
  const queryClient = useQueryClient();

  const emailAddress = authState.data?.user.email;

  const handleSignIn = async () => {
    await auth.signIn.social({ provider: "google" });
    await queryClient.invalidateQueries(queries.isOwner());
  };

  const handleSignOut = async () => {
    await auth.signOut();
    await queryClient.invalidateQueries(queries.isOwner());
  };

  return (
    <EasyTooltip asChild label={emailAddress ?? "Not logged in"}>
      <Button disabled={authState.isPending} onClick={authState.data ? handleSignOut : handleSignIn} size="sm">
        {authState.data ? "Sign out" : "Sign in"}
      </Button>
    </EasyTooltip>
  );
};
