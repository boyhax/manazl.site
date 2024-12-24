import { createClient } from 'npm:@supabase/supabase-js@2'
import admin, { ServiceAccount } from 'npm:firebase-admin'
import serviceAccount from '../service-account.json' with { type: 'json' }
import { JWT } from 'https://esm.sh/google-auth-library@9.4.1'

interface Notification {
  id: string
  user_id: string
  body: string
  title: string
  url: string
}

interface WebhookPayload {
  type: 'INSERT'
  table: string
  record: Notification
  schema: 'public'
}
const SUPABASE_URL = 'https://api.manazl.site'
const SUPABASE_SERVICE_ROLE_KEY =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.F9bDVuOspKc2QfaJeXlBHRbuxWIlTwDwcAjqegaVbQM'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL:
    'https://mandubk-370d7-default-rtdb.asia-southeast1.firebasedatabase.app',
})
Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json()

  const { data, error } = await supabase.auth.admin.getUserById(
    payload.record.user_id
  )
  if (error) throw Error('user data not found')
  const token = data!.user?.user_metadata?.fcm_token! as string
  if (!token) throw Error('user fcm token not found')
  let title = payload.record.title || 'Manazl App'
  let body = payload.record.body || 'You Have New Notification'
  const message = {
    notification: {
      title,
      body,
    },
    token: token,
  }

  const accessToken = await getAccessToken({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  })
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message: {
          token: token,
          notification: {
            title: `Notification from Supabase`,
            body: payload.record.body,
          },
        },
      }),
    }
  )
  // const res = await admin
  //   .messaging()
  //   .send(message)
  //   .then((response) => {
  //     console.log('Successfully sent notification: ', response)
  //     return { message: 'success' }
  //   })
  //   .catch((error) => {
  //     console.log('Error sending message: ', error)
  //     return { message: 'notification send error' }
  //   })
  return new Response(JSON.stringify(res), {
    headers: { 'Content-Type': 'application/json' },
  })
})
const getAccessToken = ({
  clientEmail,
  privateKey,
}: {
  clientEmail: string
  privateKey: string
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    })
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens!.access_token!)
    })
  })
}
