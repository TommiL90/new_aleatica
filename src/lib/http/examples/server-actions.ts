/**
 * Server Actions Examples using serverHttpClient
 *
 * These snippets demonstrate how to convert the raw ApiStandardResponse
 * returned by `serverHttpClient` into the `FetchResult<T>` shape that the UI
 * layer consumes everywhere else in the app.
 *
 * Feel free to copy the `handleRequest` helper into your own actions to avoid
 * repeating the same success/error boilerplate for every endpoint.
 */

"use server";

import { revalidateTag } from "next/cache";

import { getErrorMessage } from "@/lib/handle-error";
import {
  type ApiStandardResponse,
  type FetchResult,
  HttpClientError,
  serverHttpClient,
} from "@/lib/http";

// ============================================
// Helpers
// ============================================

type RequestExecutor<T> = () => Promise<ApiStandardResponse<T>>;

async function handleRequest<T>(
  execute: RequestExecutor<T>,
): Promise<FetchResult<T>> {
  try {
    const response = await execute();

    if (response.status !== 200) {
      const errorMessage = response.errorMessage ?? "La API retornó un error";
      return {
        status: "error",
        error: errorMessage,
        code: response.status,
        message: errorMessage,
      };
    }

    return {
      status: "success",
      data: response.result ?? (null as T),
      code: response.status,
      message: response.errorMessage ?? "Success",
    };
  } catch (error) {
    const message = getErrorMessage(error);
    const code = error instanceof HttpClientError ? error.statusCode : 500;
    return {
      status: "error",
      error: message,
      code,
      message,
    };
  }
}

// ============================================
// Example domain types
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
// GET: Fetch users
// ============================================

export async function getUsers(): Promise<FetchResult<User[]>> {
  return handleRequest(() =>
    serverHttpClient.get<User[]>("/User", {
      options: {
        next: { tags: ["users"], revalidate: 60 },
      },
    }),
  );
}

// ============================================
// GET: Fetch single user
// ============================================

export async function getUserById(id: number): Promise<FetchResult<User>> {
  return handleRequest(() =>
    serverHttpClient.get<User>(`/User/${id}`, {
      options: {
        next: { tags: ["users", `user-${id}`] },
      },
    }),
  );
}

// ============================================
// POST: Create user
// ============================================

export async function createUser(
  input: CreateUserInput,
): Promise<FetchResult<User>> {
  const result = await handleRequest(() =>
    serverHttpClient.post<User, CreateUserInput>("/User", { body: input }),
  );

  if (result.status === "success") {
    revalidateTag("users");
  }

  return result;
}

// ============================================
// PUT: Update user
// ============================================

export async function updateUser(
  id: number,
  input: UpdateUserInput,
): Promise<FetchResult<User>> {
  const result = await handleRequest(() =>
    serverHttpClient.put<User, UpdateUserInput>(`/User/${id}`, {
      body: input,
    }),
  );

  if (result.status === "success") {
    revalidateTag("users");
    revalidateTag(`user-${id}`);
  }

  return result;
}

// ============================================
// PATCH: Partial update
// ============================================

export async function patchUser(
  id: number,
  input: Partial<User>,
): Promise<FetchResult<User>> {
  const result = await handleRequest(() =>
    serverHttpClient.patch<User, Partial<User>>(`/User/${id}`, {
      body: input,
    }),
  );

  if (result.status === "success") {
    revalidateTag("users");
    revalidateTag(`user-${id}`);
  }

  return result;
}

// ============================================
// DELETE: Remove user
// ============================================

export async function deleteUser(id: number): Promise<FetchResult<void>> {
  const result = await handleRequest(() =>
    serverHttpClient.delete<void>(`/User/${id}`),
  );

  if (result.status === "success") {
    revalidateTag("users");
    revalidateTag(`user-${id}`);
  }

  return result;
}

// ============================================
// FormData example
// ============================================

export async function uploadUserAvatar(
  userId: number,
  formData: FormData,
): Promise<FetchResult<{ url: string }>> {
  return handleRequest(() =>
    serverHttpClient.post<{ url: string }>(`/User/${userId}/avatar`, {
      body: formData,
    }),
  );
}

// ============================================
// Error handling example
// ============================================

export async function getUserWithErrorHandling(
  id: number,
): Promise<FetchResult<User>> {
  return handleRequest(() => serverHttpClient.get<User>(`/User/${id}`));
}

// ============================================
// Multi-step example
// ============================================

export async function createUserWithProfile(input: {
  user: CreateUserInput;
  profile: { bio: string; avatar?: File };
}): Promise<FetchResult<{ user: User; profileUrl: string }>> {
  const userResult = await handleRequest(() =>
    serverHttpClient.post<User, CreateUserInput>("/User", {
      body: input.user,
    }),
  );

  if (userResult.status === "error") {
    return userResult;
  }

  const profileResult = await handleRequest(() =>
    serverHttpClient.post<{ bio: string }>(
      `/User/${userResult.data.id}/profile`,
      {
        body: { bio: input.profile.bio },
      },
    ),
  );

  if (profileResult.status === "error") {
    await serverHttpClient.delete(`/User/${userResult.data.id}`);
    return profileResult;
  }

  let avatarUrl = "";
  if (input.profile.avatar) {
    const formData = new FormData();
    formData.append("avatar", input.profile.avatar);
    const avatarResult = await handleRequest(() =>
      serverHttpClient.post<{ url: string }>(
        `/User/${userResult.data.id}/avatar`,
        { body: formData },
      ),
    );
    if (avatarResult.status === "success") {
      avatarUrl = avatarResult.data.url;
    }
  }

  revalidateTag("users");

  return {
    status: "success",
    data: {
      user: userResult.data,
      profileUrl: avatarUrl,
    },
    code: 200,
    message: "Success",
  };
}

// ============================================
// No-cache example
// ============================================

export async function getUsersNoCacheExample(): Promise<FetchResult<User[]>> {
  return handleRequest(() =>
    serverHttpClient.get<User[]>("/User", {
      options: { cache: "no-store" },
    }),
  );
}
