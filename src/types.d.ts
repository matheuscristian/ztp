export interface File {
  name: string;
  type: string;
  text(): Promise<string>;
}
