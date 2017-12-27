let errorMsgNoMetamaskAccount = `You haven't chosen any account in MetaMask.
Please, choose your initial key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;


function generateElement(msg){
  let errorNode = document.createElement("div");
  errorNode.innerHTML = `<div>
    ${msg}
  </div>`;
  return errorNode;
}
let getWeb3 = () => {
  return new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
      var results
      var web3 = window.web3

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        var errorMsg = null;
        web3 = new window.Web3(web3.currentProvider)
        web3.version.getNetwork((err, netId) => {
          let netIdName;
          switch (netId) {
            case "77":
              netIdName = 'Sokol'
              console.log('This is sokol')
              break
            case "99":
              netIdName = 'Core'
              console.log('This is Core')
              break
            default:
              netIdName = 'ERROR'
              errorMsg = `You aren't connected to POA Network. 
                  Please, switch on POA plugin and refresh the page. 
                  Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`
              console.log('This is an unknown network.', netId)
          }
          results = {
            web3Instance: web3,
            netIdName,
            netId,
            injectedWeb3: true
          }
          document.title = `${netIdName} - Dapp Keys Generation`
          var defaultAccount = web3.eth.defaultAccount || null;
          if(defaultAccount === null){
            reject({msg: errorMsgNoMetamaskAccount, node: generateElement(errorMsgNoMetamaskAccount)})
          }
          if(errorMsg !== null){
            reject({msg: errorMsg, node: generateElement(errorMsg)})
          }
          resolve(results)
        })

        console.log('Injected web3 detected.');

      } else {
        reject({msg: errorMsgNoMetamaskAccount, node: generateElement(errorMsgNoMetamaskAccount)})
        console.error('Metamask not found'); 
      }
    })
  })
}

export default getWeb3

