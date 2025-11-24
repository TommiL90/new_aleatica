/**
 * Server Actions Examples using serverHttpClient
 *
 * These examples show how to use the serverHttpClient in Server Actions
 * for CRUD operations with proper error handling and cache invalidation.
 */

"use server";

import { serverHttpClient } from "@/lib/http";
import type { ApiResponse } from "@/lib/http/types";

// ============================================
// Types (example - adjust to your API)
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

export async function getUsers(): Promise<ApiResponse<User[]>> {
  const result = await serverHttpClient.get<User[]>("/User", {
    next: {
      tags: ["users"], // Tag for cache invalidation
      revalidate: 60, // Revalidate every 60 seconds
    },
  });

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }

  return {
    status: "success",
    data: result.data,
  };
}

// ============================================
// GET: Fetch single user by ID
// ============================================

export async function getUserById(id: number): Promise<ApiResponse<User>> {
  const result = await serverHttpClient.get<User>(`/User/${id}`, {
    next: {
      tags: ["users", `user-${id}`],
    },
  });

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }

  return {
    status: "success",
    data: result.data,
  };
}

// ============================================
// POST: Create new user
// ============================================

export async function createUser(
  input: CreateUserInput
): Promise<ApiResponse<User>> {
  const result = await serverHttpClient.post<User, CreateUserInput>(
    "/User",
    input
  );

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }

  // Invalidate users cache after creating
  // revalidateTag("users"); // Comentado: verificar API de Next.js 16

  return {
    status: "success",
    data: result.data,
  };
}

// ============================================
// PUT: Update user
// ============================================

export async function updateUser(
  id: number,
  input: UpdateUserInput
): Promise<ApiResponse<User>> {
  const result = await serverHttpClient.put<User, UpdateUserInput>(
    `/User/${id}`,
    input
  );

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }

  // Invalidate specific user and users list
  // revalidateTag("users"); // Comentado: verificar API de Next.js 16
  // revalidateTag(`user-${id}`); // Comentado: verificar API de Next.js 16

  return {
    status: "success",
    data: result.data,
  };
}

// ============================================
// PATCH: Partial update
// ============================================

export async function patchUser(
  id: number,
  input: Partial<User>
): Promise<ApiResponse<User>> {
  const result = await serverHttpClient.patch<User, Partial<User>>(
    `/User/${id}`,
    input
  );

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }

  // revalidateTag("users"); // Comentado: verificar API de Next.js 16
  // revalidateTag(`user-${id}`); // Comentado: verificar API de Next.js 16

  return {
    status: "success",
    data: result.data,
  };
}

// ============================================
// DELETE: Remove user
// ============================================

export async function deleteUser(id: number): Promise<ApiResponse<void>> {
  const result = await serverHttpClient.delete<void>(`/User/${id}`);

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }

  // Invalidate caches
  // revalidateTag("users"); // Comentado: verificar API de Next.js 16
  // revalidateTag(`user-${id}`); // Comentado: verificar API de Next.js 16

  return {
    status: "success",
  };
}

// ============================================
// FormData Example: File upload
// ============================================

export async function uploadUserAvatar(
  userId: number,
  formData: FormData
): Promise<ApiResponse<{ url: string }>> {
  // FormData is automatically detected by serverHttpClient
  const result = await serverHttpClient.post<{ url: string }>(
    `/User/${userId}/avatar`,
    formData
  );

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }

  // Invalidate user cache
  // revalidateTag(`user-${userId}`); // Comentado: verificar API de Next.js 16

  return {
    status: "success",
    data: result.data,
  };
}

// ============================================
// Error Handling Example with try-catch
// ============================================

export async function getUserWithErrorHandling(
  id: number
): Promise<ApiResponse<User>> {
  try {
    const result = await serverHttpClient.get<User>(`/User/${id}`);

    if (result.status === "error") {
      // Log error (you could use a proper logger here)
      console.error("Failed to fetch user:", result.error);

      return {
        status: "error",
        error: result.message || result.error,
      };
    }

    return {
      status: "success",
      data: result.data,
    };
  } catch (error) {
    // Handle unexpected errors
    return {
      status: "error",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

// ============================================
// Complex Example: Multi-step operation
// ============================================

export async function createUserWithProfile(input: {
  user: CreateUserInput;
  profile: { bio: string; avatar?: File };
}): Promise<ApiResponse<{ user: User; profileUrl: string }>> {
  // Step 1: Create user
  const userResult = await serverHttpClient.post<User, CreateUserInput>(
    "/User",
    input.user
  );

  if (userResult.status === "error") {
    return {
      status: "error",
      error: userResult.error,
    };
  }

  const userId = userResult.data.id;

  // Step 2: Create profile
  const profileResult = await serverHttpClient.post<{ bio: string }>(
    `/User/${userId}/profile`,
    { bio: input.profile.bio }
  );

  if (profileResult.status === "error") {
    // Rollback: delete user if profile creation fails
    await serverHttpClient.delete(`/User/${userId}`);
    return {
      status: "error",
      error: profileResult.error,
    };
  }

  // Step 3: Upload avatar if provided
  let avatarUrl = "";
  if (input.profile.avatar) {
    const formData = new FormData();
    formData.append("avatar", input.profile.avatar);

    const avatarResult = await serverHttpClient.post<{ url: string }>(
      `/User/${userId}/avatar`,
      formData
    );

    if (avatarResult.status === "success") {
      avatarUrl = avatarResult.data.url;
    }
  }

  // Invalidate cache
  // revalidateTag("users"); // Comentado: verificar API de Next.js 16

  return {
    status: "success",
    data: {
      user: userResult.data,
      profileUrl: avatarUrl,
    },
  };
}

// ============================================
// No-cache Example: Always fresh data
// ============================================

export async function getUsersNoCacheExample(): Promise<ApiResponse<User[]>> {
  const result = await serverHttpClient.get<User[]>("/User", {
    cache: "no-store", // Never cache
  });

  if (result.status === "error") {
    return {
      status: "error",
      error: result.error,
    };
  }

  return {
    status: "success",
    data: result.data,
  };
}
