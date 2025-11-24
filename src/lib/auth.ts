import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { env } from "@/env";

declare module "next-auth" {
  interface Session {
    user: {
      accessTokenBank: string;
      fechaExpiracion: string;
      roles: string;
      permisoIds: number[];
    };
  }

  interface User {
    accessTokenBank: string | null;
    fechaExpiracion: string;
    roles: string;
    permisoIds: number[];
  }
}

export type DataResponse<T> = {
  status: number;
  result: T;
  errorMessage?: unknown;
};

type AdminLoginResponse = {
  token: string;
  fechaExpiracion: string;
  roles: string;
  permisoIds: number[];
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  theme: {
    logo: "/images/logo.svg",
  },
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      // biome-ignore lint/suspicious/noExplicitAny: <>
      async authorize(credentials, _req): Promise<any> {
        if (!(credentials?.username && credentials?.password)) {
          throw new Error("Dados de Login necessarios");
        }

        try {
          const res = await fetch(`${env.API_URL}/User/Login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            throw new Error("Error al obtener los datos");
          }

          const data = (await res.json()) as DataResponse<AdminLoginResponse>;

          const user = {
            accessTokenBank: data.result.token,
            roles: data.result.roles,
            permisoIds: data.result.permisoIds,
            fechaExpiracion: data.result.fechaExpiracion,
          };

          return user;
        } catch (_error) {
          throw new Error("Error al autenticar usuario");
        }
      },
    }),
  ],
  secret: env.AUTH_SECRET,
  pages: {
    signOut: "/ ",
    error: "/",
  },
  session: {
    strategy: "jwt",
    // max age of the session is 4 hours
    maxAge: 4 * 60 * 60,
  },
  callbacks: {
    signIn(params) {
      // console.log('SIGN IN', params)
      const { user } = params;
      if (!user.accessTokenBank) {
        return false;
      }
      // console.log(user)
      return true;
    },
    jwt({ token, user }) {
      // console.log('JWT', token)
      if (user) {
        token.token = user.accessTokenBank;
        token.roles = user.roles;
        token.permisoIds = user.permisoIds;
        token.fechaExpiracion = user.fechaExpiracion;
      }
      return { ...token, ...user };
    },
    session({ session, token }) {
      if (session?.user) {
        session.user.accessTokenBank = token.accessTokenBank as string;
        session.user.roles = token.roles as string;
        session.user.permisoIds = token.permisoIds as number[];
        session.expires = token.fechaExpiracion as string & Date;
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
  debug: env.NODE_ENV === "development",
});
