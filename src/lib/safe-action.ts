import { currentUser } from "@clerk/nextjs/server";
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { isAdmin, isUser } from "./utils";

export class ActionError extends Error {}

export const action = createSafeActionClient({
  throwValidationErrors: false,
  defaultValidationErrorsShape: "flattened",
  handleServerError: error => {
    if (error instanceof ActionError) {
      return error.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authAction = action.use(async ({ next }) => {
  const user = await currentUser();

  if (!user) {
    throw new ActionError("Authentication failed");
  }

  return next({ ctx: { user } });
});

export const adminAction = authAction.use(async ({ next, ctx }) => {
  const userIsAdmin = isAdmin(ctx.user);

  if (!userIsAdmin) {
    throw new ActionError("You are not authorized to access this resource");
  }

  return next({ ctx });
});

export const userAction = authAction.use(async ({ next, ctx }) => {
  const userIsUser = isUser(ctx.user);

  if (!userIsUser) {
    throw new ActionError("You are not authorized to access this resource");
  }

  return next({ ctx });
});
