/**
 * TanStack Query Examples with Server Actions
 *
 * These examples show how to use TanStack Query (React Query) in Client Components
 * by calling Server Actions that use serverHttpClient.
 *
 * Architecture:
 * Client Component → TanStack Query → Server Action → serverHttpClient → Backend API
 */

"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./server-actions";

// ============================================
// Types (should match server-actions.ts)
// ============================================

type User = {
  id: number;
  name: string;
  email: string;
  roles: string;
};

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

type UpdateUserInput = {
  name?: string;
  email?: string;
};

// ============================================
// QUERY: Fetch all users
// ============================================

export function UserList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getUsers();
      if (result.status === "error") {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 60 * 1000, // Consider data fresh for 60 seconds
  });

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={() => refetch()} type="button">
        Refresh
      </button>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// QUERY: Fetch single user
// ============================================

export function UserDetail({ userId }: { userId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const result = await getUserById(userId);
      if (result.status === "error") {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: !!userId, // Only run if userId is provided
  });

  if (isLoading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Email: {data.email}</p>
      <p>Roles: {data.roles}</p>
    </div>
  );
}

// ============================================
// MUTATION: Create user
// ============================================

export function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const result = await createUser(input);
      if (result.status === "error") {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    mutation.mutate({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" placeholder="Email" required type="email" />
      <input name="password" placeholder="Password" required type="password" />
      <button disabled={mutation.isPending} type="submit">
        {mutation.isPending ? "Creating..." : "Create User"}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>User created successfully!</p>}
    </form>
  );
}

// ============================================
// MUTATION: Update user
// ============================================

export function UpdateUserForm({
  userId,
  initialData,
}: {
  userId: number;
  initialData: User;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const result = await updateUser(userId, input);
      if (result.status === "error") {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidate both the list and the specific user
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    mutation.mutate({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        defaultValue={initialData.name}
        name="name"
        placeholder="Name"
        required
      />
      <input
        defaultValue={initialData.email}
        name="email"
        placeholder="Email"
        required
        type="email"
      />
      <button disabled={mutation.isPending} type="submit">
        {mutation.isPending ? "Updating..." : "Update User"}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}

// ============================================
// MUTATION: Delete user
// ============================================

export function DeleteUserButton({ userId }: { userId: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const result = await deleteUser(userId);
      if (result.status === "error") {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <button
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
      type="button"
    >
      {mutation.isPending ? "Deleting..." : "Delete"}
    </button>
  );
}

// ============================================
// ADVANCED: Optimistic Updates
// ============================================

export function OptimisticUpdateExample({ userId }: { userId: number }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      const result = await updateUser(userId, input);
      if (result.status === "error") {
        throw new Error(result.error);
      }
      return result.data;
    },
    // Optimistic update: Update UI immediately before server confirms
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["users", userId] });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData<User>(["users", userId]);

      // Optimistically update to the new value
      if (previousUser) {
        queryClient.setQueryData<User>(["users", userId], {
          ...previousUser,
          ...newData,
        });
      }

      // Return context with previous value
      return { previousUser };
    },
    // If mutation fails, use context to roll back
    onError: (_err, _newData, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["users", userId], context.previousUser);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ name: "Updated Name" })}
      type="button"
    >
      Update with Optimistic UI
    </button>
  );
}

// ============================================
// ADVANCED: Infinite Query (Pagination)
// ============================================

// Note: This assumes your API supports pagination
// You'd need to create a corresponding Server Action

type PaginatedResponse = {
  users: User[];
  nextCursor?: number;
};

export function InfiniteUserList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["users", "infinite"],
    queryFn: async ({ pageParam }) => {
      // You'd need to create this Server Action
      // const result = await getUsersPaginated(pageParam);
      // if (result.status === 'error') throw new Error(result.error);
      // return result.data;

      // Placeholder for example
      return {
        users: [] as User[],
        nextCursor: undefined,
      } as PaginatedResponse;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.users.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      ))}

      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          type="button"
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      )}
    </div>
  );
}

// ============================================
// ADVANCED: Parallel Queries
// ============================================

export function ParallelQueriesExample({ userId }: { userId: number }) {
  // Fetch multiple queries in parallel
  const userQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: async () => {
      const result = await getUserById(userId);
      if (result.status === "error") throw new Error(result.error);
      return result.data;
    },
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await getUsers();
      if (result.status === "error") throw new Error(result.error);
      return result.data;
    },
  });

  if (userQuery.isLoading || usersQuery.isLoading) return <div>Loading...</div>;
  if (userQuery.error || usersQuery.error) return <div>Error occurred</div>;

  return (
    <div>
      <h2>Current User: {userQuery.data?.name}</h2>
      <h3>All Users ({usersQuery.data?.length}):</h3>
      <ul>
        {usersQuery.data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================
// SETUP: QueryClient Provider
// ============================================

/**
 * Add this to your root layout to enable TanStack Query
 *
 * Example: app/layout.tsx
 *
 * ```tsx
 * import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 * import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
 * import { useState } from 'react'
 *
 * export default function RootLayout({ children }) {
 *   const [queryClient] = useState(() => new QueryClient({
 *     defaultOptions: {
 *       queries: {
 *         staleTime: 60 * 1000, // 60 seconds
 *         refetchOnWindowFocus: false,
 *       },
 *     },
 *   }))
 *
 *   return (
 *     <html>
 *       <body>
 *         <QueryClientProvider client={queryClient}>
 *           {children}
 *           <ReactQueryDevtools initialIsOpen={false} />
 *         </QueryClientProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
