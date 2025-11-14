# Biet Network

Red descentralizada de unidades vivas que generan valor social, económico y ecológico.

## 🌟 Visión

Biet Network es una plataforma Web3 construida en Base (L2) que permite la creación y gestión de unidades productivas descentralizadas (Biets) con gobernanza comunitaria y distribución automática de ingresos.

## 🏗️ Arquitectura

### Stack Tecnológico

- **Blockchain**: Base (L2) - Optimism rollup con gas ultra bajo
- **Smart Contracts**: Solidity + Foundry + OpenZeppelin
- **Frontend**: Next.js + TypeScript + TailwindCSS
- **Web3**: Ethers.js + Wagmi + Viem
- **Gobernanza**: Governor Bravo + Timelock Controller
- **Identidad**: Soulbound Tokens (SBT) + DID
- **Infraestructura**: Safe + Defender + IPFS

### Componentes Principales

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Usuarios      │    │   Wallet Web3   │    │   DApp Frontend │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Base Network  │
                    │      (L2)       │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  BGT Token      │    │   DAO Governor  │    │   Treasury      │
│  (ERC20+Permit) │    │                 │    │   (Multi-sig)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Identity SBT   │    │ Productive Units│    │ Revenue Share   │
│                 │    │     (Biets)     │    │   System        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Foundry (para smart contracts)
- Git

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/biet-network/biet-network.git
cd biet-network

# Instalar dependencias
npm install

# Instalar Foundry (si no lo tienes)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Instalar dependencias de contratos
cd packages/contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit
```

### Desarrollo

```bash
# Iniciar todos los servicios en modo desarrollo
npm run dev

# O iniciar servicios individualmente:
npm run web:dev          # Frontend web app
npm run contracts:build  # Compilar contratos
npm run contracts:test   # Testear contratos
```

## 📦 Estructura del Proyecto

```
bietnetwork/
├── apps/
│   ├── web/              # Next.js web application
│   ├── dashboard/        # Admin dashboard (opcional)
│   └── docs/             # Documentación
├── packages/
│   ├── contracts/        # Smart contracts (Foundry)
│   ├── sdk/              # JavaScript/TypeScript SDK
│   └── ui/               # Componentes UI compartidos
├── .github/workflows/    # CI/CD pipelines
└── docs/                 # Documentación técnica
```

## 🔧 Smart Contracts

### Contratos Principales

#### BGT Token
- **Standard**: ERC20 + EIP-2612 (Permit)
- **Supply**: 1,000,000,000 BGT (fijo)
- **Features**: Voting, Burnable, Gasless approvals

#### BGT DAO
- **Framework**: OpenZeppelin Governor
- **Quorum**: 4% del supply total
- **Voting Period**: 7 días
- **Execution Delay**: 2 días

#### Treasury Module
- **Arquitectura**: Gnosis Safe multi-sig (3/5)
- **Assets**: ETH, USDC, BGT
- **Autotasks**: Defender para operaciones automáticas

#### Identity Module
- **SBT**: Soulbound Token para identidad verificada
- **DID**: Decentralized Identifier registry
- **Verification**: Niveles (basic, verified, premium)

#### Productive Units
- **Pattern**: Factory para Biets
- **Metadata**: IPFS para descripciones
- **Revenue Share**: Automático via PaymentSplitter

### Deployment

```bash
# Deploy a Base Sepolia (testnet)
cd packages/contracts
forge script script/Deploy.s.sol:DeployTestnetScript \
  --rpc-url base-sepolia \
  --broadcast \
  --verify

# Deploy a Base Mainnet
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url base \
  --broadcast \
  --verify
```

## 🌐 Frontend Integration

### SDK Usage

```typescript
import { createBietSDK, BASE_CHAIN } from '@biet-network/sdk';

const sdk = createBietSDK({
  rpcUrl: 'https://mainnet.base.org',
  contractAddresses: {
    bgt: '0x...',
    dao: '0x...',
    treasury: '0x...',
    identity: '0x...',
    productiveUnit: '0x...',
    revenueShare: '0x...'
  },
  signer: walletProvider.getSigner()
});

// Obtener balance BGT
const balance = await sdk.getBalance(address);

// Crear propuesta DAO
const tx = await sdk.createProposal(
  targets,
  values,
  calldatas,
  description
);
```

## 🧪 Testing

### Smart Contracts

```bash
# Ejecutar todos los tests
cd packages/contracts
forge test -vv

# Test específico
forge test --match-test testMint -vvv

# Coverage report
forge coverage
```

## 📊 Gas Optimization

### Costos en Base Network

| Operación | Costo Estimado (ETH) | Costo Estimado (USD) |
|-----------|---------------------|---------------------|
| Transfer ERC20 | ~0.0001 | ~$0.20 |
| Vote | ~0.0002 | ~$0.40 |
| Create Proposal | ~0.0005 | ~$1.00 |
| Mint SBT | ~0.0001 | ~$0.20 |
| Create Biet | ~0.0003 | ~$0.60 |

## 🔒 Security

### Medidas de Seguridad

1. **Multi-sig Treasury**: 3/5 firmas requeridas
2. **Time Lock**: 48h para ejecución de propuestas
3. **Upgradeability**: Proxy pattern para contratos críticos
4. **Auditoría**: Contratos auditados por terceros
5. **Bug Bounty**: Programa de recompensas

## 🛣️ Roadmap

### Phase 1: Core Infrastructure ✅
- [x] BGT Token implementation
- [x] DAO Governor setup
- [x] Treasury deployment
- [x] Identity module

### Phase 2: Production 🚧
- [ ] Productive Unit factory
- [ ] PaymentSplitter integration
- [ ] Price oracle setup
- [ ] Frontend MVP

## 👥 Team

**BlockchainFamily – MinTIC Bootcamp 2025**

---

**Built with ❤️ for the LATAM blockchain community**
