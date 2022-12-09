import { ContentTypeSupport } from './support'

export const content: ContentTypeSupport = {
  title: 'FAQ',
  navigation: [
    { title: 'Using GSUcoin.app', id: 'using-gsucoin' },
    // { title: 'Using GSUcoin Wallet', id: 'using-gsucoin-wallet' },
    { title: 'Security', id: 'security' },
    // { title: 'Buying GSUcoin', id: 'buying-gsucoin' },
  ],
  sections: [
    {
      title: 'Using GSUcoin.app',
      id: 'using-gsucoin',
      questions: [
        {
          question: 'What assets can I use as collateral?',
          answer: `You can use many different collateral types which are voted in by GSU Governance to the GSU Protocol, including ETH and wrapped BTC. You can see each one by visiting GSUcoin.app with the corresponding Stability Fees and Minimum Collateralization Ratios.`,
        },

        {
          question: 'How much does it cost?',
          answer: `Opening and managing a Vault is free on GSUcoin.app except for gas costs and Stability Fees. The Stability Fee is charged on the amount of GSUc you have generated and goes directly to the GSU Protocol.`,
        },

        {
          question: 'How do I open a Vault?',
          answer: `To open a Vault, select the relevant Collateral and sub-type (e.g. ETH-A) from the homepage (GSUcoin.app) and connect your preferred wallet and follow the on screen instructions that will guide you through.`,
        },

        {
          question: 'What is the Stability Fee?',
          answer: `The Stability Fee is the variable annual rate (shown as a percentage) added to your debt that you will need to pay back. This can be seen as the cost to generate GSUc, which is paid directly to the GSU Protocol. To read more about the Stability Fee check the Knowledge Base.`,
        },

        {
          question: 'What is the difference between -A/-B/-C collateral Vaults?',
          answer: `There are multiple Vault types for some collaterals. Each type indicated by a letter has its own Collateralization Ratio, and Stability Fee. You can pick whatever type of Vault you want according to your needs and risk profile.`,
        },

        {
          question: 'What is a Proxy? Why do I need to generate one?',
          answer: `A Proxy is a smart contract that allows you to easily interact with supported protocols, including the GSU Protocol, to manage your Vaults, generate GSUc and so on. You will only need to do this once per wallet and all your Vaults will be managed through this single Proxy. Please never send any funds to this Proxy address though.`,
        },

        {
          question: 'Why do I need to approve tokens? What is allowance?',
          answer: `Token allowances let you control how much the proxy contract can do with the token balance in your wallet. To allow the Proxy contract to pay back GSUc, or interact with the collaterals in your wallet, you will need to authorize it by setting an allowance with each token that you want to use with GSUcoin.app. You can set the allowance to the amount you want to use each time or you can set a higher allowance for future interactions with GSUcoin.app. This will all be presented to you within the flows inside GSUcoin.app, and you won’t have to do anything extra if you don’t see any prompts.`,
        },

        {
          question: 'What is the Liquidation Ratio?',
          answer: `The Liquidation Ratio is the Minimum Collateralization Ratio which you must keep your Vault at to not put it at risk of being liquidated. If your Vault goes below this Minimum Collateralization Ratio, your Vault could be liquidated and your collateral sold off to cover your debt. To understand more about collateralization ratio and liquidations follow the links to the Knowledge Base.`,
        },

        {
          question: 'What is the Liquidation Price?',
          answer: `The Liquidation Price is the price that your Vault will be at risk of liquidation based on the ‘Current Price’ from the Oracle Security Module of the GSU Protocol. It is a helpful indicator to allow you to know when you could get liquidated. Please note however that if your Vault has a positive Stability Fee (i.e. >0) then your liquidation price will continually increase as more debt is added to your Vault. You can read more about Liquidation here.
          `,
        },

        {
          question: 'What is the Liquidation Penalty?',
          answer: `The Liquidation Penalty is the amount added to your debt once your Vault is liquidated. Each collateral and sub-type (e.g. ETH-A and ETH-B) can have their own liquidation penalties set by GSU Governance. This penalty is also paid directly to the GSU Protocol, and GSUcoin.app does not charge you any additional fees for being liquidated.
          `,
        },

        {
          question: 'What is the minimum Vault Debt?',
          answer: `The minimum Vault Debt, also called Dust, is the minimum amount of GSUc you must generate to open a new Vault, and maintain. This minimum Vault Debt value is set and can be adjusted at any time by GSU Governance. If the minimum is increased to a value above your current Debt, then you will experience reduced functionality of your Vault until you increase it to above the minimum again. Read more about minimum Vault Debt here.`,
        },

        {
          question: "What is ‘GSUc available’ in the Borrow app? Why can't I borrow more GSUc?",
          answer: `The GSU protocol sets an upper limit for borrowing against each Vault type: the Debt Ceiling. ‘GSUc available’ represents the maximum amount of GSUc all Vault owners can generate against that Vault type until the Debt Ceiling is reached. This Debt Ceiling should not be confused with the ‘GSUc available’ to generate seen in your Vault page. That amount represents the maximum amount of GSUc you can borrow based on your current Vault state. In case the Debt Ceiling is reached no more GSUc can be generated unless the debt ceiling is lifted.`,
        },

        {
          question: 'What is the next price and how do you know?',
          answer: `Within the GSU Protocol, there are always two prices for the collateral, the current price and the next price. To protect the system and users from ‘bad actors’ and flash crashes, the GSU Protocol uses an ‘Oracle Security Module’. This means that all prices that go into the system are delayed by one hour, and only updated once per hour - roughly on the hour. The next price is the price that will come into the system as the ‘Current Price’. It is the Current Price that your Vault is always measured against, so you can only be liquidated once the ‘Current Price’ goes below your ‘Liquidation Price’. This also means you have up to one hour to react if there is a big price drop and the next price is below your Liquidation Price. You can read more about the Oracle Security Module here.`,
        },

        {
          question: 'Why do I need ETH to send or save my GSUc?',
          answer: `To complete any transaction on the Ethereum blockchain, you need to pay a transaction fee using ETH, its default token. This fee is referred to as 'gas', and much like the gas that powers your car, this gas fee powers your transaction.`,
        },

        {
          question: 'What is gas?',
          answer: `Gas is the unit of measure for paying for transactions on the Ethereum Blockchain. Gas prices are charged in ETH and you will always need to have ETH in your wallet to be able to interact with GSUcoin.app. This Gas fee goes directly to Ethereum Miners who keep Ethereum running. GSUcoin.app does not charge any fees for basic Vault management.`,
        },

        {
          question: 'Why would I change the transaction speed?',
          answer: `Transaction speed allows you to pay more gas to get your transactions mined faster. In case you are in a hurry, for example to increase your Collateralization Ratio to avoid liquidation, you can set a fast speed for your transactions.`,
        },

        // {
        //   question: 'How can I contact the GSUcoin team?',
        //   answer:
        //     'If you have any questions, reach out to us through Support@GSUcoin.app or on [Twitter](https://twitter.com/GSUcoin).',
        // },
      ],
    },
    // {
    //   title: 'Using GSUcoin Multiply',
    //   id: 'using-multiply',
    //   questions: [
    //     {
    //       question: 'What is ‘Multiply’?',
    //       answer:
    //         'GSUcoin Multiply, allows users to borrow GSUc and increase their exposure to their selected collateral by creating Multiply Positions that immediately swap the borrowed GSUc for more collateral in the same transaction. This is similar to margin positions but without the need to borrow funds from a centralised counterparty. GSUcoin Multiply is built on top of the GSU Protocol and 1Inch Dex Aggregator.',
    //     },
    //     {
    //       question: 'What are the fees for Multiply?',
    //       answer:
    //         'GSUcoin.app applies a fee of 0.2% for each token swap that takes place within a Multiply transaction. Flashloans use GSU Flash Mint Module for borrowing GSUc which is free. Multiply Positions will pay an ongoing stability fee to the GSU Protocol like every GSU Vault. As usual Ethereum gas fees may apply depending on the network conditions. Standard actions in all Vaults are, as always, free',
    //     },
    //     {
    //       question: 'How are swaps done?',
    //       answer:
    //         'When a Multiply position is created GSUc will be generated against collateral and swapped through 1inch protocol for more collateral in order to gain higher exposure to the supplied collateral. Thanks to the 1inch integration users will get the best possible prices across all markets.',
    //     },
    //     {
    //       question: 'What is buying power?',
    //       answer:
    //         'The Buying Power specifies the maximum of GSUc you can buy more collateral with, based on your position. It is using Multiply and going from the current collateralization ratio to the minimum collateralization ratio.',
    //     },
    //     {
    //       question: 'What is net value?',
    //       answer:
    //         'The Net Value is calculated as the current value of the collateral in your vault minus the current debt. Note: This will not be exactly equal to the amount you will receive if you close your vault to GSUc. This is due to fees applied when swapping collateral to GSUc and because the Net Value is calculated using the mid-market price and you may suffer a larger price impact if you have a large position to close.',
    //     },
    //     {
    //       question: 'What is price impact?',
    //       answer:
    //         'Price impact is the spread between the mid price and the execution price of a trade as the size of the trade grows with respect to available liquidity. If trade size is big and liquidity shallow the difference between mid market price and execution price will be high and the user will be negatively impacted. Thanks to 1inch integration, GSUcoin.app users can trade with confidence that the best liquidity sources will be used to get the best price possible.',
    //     },
    //     {
    //       question: 'What is slippage?',
    //       answer:
    //         'Transactions sent to the network may take some time to confirm and because of this trades may execute at a different price than the one expected. Slippage refers to the difference you are willing to accept between the quoted price and the execution prices due to differences in market conditions during transaction confirmation.',
    //     },
    //     {
    //       question: 'What does the multiple number mean?',
    //       answer:
    //         'Multiply Vaults allow increased exposure to collateral price movements. As such the multiple number refers to how much more the position is expected to increase or decrease in value with respect to movements of the collateral. If multiple is 3x Vault owners will get 3 times as much price appreciation as if it was only holding their initial collateral.',
    //     },
    //     {
    //       question: 'How can I convert my Multiply view back to a Borrow view?',
    //       answer: `if you have upgraded your Borrow Vault to a Multiply Vault in the GSUcoin UI and would like to swap it back, you can go to the "Borrow" tab in your vault's page, and then click on the "Go to Borrow Interface" button. It will ask you for confirmation, and if allowed, the Vault interface will be changed back to Borrow. You can switch back and forth the interface as many times as you want, as it does not require transactions.`,
    //     },
    //   ],
    // },
    // {
    //   title: 'Using GSUcoin Wallet',
    //   id: 'using-gsucoin-wallet',
    //   questions: [
    //     {
    //       question: 'What is GSUcoin Wallet?',
    //       answer: `GSUcoin Wallet is the home for everything you want to accomplish with GSUc. A decentralized application that runs on the Ethereum blockchain, GSUcoin Wallet enables you to Buy, Send, and Manage your GSUc all in one place.
    //       `,
    //     },
    //     {
    //       question: 'What is GSUc?',
    //       answer: `GSUc is a stablecoin pegged to the exchange rate of GSU, which is the worlds most stable unit. It reflects actual underlying economic activities between countries and currencies. It does not exist in the traditional monetary systems, therefore we call it blockchain native stablecoin. It optimally reduces volatility and the risk of disorderly exchange-rate movements. To learn more about GSUc, read our introduction to the GSU exchange rate.
    //       `,
    //     },
    //     {
    //       question: 'Do I need an account?',
    //       answer: `No. You do not need to create a new account to use GSUc Wallet. You can get started with almost any Ethereum wallet, including Metamask or Coinbase Wallet, or you can use our new Magic.Link feature -- where you provide an email address, click a link in the email we send you in response, and you're logged in.`,
    //     },
    //     {
    //       question: 'Will I be charged fees?',
    //       answer:
    //         'Our GSUc Wallet is currently free to use. However, you will have to pay transaction fees and, depending on the features you use, fees associated with GSU and other protocols, such as Stability or exchange fees.',
    //     },
    //     {
    //       question: 'Why do I need ETH to send or save my GSUc?',
    //       answer: `To complete any transaction on the Ethereum blockchain, you need to pay a transaction fee using ETH, its default token. This fee is referred to as 'gas', and much like the gas that powers your car, this gas fee powers your transaction.`,
    //     },
    //     {
    //       question: 'How can I contact the GSUcoin team',
    //       answer:
    //         'If you have any questions, reach out to us through our Contact page or on Twitter.',
    //     },
    //   ],
    // },
    {
      title: 'Security',
      id: 'security',
      questions: [
        {
          question: 'Is GSUcoin Secure?',
          answer:
            'Security is our top priority. We stringently follow the best security practices, and the system consists of regularly audited smart contracts and code. In addition, GSUcoin code is open-source, giving everyone in the community the ability to pressure test and audit the core technology. You can check our documentation page where you will find links to our codebase, smart contracts addresses and code and the audit reports.',
        },
        {
          question: 'Can GSUcoin access the funds in my account or wallet?',
          answer:
            'No. With GSUc, you - and only you - have access and control over your GSUc. GSUc uses blockchain technology to ensure the highest level of trust and transparency, and because of the way blockchain technology works, you ultimately get to decide just how secure you want it to be. This does mean you are your own security ultimately, so it is very important you keep access to your GSUc and GSUcoin account secure.',
        },
        {
          question: 'I’ve found a bug? Where can I report issues?',
          answer:
            'In case you think you have found a bug critical or not, you can reach us by emailing Support@GSUcoin.app and we will review your report with the highest priority.',
        },
      ],
    },
    // {
    //   title: 'Buying GSUcoin',
    //   id: 'buying-gsucoin',
    //   questions: [
    //     {
    //       question: 'Can I buy GSUc while using GSUc Wallet?',
    //       answer: `Yes! Through connections with our partners, you can buy GSUc in over 100 countries around the world, including Europe, the US, parts of Latin America. We have partnered with three registered third-party providers - Latamex, Wyre and Moonpay - to facilitate user purchases of GSUc using a range of debit or credit cards or bank transfers. Just connect to the app and hit the 'Buy GSUc' button to see applicable providers for you.`,
    //     },
    //     {
    //       question: 'Is there a limit on how much GSUc I can buy?',
    //       answer:
    //         'Yes, and it can vary depending on which third-party provider you use and what country you are in. Full details can be found on using the links; Latamex Limits, Moonpay and Wyre.',
    //     },
    //     {
    //       question: 'What is the minimum amount I can buy?',
    //       answer: `Like the maximum limits, there are also minimum amounts which are dependant on the third-party provider and location. Latamex: Argentina: 2000 ARS, Brazil: 80.00 BRL, Mexico: 270.00 MXN Moonpay: Minimum order is 20 GSUc Wyre: Minimum order is 20 GSUc`,
    //     },
    //     {
    //       question: 'Who are the fees going to?',
    //       answer: `GSUcoin.app doesn't take any of the fees when you buy GSUc or ETH through one of our partner providers. The fee you pay goes solely and directly to the third-party provider.`,
    //     },
    //     {
    //       question: 'Can I buy ETH on GSUc Wallet to pay for my transaction fees?',
    //       answer:
    //         'Yes. Just like buying GSUc, you can start the same process as you would to buy GSUc, choose your third-party provider, and each offers an option to change GSUc for ETH when you start the process.',
    //     },
    //   ],
    // },
  ],
  cantFind: 'Can’t find what you’re looking for?',
  contactLink: 'Contact us here',
}
