type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      assets: {
        Row: {
          asset_id: string;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          updated_at: string | null;
        };
        Insert: {
          asset_id: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          asset_id?: string;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          updated_at?: string | null;
        };
      };
      configs: {
        Row: {
          config: Json;
          created_at: string;
          id: string;
          metadata: Json | null;
          parent_id: string | null;
          project_id: string;
          updated_at: string | null;
        };
        Insert: {
          config: Json;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          parent_id?: string | null;
          project_id?: string;
          updated_at?: string | null;
        };
        Update: {
          config?: Json;
          created_at?: string;
          id?: string;
          metadata?: Json | null;
          parent_id?: string | null;
          project_id?: string;
          updated_at?: string | null;
        };
      };
      documents: {
        Row: {
          archived: boolean;
          config_id: string;
          created_at: string | null;
          id: string;
          project_id: string;
          root_container: string | null;
          source: string | null;
          title: string;
          unique_source_identifier: string | null;
          version: number;
        };
        Insert: {
          archived?: boolean;
          config_id: string;
          created_at?: string | null;
          id?: string;
          project_id?: string;
          root_container?: string | null;
          source?: string | null;
          title: string;
          unique_source_identifier?: string | null;
          version?: number;
        };
        Update: {
          archived?: boolean;
          config_id?: string;
          created_at?: string | null;
          id?: string;
          project_id?: string;
          root_container?: string | null;
          source?: string | null;
          title?: string;
          unique_source_identifier?: string | null;
          version?: number;
        };
      };
      organizations: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
      };
      organizations_users: {
        Row: {
          created_at: string | null;
          id: string;
          organization_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          organization_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          organization_id?: string;
          user_id?: string;
        };
      };
      projects: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          tokens: string[];
          type: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          tokens?: string[];
          type?: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          tokens?: string[];
          type?: string;
          updated_at?: string | null;
        };
      };
      template_mappings: {
        Row: {
          created_at: string;
          id: string;
          master_id: string;
          project_id: string;
          template_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          master_id: string;
          project_id?: string;
          template_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          master_id?: string;
          project_id?: string;
          template_id?: string | null;
        };
      };
      templates: {
        Row: {
          archived: boolean;
          config_id: string;
          created_at: string | null;
          id: string;
          label: string;
          project_id: string;
          width: number | null;
          widthAuto: boolean | null;
        };
        Insert: {
          archived?: boolean;
          config_id: string;
          created_at?: string | null;
          id?: string;
          label: string;
          project_id?: string;
          width?: number | null;
          widthAuto?: boolean | null;
        };
        Update: {
          archived?: boolean;
          config_id?: string;
          created_at?: string | null;
          id?: string;
          label?: string;
          project_id?: string;
          width?: number | null;
          widthAuto?: boolean | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      active_project_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      bearer_token: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      has_authenticated_user_access_to_project_from_header: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      project_id_from_access_token: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      project_id_from_header: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      extension: {
        Args: { name: string };
        Returns: string;
      };
      filename: {
        Args: { name: string };
        Returns: string;
      };
      foldername: {
        Args: { name: string };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: { size: number; bucket_id: string }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
