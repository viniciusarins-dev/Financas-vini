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

## Rodando o projeto (sem pagar nada à Apple)

Você **não precisa** de conta paga de desenvolvedor Apple (US$ 99/ano) nem publicar
na App Store para usar o app no seu iPhone. O projeto só usa módulos compatíveis
com o **Expo Go**, então dá para rodar de graça direto no seu aparelho.

### Opção A — tendo um computador (Windows, Mac ou Linux)

1. Instale o app **Expo Go** (grátis) na App Store do seu iPhone.
2. No computador, dentro da pasta do projeto:
   ```bash
   npm install
   npm run start
   ```
3. Aparece um QR code no terminal. Abra a câmera do iPhone (ou o próprio Expo
   Go) e aponte para ele — o app abre rodando de verdade no seu celular, com
   atualização automática a cada alteração no código.
4. Celular e computador precisam estar na mesma rede Wi-Fi. Se não estiverem
   (ex: rede corporativa que bloqueia), rode `npx expo start --tunnel` em vez
   de `npm run start` — cria um túnel público, mais lento porém funciona em
   qualquer rede.

### Opção B — só com o celular, sem computador

Dá para fazer tudo isso pelo navegador do celular usando o **GitHub
Codespaces** (tem plano gratuito):

1. No site do GitHub (`github.com/viniciusarins-dev/financas-vini`) pelo
   navegador do celular, abra o repositório.
2. Toque em **Code → Codespaces → Create codespace on main**. Isso abre um
   VS Code completo rodando na nuvem, no navegador.
3. No terminal do Codespace, rode:
   ```bash
   npm install
   npx expo start --tunnel
   ```
4. Vai aparecer um QR code e um link. Abra o **Expo Go** no iPhone e escaneie
   o QR code (ou cole o link `exp://...` na busca do Expo Go).
5. Pronto — o app carrega no seu iPhone rodando a partir do código na nuvem,
   sem precisar de computador nem de conta Apple paga.

> Se preferir, também dá para pedir para alguém com computador rodar o passo
> A e te mandar o link/QR code por mensagem — o Expo Go abre normalmente a
> partir de um link `exp://` recebido de qualquer forma.

Na primeira execução o app popula o AsyncStorage com dados demonstrativos
(despesas, entradas, metas e orçamentos) para que todas as telas e gráficos já
apareçam preenchidos.

### Quando a conta paga da Apple entra em cena

Só é necessária se, no futuro, você quiser: publicar de verdade na App Store,
distribuir para outras pessoas via TestFlight, ou gerar um build instalado
permanentemente no iPhone (sem precisar do Expo Go). Para uso pessoal e testes,
o Expo Go cobre 100% do necessário, de graça.

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
