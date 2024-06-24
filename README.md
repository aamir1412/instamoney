**Description**
This is a blockchain project intended to display my understanding of the blockchain network and ethereum based smart contracts. The contract is a Defi (Decentralised Finance) application wherein a lender can lend ethers at a certain interest rate and a borrower can borrow the ethers and pay interest on the loan. I have also used the openzeppelin library to create a crypto coin of our own named "Mudra". Mudra is used as the token of exchange instead of ethers in the Dapp.

**To deploy on Ganache, follow the following:**


1. Start Ganache. Quickstart
2. Install node and npm. We have tested using node verion `v16.14.2` and `v14.6.0`, npm version `8.5.2` and `6.14.7`

3. CD into instamoney root folder and Install required node packages:

- `npm install --save --legacy-peer-deps`
- `npm install truffle`
- `npm install`

4. Deploy the contract
- copy the contents of truffle-config-ganache.js to truffle-config.js
- `truffle compile`
- `truffle migrate --reset`

5. Start the web app

- `cd client`
- `npm install`
- `npm run start`

6. Open Browser. Visit localhost:3000

7. Connect MetaMask to Ganache Provider, import accounts from Ganache using the keyphrase and connect to current site.

8. Reload Page (`Ctrl + Shift + R`)

Check app functionality at [Video Recording Link](https://youtu.be/o1j71jqayF4)


 
**To deploy on Ropsten, follow the following:**

- Install node and npm. We have tested using node version v16.14.2 and v14.6.0, npm version 8.5.2 and 6.14.7
- Install required node packages:
- npm install --save --legacy-peer-deps
- npm install truffle
- copy the contents of truffle-config-metamask.js to truffle-config.js
- Add your account private key as mnemonic in the truffle-config.js
- Add infura account project ID link in the HDWalletProvider in config file
- truffle compile
- truffle migrate --network ropsten
- A contract address C and TransactionHash H will be generated. Save C and H somewhere for quick reference
- Update the config of networks key in the built contract ABI file (client/src/contracts/InstaMoney.json) as below:
  "networks": {
    "3": {
      "events": {},
      "links": {},
      "address": "0x65F37dc7Aa964CcF039942C5F083Bf06f39743Be",
      "transactionHash": "0x54799f16fbfef56e2d7a10d4634f7e13747ae1c3f3f86886570ec629e981cd5c"
    }
  },


- For values of address, use C and for value of transactionHash use H saved earlier in the previous step
- Start the web app
- cd client
- npm install
- npm run start
- Open Browser. Visit localhost:3000
- Connect MetaMask to Ropsten Network, import/create accounts on this network using the keyphrase and connect to the current site.
- Reload Page (Ctrl + Shift + R)

Phase III ERC20 Video at [Video Recording Link](https://youtu.be/NprFbSXXWxA)
