import NextAuth from "next-auth";
import { partnerAuthOptions } from "@/libs/partnerAuth";

const handler = NextAuth(partnerAuthOptions);

export { handler as GET, handler as POST };
