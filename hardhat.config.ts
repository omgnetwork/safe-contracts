import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "solidity-coverage";
import "hardhat-deploy";
import dotenv from "dotenv";
import type { HardhatConfig, HardhatUserConfig, HttpNetworkUserConfig } from "hardhat/types";
import yargs from "yargs";

const argv = yargs
  .option("network", {
    type: "string",
    default: "hardhat",
  })
  .help(false)
  .version(false).argv;

// Load environment variables.
dotenv.config();
const { NODE_URL, INFURA_KEY, MNEMONIC, ETHERSCAN_API_KEY, PK, SOLIDITY_VERSION, SOLIDITY_SETTINGS } = process.env;

const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (PK) {
  sharedNetworkConfig.accounts = [PK];
  //sharedNetworkConfig.chainId = Number(process.env.CHAIN_ID);
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
  };
  //sharedNetworkConfig.chainId = Number(process.env.CHAIN_ID);
}

if (["mainnet", "rinkeby", "kovan", "goerli"].includes(argv.network) && INFURA_KEY === undefined) {
  throw new Error(
    `Could not find Infura key in env, unable to connect to network ${argv.network}`,
  );
}

import "./src/tasks/local_verify"
import "./src/tasks/deploy_contracts"
import "./src/tasks/show_codesize"

const primarySolidityVersion = SOLIDITY_VERSION || "0.7.6"
const soliditySettings = !!SOLIDITY_SETTINGS ? JSON.parse(SOLIDITY_SETTINGS) : undefined

const userConfig: HardhatUserConfig = {
  deterministicDeployment: {
    "28": {
      factory: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7",
      deployer: "0x122816e7A7AeB40601d0aC0DCAA8402F7aa4cDfA",
      funding: "10000000000",
      signedTx: "0xf8a5808504a817c800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf35ca0b501137727a3f33f5431a78a06428d918aa7cf1680ccb5bc1e4574dc32425013a06c00ad38c5f6327b995971e8abe8446fc6425f12c53b4d7de089524b7bb4acb1",
    },
    "288": {
      factory: "0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7",
      deployer: "0x3C99545602fF72723e813DC31F696cD893E5E525",
      funding: "10000000000",
      signedTx: "0xf8a7808504a817c800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3820264a02836f16b67fdf74d02d4d9548495cffd739f509b9bc4b8fdffd2611c38489642a07864709b3f830a661897f4d60d98efc26754f44be447cf35a65ff92a06cb7bd0",
    }
  },
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    deploy: "src/deploy",
    sources: "contracts",
  },
  solidity: {
    compilers: [
      { version: primarySolidityVersion, settings: soliditySettings },
      { version: "0.6.12" },
      { version: "0.5.17" },
    ]
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 100000000,
      gas: 100000000,
      //chainId: Number(process.env.CHAIN_ID),
    },
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    xdai: {
      ...sharedNetworkConfig,
      url: "https://xdai.poanetwork.dev",
    },
    ewc: {
      ...sharedNetworkConfig,
      url: `https://rpc.energyweb.org`,
    },
    rinkeby: {
      ...sharedNetworkConfig,
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    },
    goerli: {
      ...sharedNetworkConfig,
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    },
    kovan: {
      ...sharedNetworkConfig,
      url: `https://kovan.infura.io/v3/${INFURA_KEY}`,
    },
    volta: {
      ...sharedNetworkConfig,
      url: `https://volta-rpc.energyweb.org`,
    },
    boba_rinkeby: {
      ...sharedNetworkConfig,
      url: `https://rinkeby.boba.network/`,
      chainId: Number(process.env.CHAIN_ID),
    },
    boba: {
      ...sharedNetworkConfig,
      url: `https://mainnet.boba.network/`,
      chainId: Number(process.env.CHAIN_ID),
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  mocha: {
    timeout: 2000000,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
if (NODE_URL) {
  userConfig.networks!!.custom = {
    ...sharedNetworkConfig,
    url: NODE_URL,
    chainId: Number(process.env.CHAIN_ID),
  }
}
export default userConfig