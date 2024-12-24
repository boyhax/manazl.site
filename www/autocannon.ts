'use strict'

const autocannon = require('autocannon')

// autocannon({
//   url: 'https://api.manazl.site/rest/v1/listings',
// headers:{'apikey':"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoiYW5vbiJ9.yQ-1J_L0WxGoeclgmzWGLGNLloWMiovTzaRucHbCcM4"},
//   connections: 10, //default
//   pipelining: 1, // default
//   duration: 10 // default
// }, console.log)

autocannon({
    url: 'https://manazl.site/api/listings',
    headers:{'apikey':"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoiYW5vbiJ9.yQ-1J_L0WxGoeclgmzWGLGNLloWMiovTzaRucHbCcM4"},
    connections: 10, //default
    pipelining: 1, // default
    duration: 10 // default
  }, console.log)
//   autocannon({
//     url: 'https://api.manazl.site/rest/v1/listings',
//     headers:{'apikey':"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoiYW5vbiJ9.yQ-1J_L0WxGoeclgmzWGLGNLloWMiovTzaRucHbCcM4"},
//     connections: 10, //default
//     pipelining: 1, // default
//     duration: 10 // default
//   }, console.log)


// async/await
// async function foo () {
//   const result = await autocannon({
//     url: 'http://localhost:3000',
//     connections: 10, //default
//     pipelining: 1, // default
//     duration: 10 // default
//   })
//   console.log(result)
// }