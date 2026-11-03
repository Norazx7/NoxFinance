import { LlmMessage, LlmProvider } from './llm.provider';

export class OllamaProvider implements LlmProvider {
  readonly name = 'ollama';

  constructor(
    private readonly baseUrl: string,
    private readonly model: string,
  ) {}

  async complete(messages: LlmMessage[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data = (await response.json()) as {
      message?: { content?: string };
    };
    return data.message?.content?.trim() || 'Sem resposta do modelo local.';
  }
}
