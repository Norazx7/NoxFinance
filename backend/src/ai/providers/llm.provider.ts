export type LlmMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface LlmProvider {
  readonly name: string;
  complete(messages: LlmMessage[]): Promise<string>;
}
