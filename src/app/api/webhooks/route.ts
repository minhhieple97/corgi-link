/* eslint-disable @typescript-eslint/no-explicit-any */

import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { db, eq } from "@/db";
import { env } from "@/env";
import { userRoleEnum, users } from "@/db/schema";

const validateRequest = async (request: Request) => {
  const payloadString = await request.text();
  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(env.CLERK_WEBHOOK_SIGNING_SECRET);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
};

export async function POST(req: Request) {
  const payload = await validateRequest(req);
  const body = JSON.stringify(payload);

  try {
    await handleWebhookEvent(payload, body);
    return Response.json({ message: "Received webhook" });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return new Response("Webhook verification failed", { status: 400 });
  }
}

const handleWebhookEvent = async (event: WebhookEvent, rawBody: string) => {
  const data = JSON.parse(rawBody).data;
  switch (event.type) {
    case "user.created":
      await handleUserCreated(data);
      break;
    case "user.updated":
      await handleUserUpdated(data);
      break;
    case "user.deleted":
      await handleUserDeleted(data.id);
      break;
  }
};

const handleUserCreated = async (data: any) => {
  const userData = prepareUserData(data);

  try {
    await db.insert(users).values({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      role: userData.role,
    });

    await updateClerkMetadata(userData.id, userData.role);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

const handleUserUpdated = async (data: any) => {
  const userData = prepareUserData(data);

  try {
    await db
      .update(users)
      .set({
        name: userData.name,
        email: userData.email,
        image: userData.image,
        role: userData.role,
      })
      .where(eq(users.id, userData.id));

    await updateClerkMetadata(userData.id, userData.role);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

const prepareUserData = (data: any) => {
  const roleValues = userRoleEnum.enumValues;
  const defaultRole = roleValues[0];

  return {
    id: data.id,
    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
    email: data.email_addresses?.[0]?.email_address,
    image: data.image_url,
    role: data.private_metadata?.role || defaultRole,
  };
};

const updateClerkMetadata = async (userId: string, role: string) => {
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    privateMetadata: {
      role,
    },
  });
};

const handleUserDeleted = async (userId: string) => {
  await db.delete(users).where(eq(users.id, userId));
};
