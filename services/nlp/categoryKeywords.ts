import { containsWholeWord } from '@/utils/textMatch';

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'cat-food': [
    'almoço', 'almoco', 'jantar', 'lanche', 'restaurante', 'ifood', 'rappi', 'padaria', 'café', 'cafe',
    'mcdonald', 'burger', 'hamburguer', 'pizza', 'comida', 'refeição', 'refeicao', 'delivery', 'mercado', 'feira',
    'açougue', 'acougue', 'sorvete', 'doceria', 'bar do',
  ],
  'cat-transport': [
    'uber', '99', 'taxi', 'táxi', 'gasolina', 'combustível', 'combustivel', 'ônibus', 'onibus', 'metrô', 'metro',
    'estacionamento', 'pedágio', 'pedagio', 'carro', 'moto', 'ipva', 'oficina', 'mecânico', 'mecanico',
  ],
  'cat-home': ['aluguel', 'condomínio', 'condominio', 'luz', 'energia', 'água', 'agua', 'internet', 'gás', 'gas', 'iptu', 'faxina'],
  'cat-shopping': ['camiseta', 'roupa', 'calça', 'calca', 'tênis', 'tenis', 'sapato', 'loja', 'shopping', 'compra', 'amazon', 'shein', 'mercado livre'],
  'cat-leisure': ['cinema', 'bar', 'festa', 'balada', 'jogo', 'show', 'ingresso', 'happy hour', 'boliche', 'parque'],
  'cat-health': ['farmácia', 'farmacia', 'remédio', 'remedio', 'médico', 'medico', 'consulta', 'plano de saúde', 'plano de saude', 'academia', 'dentista', 'exame'],
  'cat-education': ['curso', 'faculdade', 'livro', 'mensalidade', 'escola', 'aula', 'material escolar'],
  'cat-subscriptions': ['netflix', 'spotify', 'assinatura', 'prime', 'disney', 'hbo', 'youtube premium', 'icloud', 'chatgpt'],
  'cat-travel': ['passagem', 'hotel', 'viagem', 'hospedagem', 'pousada', 'airbnb', 'aéreo', 'aereo'],
  'cat-salary': ['salário', 'salario', 'holerite', 'pagamento do mês', 'pagamento do mes'],
  'cat-freelance': ['freela', 'freelance', 'projeto', 'bico', 'job'],
  'cat-investments': ['dividendo', 'dividendos', 'rendimento', 'investimento', 'ação', 'acao', 'cdb', 'tesouro'],
};

export function guessCategoryId(text: string, fallback: string): string {
  const lower = text.toLowerCase();
  let best: { categoryId: string; hits: number } | null = null;
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const hits = keywords.filter((k) => containsWholeWord(lower, k)).length;
    if (hits > 0 && (!best || hits > best.hits)) {
      best = { categoryId, hits };
    }
  }
  return best?.categoryId ?? fallback;
}
