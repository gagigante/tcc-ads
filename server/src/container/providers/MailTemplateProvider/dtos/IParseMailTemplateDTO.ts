export interface IParseMailTemplateDTO {
  file: string;
  variables: Record<string, string | number>;
}
