import type { AIAnswer, AIProvider, FinanceDataSnapshot } from '@/types/ai';

interface RemoteProviderOptions {
  name: string;
  apiKey?: string;
  /** Called only when an apiKey is provided at runtime by the user — never hardcoded. */
  request: (question: string, snapshot: FinanceDataSnapshot, apiKey: string) => Promise<AIAnswer>;
}

/**
 * Factory for future remote AI providers (OpenAI, Anthropic, Gemini).
 * No key is ever bundled with the app — it must be supplied by the caller at
 * runtime (e.g. from a secure settings screen), keeping the client free of secrets.
 */
export function createRemoteProvider({ name, apiKey, request }: RemoteProviderOptions): AIProvider {
  return {
    name,
    isAvailable: () => Boolean(apiKey),
    async ask(question, snapshot) {
      if (!apiKey) {
        throw new Error(`${name} não está configurado. Adicione uma chave de API nas configurações.`);
      }
      return request(question, snapshot, apiKey);
    },
  };
}
