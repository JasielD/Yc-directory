import  NextAuth  from "next-auth"
import GitHub from "next-auth/providers/github"
import { client } from "./sanity/lib/client"
import { AUTHOR_BY_GITHUB_ID } from "./sanity/lib/queries"
import { write_Client } from "./sanity/lib/write-client"

export const { handlers, auth, signIn, signOut } = (NextAuth as any)({
  providers: [GitHub],
  callbacks: {
    async signIn({ user: { name, email, image }, profile, account }) {
      // 1. Check if user exists
      const existingUser = await client
        .withConfig({ useCdn: false })
        .fetch(AUTHOR_BY_GITHUB_ID, { id: profile?.id });

      // 2. Create user if they don't exist
      if (!existingUser) {
        await write_Client.create({
          _type: "author",
          id: profile?.id,
          name: name,
          username: profile?.login,
          email: email,
          image: image,
          bio: profile?.bio || "",
        });
      }

      // 3. ALWAYS return true to allow the sign-in to complete
      return true;
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID, { id: profile?.id });

        if (user) {
          token.id = user._id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});