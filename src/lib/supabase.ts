// Stub Supabase client — all real calls are made via mock data services.
// This prevents build errors when @supabase/supabase-js is not installed.

interface QueryBuilder {
  select: (cols?: string, opts?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) => QueryBuilder;
  insert: (data: any) => QueryBuilder;
  update: (data: any) => QueryBuilder;
  upsert: (data: any) => QueryBuilder;
  delete: () => QueryBuilder;
  eq: (col: string, val: any) => QueryBuilder;
  neq: (col: string, val: any) => QueryBuilder;
  gt: (col: string, val: any) => QueryBuilder;
  gte: (col: string, val: any) => QueryBuilder;
  lt: (col: string, val: any) => QueryBuilder;
  lte: (col: string, val: any) => QueryBuilder;
  like: (col: string, val: any) => QueryBuilder;
  ilike: (col: string, val: any) => QueryBuilder;
  is: (col: string, val: any) => QueryBuilder;
  in: (col: string, vals: any[]) => QueryBuilder;
  contains: (col: string, val: any) => QueryBuilder;
  containedBy: (col: string, val: any) => QueryBuilder;
  or: (filters: string, opts?: { foreignTable?: string; referencedTable?: string }) => QueryBuilder;
  not: (col: string, op: string, val: any) => QueryBuilder;
  filter: (col: string, op: string, val: any) => QueryBuilder;
  match: (query: Record<string, any>) => QueryBuilder;
  order: (col: string, opts?: { ascending?: boolean; nullsFirst?: boolean }) => QueryBuilder;
  limit: (n: number) => QueryBuilder;
  range: (from: number, to: number) => QueryBuilder;
  single: () => QueryBuilder;
  maybeSingle: () => QueryBuilder;
  count: (opts?: 'exact' | 'planned' | 'estimated') => QueryBuilder;
  then: <T>(onfulfilled: (value: any) => T | PromiseLike<T>) => Promise<T>;
}

function buildQueryBuilder(table: string): QueryBuilder {
  let _data: any = null;
  let _error: any = null;
  let _count: number | null = null;

  const self: QueryBuilder = {
    select: () => self,
    insert: () => self,
    update: () => self,
    upsert: () => self,
    delete: () => self,
    eq: () => self,
    neq: () => self,
    gt: () => self,
    gte: () => self,
    lt: () => self,
    lte: () => self,
    like: () => self,
    ilike: () => self,
    is: () => self,
    in: () => self,
    contains: () => self,
    containedBy: () => self,
    or: () => self,
    not: () => self,
    filter: () => self,
    match: () => self,
    order: () => self,
    limit: () => self,
    range: () => self,
    single: () => self,
    maybeSingle: () => self,
    count: () => self,
    then: (onfulfilled) => Promise.resolve(onfulfilled({ data: _data, error: _error, count: _count })),
  };

  return self;
}

export const supabase = {
  from: (table: string) => buildQueryBuilder(table),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      download: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      list: () => Promise.resolve({ data: [], error: null }),
      remove: () => Promise.resolve({ data: null, error: null }),
    }),
  },
  rpc: () => Promise.resolve({ data: null, error: null }),
};
