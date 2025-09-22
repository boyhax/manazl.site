import autocannon from "autocannon";

let url = "https://api.opensooq.com/v2.1/countries";

autocannon(
  {
    url,
    connections: 10, //default
    pipelining: 1, // default
    duration: 10, // default
    headers: {
      source: "desktop",
    },
  },
  console.log
);
