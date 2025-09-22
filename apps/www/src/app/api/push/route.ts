import { createClient } from "@supabase/supabase-js";
import admin, { type ServiceAccount } from "firebase-admin";
import serviceAccount from "@/app/utils/service-account.json";

interface Notification {
  id: string;
  user_id: string;
  body: string;
  title: string;
  url: string;
}

interface WebhookPayload {
  type: "INSERT";
  table: string;
  record: Notification;
  schema: "public";
}
const SUPABASE_URL = "https://api.manazl.site";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.F9bDVuOspKc2QfaJeXlBHRbuxWIlTwDwcAjqegaVbQM";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
    databaseURL:
      "https://mandubk-370d7-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

export async function POST(req: Request) {
  const payload: WebhookPayload = await req.json();
  const { data, error } = await supabase.auth.admin.getUserById(
    payload.record.user_id
  );
  if (error) throw Error("user data not found");
  const token = data!.user?.user_metadata?.fcm_token as string;
  if (!token) throw Error("user fcm token not found");
  const title = payload.record.title || "Manazl App";
  const body = payload.record.body || "You Have New Notification";
  const message = {
    notification: {
      title,
      body,
    },
    token: token,
  };

  const res = await admin
    .messaging()
    .send(message)
    .then((response: unknown) => {
      console.log("Successfully sent notification: ", response);
      return { message: "success" };
    })
    .catch((error: unknown) => {
      console.log("Error sending message: ", error);
      return { message: "notification send error" };
    });
  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
}
