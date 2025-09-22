import {
  createDirectus,
  rest,
  authentication,
  readItems,
  realtime,
  registerUser,
} from "@directus/sdk";

const log = console.log;

const client = createDirectus("https://dir.manazl.site")
  .with(rest())
  .with(authentication())
  .with(realtime());
// await client
//     .("sample@gmail.com", "password")
//   .then(console.log)
//   .catch(console.log);
// await client.login("sample@gmail.com", "password").then(console.log).catch(console.log);
await client
  .request(
    readItems("products", {
      fields: ["*.*"],
    })
  )
  .then(console.log)
  .catch(console.log);
// await client.request(
//   registerUser("m@m.gmail.com", "ssss", { first_name: "name said" })
// );
await client
  .login("m@m.gmail.com", "ssss")
  .then(console.log)
  .catch(console.log);

client.onWebSocket("message", console.log);
client.connect();
