import { OpenF1 } from "../dist/index.js"; // Use the built output

async function main() {
  const client = new OpenF1();

  console.log("Available endpoints:", client.fetchers);

  const sessions = await client.fetchers.sessionResult.fetch({
    session_key: 9928,
  });

  console.log("Session results:", sessions);
}

main().catch(console.error);
