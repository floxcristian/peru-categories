export interface Api {
  port: number;
  lang: string;
}

export interface Database {
  mongoUriEcommerce: string;
  mongoDebug: boolean;
  mongoDebugIndent: boolean;
}
