import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and Password are required");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });;

        const json = await res.json();

        if (res.ok && json.data) {
          const user = json.data;

          // Return the user object which will be stored in the JWT
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: user.token,
          };
        }

        return null;
      },
    }),
  ],

  callbacks: {
    // Handle JWT
    async jwt({ token, user }) {
      if (user) {
        // Store the user data and token in the JWT
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.token = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name as string,
        email: token.email as string,
        isAdmin: token.isAdmin as string,
        token: token.token as string, 
      };
      return session; 
    },
  },
});
