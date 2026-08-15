import type { AIAnswer, AIProvider, FinanceDataSnapshot } from '@/types/ai';
import { localRuleProvider } from './localRuleProvider';

/**
 * Local, on-device provider is always the default: it needs no API key and
 * never leaves the phone. Remote providers (services/ai/providers/*) can be
 * wired in later behind a settings screen without changing call sites.
 */
export function getActiveAIProvider(): AIProvider {
  return localRuleProvider;
}

export async function askFinanceAssistant(question: string, snapshot: FinanceDataSnapshot): Promise<AIAnswer> {
  const provider = getActiveAIProvider();
  return provider.ask(question, snapshot);
}

export { parseTransactionText } from '@/services/nlp/parseTransactionText';
