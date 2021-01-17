# Registration-Protocol
simple protocol to book your "nickname" proprety

<h1>PermaLeaks Registration Protocol:</h1>

Anybody with AR wallet can apply. Application is sent on-chain as JSON object 

***Used Tag:***

1-'Content-Type', 'application/json'
2-'App-Name', 'PermaLeaks' 
3-'type', 'publisher request'
4-'version', '0.0.1'
5-'Applicant', `${nickname}`

***Limitations:***
- Protocol nicknames are unique. Length: 3 -> 12
- One registration request per wallet is allowed
- Nicknames aren't duplicatable: "first come, first served"

Successful registration looks like this one: https://viewblock.io/arweave/tx/pgnGlfySWxdZIRHUowyk5pSWmnolziVYDQTD-reI83c
