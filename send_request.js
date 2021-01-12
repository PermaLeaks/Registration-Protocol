document.getElementById("send-button").addEventListener('click', function() {send_request()} )

async function send_request(){

    // waiting list inputs
    let nickname = document.getElementById('input-1').value;
    let message = document.getElementById('input-5').value;
    let weve = document.getElementById('input-4').value;
    let desc = document.getElementById('input-2').value;
    let JWK = JSON.parse(document.getElementById('input-6').value);
    let button = document.getElementById('send-button')

    const request = {
        "nickname": nickname,
        // required later one for private/paid leaks
        "weve.email": weve,
        "description": desc,
        "message": message,
    };

    console.log(request)

    // connect to Arweave
    const arweave = Arweave.init();
    arweave.network.getInfo().then(console.log);
    
    /* 

    query the network via arql 
    to get applicants transaction
    then check for owner uniqueness
    
    1 request per wallet is allowed

    */
    let get_applicants = {
        op: 'equals',
        expr1: 'App-Name',
        expr2: 'PermaLeaks'
    };

    const aplcnts = await arweave.api.post('arql', get_applicants);
    console.log(aplcnts)
    const aplcnts_txs = aplcnts["data"]
    // console.log(aplcnts_txs)
    
    if ( aplcnts_txs.length > 0 ) {

        for (tx of aplcnts_txs) {

            let tx_object = await arweave.transactions.get(tx)
            let owner = tx_object['owner']

            if (owner == JWK["n"]) {
                alert("Wallet owner already applied")
                return 
            }
        }
    }
    
    // force nickname length to be > 3
    if (nickname.length < 3 || nickname.length > 12 ){

        alert("nickname length: min 3 | max 12")
        return
    }
    
    // check for nickname uniqueness
    // nicknames cannot be duplicated

    let get_applicant_nickname =
            {
                op: 'and',
                expr1:
                    {
                      op: 'equals',
                      expr1: 'Applicant',
                      expr2: nickname
                    },
                expr2:
                    {
                      op: 'equals',
                      expr1: 'App-Name',
                      expr2: 'PermaLeaks'
                    }
            };

    const res = await arweave.api.post(`arql`, get_applicant_nickname)


    if (res["data"].length !== 0) {

        alert("nickname already in use, please try another one")
        return
    }
        
    // transaction object ; data: JSON object
    let transaction = await arweave.createTransaction({
    data: JSON.stringify(request),
        }, JWK);

    // tags
    transaction.addTag('Content-Type', 'application/json');
    transaction.addTag('App-Name', 'PermaLeaks');
    transaction.addTag('type', ' publisher request');
    transaction.addTag('version', '0.0.1');
    transaction.addTag('Applicant', nickname);
    
    await arweave.transactions.sign(transaction, JWK);

    const response = await arweave.transactions.post(transaction);
    console.log(response)
    
    if (response.status == 200) {
        
        button.style.backgroundColor = 'Green'
        button.innerHTML = "Sent Successfully"
    } else {
        button.style.backgroundColor = 'Red'
        button.innerHTML = "Error"
    }

};

