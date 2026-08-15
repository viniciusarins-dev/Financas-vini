# Fluxo — Controle Financeiro Pessoal

App mobile (iOS-first) de controle financeiro pessoal com registro de transações por
linguagem natural e um assistente de IA financeiro. Interface dark-first, com
glassmorphism, gradientes e microinterações.

## Stack

- **Expo** (SDK 57) + **Expo Router** (navegação por arquivos)
- **TypeScript** (strict)
- **NativeWind** (Tailwind para React Native) + tokens de tema em JS para cores
- **Zustand** para estado global
- **AsyncStorage** para persistência local (camada de banco isolada em `database/`)
- **React Native Reanimated** + **Gesture Handler** para animações
- **react-native-gifted-charts** para gráficos
- **lucide-react-native** para ícones

## Estrutura

```
app/                  # rotas (Expo Router)
  (tabs)/              # Home, Transações, Resumo, Metas, IA
  transaction/[id].tsx  # editar/excluir transação (modal)
  goal/                 # nova meta / detalhe da meta (modal)
  register.tsx           # registro rápido por texto (modal)
  budgets.tsx             # orçamentos por categoria (modal)
  settings.tsx             # tema, notificações

components/            # design system reutilizável (GlassCard, GradientButton, ...)
features/              # componentes específicos de cada tela, por domínio
hooks/                 # useThemeColors, useAnimatedCounter, useAppInit, ...
services/
  financeCalculations.ts   # toda a lógica financeira (somas, projeções, insights)
  nlp/                      # parser de linguagem natural PT-BR
  ai/                       # camada de IA (provider local + stubs para OpenAI/Anthropic/Gemini)
  notifications/            # notificações locais (expo-notifications)
store/                 # Zustand stores (transactions, categories, goals, budgets, settings)
database/              # repositório AsyncStorage + seed de dados demonstrativos
types/                 # tipos de domínio (finance, ai)
constants/             # paleta de cores, categorias padrão
utils/                 # formatação de moeda, datas, ids
```

## Rodando o projeto

```bash
npm install
npm run start   # abre o Metro; use o app Expo Go ou um simulador iOS
```

Na primeira execução o app popula o AsyncStorage com dados demonstrativos
(despesas, entradas, metas e orçamentos) para que todas as telas e gráficos já
apareçam preenchidos.

## Registro por linguagem natural

Digite frases como "Gastei 45 no almoço" ou "Recebi 2300 de salário" na tela de
registro — `services/nlp/parseTransactionText.ts` interpreta valor, tipo,
categoria, forma de pagamento e data, e mostra uma confirmação antes de salvar.

## IA financeira

A aba **IA** responde perguntas sobre os dados financeiros do usuário usando um
provedor local (`services/ai/localRuleProvider.ts`), sem depender de nenhuma API
externa nem armazenar chaves no app. A interface `AIProvider`
(`services/ai/providers/`) já está pronta para conectar OpenAI, Anthropic ou
Gemini no futuro — bastando fornecer uma chave em tempo de execução.

## Próximos passos sugeridos

- Autenticação (Supabase ou similar) e bloqueio por Face ID.
- Sincronização remota (migrar de AsyncStorage para Supabase/PostgreSQL).
- Categorias personalizadas totalmente editáveis na UI.
- Testar em dispositivo físico e ajustar Dynamic Island / safe areas específicas.
