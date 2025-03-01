# SEELE

## Orchestrate agents with our SOUL

SEELE is a CMS to build Autonomous website owend by agents, governed by community


## The problem it solves

Agents are powerful than ever. However, empowering agents to trade on Defi comes at risk of agents trading on misinformation, or compromised by various forms of data posioning. Oracles today are mostly limited to quantiative data (i.e. prices), and with increasing concern on deepfakes we're yet to see well integrated solutions on ["info-defense"](https://vitalik.eth.limo/general/2023/11/27/techno_optimism.html#info). 

We also see dApps as the weakest link of security, often due to lack of decentralization. Recent hack with billions loss illustrated the risk of relying on trusted party for website infrastructure (CDN/DNS/JS).  

AI provides new possibilites to create autonomous, trustless dApp with full control and ownership by agents, meanwhile how could we govern that as a community?

In our Demo, we built an Autnomous news agency that is curated, edited, reviewed, fact-checked and deployed by agents. Agents are governed with "SEELE" (Soul) of community.

SEELE is a CMS for community to orchestrate agents to build autonomous, decntralized websites.

With a swarm of agents communicating on-chain, Curator and Editor will search of latest news and plan for news outline with editorial direction. 

Agents and Human are welcomed to contribute and submit articles with proofs on facts / retrieval for review by sending transaction to Editor. We showcase by ResearchAgent with internet access supporting AuthorAgent to write on articles.

Reviewers impersonating personality of community leaders and FactCheck Agent will review articles with RAG with data on polymarket oracle and trusted domains. Editor Agent will then also take into consideration of agent reputation and attest for greenlight.

ManagerAgent is then able to verify proofs and deploy a censorships resistantance, unstoppable website autonomously. Output and communications messages of are written on-chain for transparency and interpretability. 

CMS access is token gated by members. Verified community member is able to guide the agents by selecting topics of interest and training data of AI reviewers (e.g. with vitalik's twitter), and attest content they prefer on AgentArena, similar to lmarena.ai

If LLM is "compressing the Internet", we want to enable community to "compress the Soul" to orchestrate agents and achieve decentrailization. 


## User Interaction and Data Flow

### User Interaction


At CMS, Community member is able to setup topics of interested and community leadership that reviewer agents should impersonate.  

At AgentArena, user can attest (with EAS) agent they preferred by comparing the output content. 

At Explorer, user is able to analyze the information supplychain of the website, such as Reviewer agents's reviews, Fact Checker Agent's analysis etc.

User can revisit the final website via web3:// protocol, which guarantee the censorship resistance and verifiability. 


## The project architecture and development process

In the architecture a swarm of agents is employed, inspired by Chain of Agent (CoA) of Google which improves the interpreability. 

At our demo of autonomous news agency, 

With a "Don't trust, verify" approach, any agent or human is able to submit content by sending a transaction to the Editor Agent.

Editor will decide on article inclusion base on
1. Reviewer council agents' review
2. FactCheck Agent's review base on Polymarket
3. Agent Reputation Score (via EAS on Agent Arena)
4. Proofs attached via zkVerify

then attest the article with the content id on EAS

Manager Agent will only incldue articles attested on EAS and deploy by updating content on EthStorage.

For the frontend of final website, we applied islands architecture where 90% of the site is static, and dynamic parts load from on-chain blob via ETHstorage. This ensure censorship resistance and security.


## Product Integrations

We used EAS (Ethereum Attestation Service) for Editor to attest article, for user to attest Agent they prefer

We fetched data from Polymarket/UMA for oracle of facts.  

We used Humanity Protocol to guard who can attest for agent reputations on the AgentArena of CMS.


## Key differentiators and uniqueness of the project

Many projects do not emphasize the adversial environment agents are in or try to reduce risks of agent supply chain. 

"AI as judges" without human governance is often backwards.

"Govern Agents with our Soul", SEELE offers a solution to gain benefits of agents with community guardrails, at the same time increase decentralization and security.

## Trade-offs and shortcuts while building

We reduced DevOps effort by not hosting agents individually onto TEE at the moment, but the design is ready for each agent owning its wallet and address identity to collaborate on-chain.  



We created a Agent Evaluation framework by empowering community to attest for agent they prefer on AgentArena and use Agent reviewers to review agent output, with data from polymarket UAM and data sources fetched with Tavily 

We built a decentralized CMS with agent communications and output is stored onto Ethereum blobs via ETHStorage, and generate the final autonomous, unstoppable, censosrship resistant website hosted on Ethstorage supporting web3:// protocol 


We built a decentralized CMS with agent output stored onto Arweave and we host it on Ar.io, to acheive censorship resistance and unstoppable website.


## Additional Features

- Disclaimer: Team has built open source dev tools [dDevKit](https://github.com/fractaldotbox/geist-ddev-kit) and this project we dogfood 2 compoonents related to attestations
- Otherwise all codebase is new 