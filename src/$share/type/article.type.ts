export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLIC = 'public',
  ARCHIVED = 'archived',
}

export interface ArticleSchema {
  id?: string;
  title?: string;
  content?: string;
  status?: ArticleStatus;
}
