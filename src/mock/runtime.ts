import {
  delay,
  http,
  HttpResponse,
  type HttpHandler,
  type JsonBodyType,
  type PathParams,
} from 'msw';

const DEFAULT_STATUS = 200;
const DEFAULT_MOCK_TIME = 500;

const supportedMethods = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
} as const;

type MockMethod = keyof typeof supportedMethods;
type MockResponseBody = JsonBodyType | Blob;

export interface MockConfig<TResponse extends MockResponseBody = MockResponseBody> {
  res: TResponse;
  status?: number;
  mockTime?: number;
  headers?: Record<string, string>;
}

export interface MockRequest {
  raw: Request;
  params: PathParams;
  query: URLSearchParams;
  store: Map<string, unknown>;
  json: <TBody = unknown>() => Promise<TBody>;
}

export type MockResolver = (req: MockRequest) => MockConfig | Promise<MockConfig>;
export type MockDefinition = MockConfig | MockResolver;
export type MockModule = Record<string, MockDefinition>;

interface ParsedMockKey {
  method: MockMethod;
  pathname: string;
}

const mockStore = new Map<string, unknown>();

const isMockResolver = (definition: MockDefinition): definition is MockResolver =>
  typeof definition === 'function';

const parseMockKey = (key: string): ParsedMockKey => {
  const separatorIndex = key.lastIndexOf('.');
  const pathname = key.slice(0, separatorIndex);
  const method = key.slice(separatorIndex + 1);

  if (
    separatorIndex <= 0 ||
    !pathname.startsWith('/') ||
    (pathname !== '/' && pathname.endsWith('/')) ||
    !Object.hasOwn(supportedMethods, method)
  ) {
    throw new Error(
      `Mock Key "${key}" 不合法，应使用 /pathname.method，method 仅支持 get、post、put、delete`,
    );
  }

  return {
    pathname,
    method: method as MockMethod,
  };
};

const createResponse = async (config: MockConfig): Promise<Response> => {
  await delay(config.mockTime ?? DEFAULT_MOCK_TIME);

  const init = {
    status: config.status ?? DEFAULT_STATUS,
    headers: config.headers,
  };

  if (config.res instanceof Blob) {
    return new HttpResponse(config.res, init);
  }

  return HttpResponse.json(config.res, init);
};

const createHandler = (key: string, definition: MockDefinition): HttpHandler => {
  const { method, pathname } = parseMockKey(key);
  const register = supportedMethods[method];

  return register(`*${pathname}`, async ({ request, params }) => {
    const req: MockRequest = {
      raw: request,
      params,
      query: new URL(request.url).searchParams,
      store: mockStore,
      json: async <TBody = unknown>() => request.clone().json() as Promise<TBody>,
    };
    const config = isMockResolver(definition) ? await definition(req) : definition;

    return createResponse(config);
  });
};

export const defineMock = <Module extends MockModule>(module: Module): Module => module;

export const createMockHandlers = (modules: readonly MockModule[]): HttpHandler[] => {
  const definitions = new Map<string, MockDefinition>();

  for (const module of modules) {
    for (const [key, definition] of Object.entries(module)) {
      if (definitions.has(key)) {
        throw new Error(`Mock Key "${key}" 重复定义`);
      }
      definitions.set(key, definition);
    }
  }

  return [...definitions].map(([key, definition]) => createHandler(key, definition));
};

export const resetMockStore = (): void => {
  mockStore.clear();
};
