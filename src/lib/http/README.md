# Server HTTP Client

Singleton optimizado para llamadas HTTP en **Server Actions** y **Server Components** con autenticación automática NextAuth.

## ⚠️ IMPORTANTE: Solo para uso Server-Side

Este cliente **SOLO funciona** en:
- ✅ Server Components
- ✅ Server Actions (`'use server'`)
- ✅ Route Handlers (`app/api/*`)

**❌ NO usar en Client Components** - La llamada a `auth()` fallará.

## Arquitectura

```
Client Component (TanStack Query)
         ↓
   Server Action
         ↓
   serverHttpClient
         ↓
    Backend API
```

## Características

- ✅ Patrón Singleton optimizado para server-side
- ✅ Autenticación automática con NextAuth
- ✅ Soporte para JSON y FormData
- ✅ Type-safe con TypeScript
- ✅ Manejo de errores estructurado
- ✅ Soporte para cache tags de Next.js (`revalidateTag`)
- ✅ Métodos helper (GET, POST, PUT, PATCH, DELETE)

---

## Uso en Server Actions

### 1. Importar

```typescript
'use server'

import { serverHttpClient } from '@/lib/http';
import { revalidateTag } from 'next/cache';
```

### 2. GET Request

```typescript
'use server'

export async function getUsers() {
  const result = await serverHttpClient.get<User[]>('/User', {
    next: {
      tags: ['users'],
      revalidate: 60, // Revalidar cada 60 segundos
    },
  });

  if (result.status === 'error') {
    return { status: 'error', error: result.error };
  }

  return { status: 'success', data: result.data };
}
```

### 3. POST Request

```typescript
'use server'

export async function createUser(input: CreateUserInput) {
  const result = await serverHttpClient.post<User, CreateUserInput>(
    '/User',
    input
  );

  if (result.status === 'error') {
    return { status: 'error', error: result.error };
  }

  // Invalidar cache después de crear
  revalidateTag('users');

  return { status: 'success', data: result.data };
}
```

### 4. PUT Request

```typescript
'use server'

export async function updateUser(id: number, input: UpdateUserInput) {
  const result = await serverHttpClient.put<User, UpdateUserInput>(
    `/User/${id}`,
    input
  );

  if (result.status === 'error') {
    return { status: 'error', error: result.error };
  }

  revalidateTag('users');
  revalidateTag(`user-${id}`);

  return { status: 'success', data: result.data };
}
```

### 5. DELETE Request

```typescript
'use server'

export async function deleteUser(id: number) {
  const result = await serverHttpClient.delete<void>(`/User/${id}`);

  if (result.status === 'error') {
    return { status: 'error', error: result.error };
  }

  revalidateTag('users');

  return { status: 'success' };
}
```

### 6. FormData (Upload)

```typescript
'use server'

export async function uploadAvatar(userId: number, formData: FormData) {
  // FormData es detectado automáticamente
  const result = await serverHttpClient.post<{ url: string }>(
    `/User/${userId}/avatar`,
    formData
  );

  if (result.status === 'error') {
    return { status: 'error', error: result.error };
  }

  revalidateTag(`user-${userId}`);

  return { status: 'success', data: result.data };
}
```

---

## Uso con TanStack Query (Client Components)

### Setup: Install TanStack Query

```bash
pnpm add @tanstack/react-query
```

### 1. Provider (Root Layout)

```tsx
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### 2. Query: Fetch Data

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/actions/users' // Server Action

export function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers, // ← Llama Server Action
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 3. Mutation: Create/Update/Delete

```tsx
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from '@/actions/users'

export function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidar cache después de crear
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

---

## Cache y Revalidación

### Con cache tags

```typescript
'use server'

export async function getPosts() {
  const result = await serverHttpClient.get<Post[]>('/Posts', {
    next: {
      tags: ['posts'], // ← Tag para invalidación
    },
  });

  return result;
}

export async function createPost(input: PostInput) {
  const result = await serverHttpClient.post<Post>('/Posts', input);

  if (result.status === 'success') {
    revalidateTag('posts'); // ← Invalida cache
  }

  return result;
}
```

### Sin cache (siempre fresh)

```typescript
const result = await serverHttpClient.get<User[]>('/Users', {
  cache: 'no-store', // ← No cachear
});
```

---

## Headers Personalizados

```typescript
const result = await serverHttpClient.get<Data>(
  '/endpoint',
  undefined,
  {
    'X-Custom-Header': 'value',
  }
);
```

---

## Manejo de Errores

### Estructura de FetchResult

```typescript
type FetchResultSuccess<TData> = {
  status: 'success';
  code: number;
  message: string;
  data: TData;
};

type FetchResultError = {
  status: 'error';
  code?: number;
  message?: string;
  error: string;
};

type FetchResult<TData> = FetchResultSuccess<TData> | FetchResultError;
```

### Ejemplo de manejo

```typescript
'use server'

export async function createUser(input: UserInput) {
  const result = await serverHttpClient.post<User>('/User', input);

  if (result.status === 'error') {
    // Errores de validación (400)
    if (result.code === 400) {
      return { status: 'error', error: result.error };
    }

    // Errores de autorización (401)
    if (result.code === 401) {
      return { status: 'error', error: 'No autorizado' };
    }

    // Errores de red (sin code)
    if (!result.code) {
      return { status: 'error', error: 'Error de conexión' };
    }
  }

  return { status: 'success', data: result.data };
}
```

---

## Ejemplos Completos

Consulta los archivos de ejemplo:

- **Server Actions**: [`examples/server-actions.ts`](./examples/server-actions.ts)
  - CRUD completo
  - Upload de archivos
  - Operaciones multi-step
  - Error handling

- **TanStack Query**: [`examples/tanstack-query.tsx`](./examples/tanstack-query.tsx)
  - Queries y Mutations
  - Optimistic updates
  - Infinite queries
  - Parallel queries

---

## ❌ Uso Incorrecto (NO HACER)

```tsx
// ❌ MALO: Client Component llamando directamente
'use client'

import { serverHttpClient } from '@/lib/http'

export function BadComponent() {
  const data = await serverHttpClient.get('/User'); // ❌ FALLA
  return <div>{data}</div>
}
```

## ✅ Uso Correcto

```tsx
// ✅ BUENO: Client Component → Server Action → serverHttpClient
'use client'

import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/actions/users'

export function GoodComponent() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers, // ← Server Action
  });

  return <div>{/* usar data */}</div>
}
```

---

## Tipos

### HttpMethod

```typescript
const HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;
```

### NextFetchOptions

```typescript
type NextFetchOptions = {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};
```

### HttpRequest

```typescript
type HttpRequest<TBody = unknown> = {
  method: keyof typeof HttpMethod;
  endpoint: string;
  body?: TBody;
  headers?: Record<string, string>;
  options?: NextFetchOptions;
};
```

---

## Notas

- ✅ El token de autenticación se obtiene automáticamente de NextAuth
- ✅ Si no hay sesión, las peticiones fallan con error
- ✅ Los errores de validación del servidor se aplanan automáticamente
- ✅ FormData se detecta automáticamente (no agrega `Content-Type: application/json`)
- ✅ Optimizado para Server Actions y TanStack Query
- ⚠️ **Nunca** usar directamente en Client Components

---

## Migración desde versión anterior

Si tenías `httpClient`:

```typescript
// Antes
import { httpClient } from '@/lib/http';

// Ahora
import { serverHttpClient } from '@/lib/http';
```

El comportamiento es idéntico, solo cambió el nombre para clarificar que es server-only.
