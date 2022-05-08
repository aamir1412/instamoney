1. Start Ganache. Quickstart
2. Install node and npm. We have tested using node verion `v16.14.2` and `v14.6.0`, npm version `8.5.2` and `6.14.7`

3. CD into instamoney root folder and Install required node packages:

- `npm install --save --legacy-peer-deps`
- `npm install truffle`
- `npm install`

4. Deploy the contract

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
