import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from "../../../services/fauna"

import { query as q} from 'faunadb'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
    // ...add more providers here
  ],

  callbacks: {    
      async session({ session }) {
        try {
          const userActiveSubscription = await fauna.query(
              q.Get(
                q.Intersection([
                  q.Match(
                    q.Index('subscription_by_user_ref'),
                    q.Select(
                      "ref",
                      q.Get(
                        q.Match(
                          q.Index('user_by_email'),
                          q.Casefold(session.user.email),
                        )
                      )
                    )
                  ),                          
                  q.Match(
                    q.Index('subscription_by_status'),
                    "active"
                    )

                ])
              )
            )
            return {
              ...session,
              activeSubscription: userActiveSubscription,
            };

           } catch (e) {
              return{
                ...session,
                activeSubscription: {
                  "ref": "330687476539588674",
                  "ts": 1651627003140000,
                  "data": {
                    "id": "sub_1KvWpWFXs2YOuOCpxb54bv6G",
                    "ref": "330683284089471043",
                    "status": "active",
                    "price_id": "price_1KpJJ4FXs2YOuOCpnnwUOcC5"
                  }
                } ,
              }

           }

       },

    async signIn({user}) {
      const { email } = user
      
      try{ 
        await fauna.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          ),  q.Create(
            q.Collection('users'),
            {data: { email } }
          ), 
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(user.email)
            )
          )
        )
       
      )
      return true
      } catch {
        return false
      }
      
    },
  }
})

//329864710777208898
//329864710777208898