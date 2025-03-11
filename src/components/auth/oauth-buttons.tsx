"use client"

import * as React from "react"
import { signIn } from "next-auth/react"

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const callbacksURLforOAuth = {
  google: "/api/auth/signin/google",
  github: "/api/auth/signin/github",
}

export function OAuthButtons(): JSX.Element {
  const { toast } = useToast()

  async function handleOAuthSignIn(
    provider: "google" | "github"
  ): Promise<void> {
    try {
      await signIn(provider, {
        callbackUrl: callbacksURLforOAuth[provider],
      })

      toast({
        title: "Success!",
        description: "You are now signed in",
      })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again",
        variant: "destructive",
      })

      console.error(error)
      throw new Error(`Error signing in with ${provider}`)
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
      <Button
        aria-label="Sign in with Google"
        variant="outline"
        onClick={() => void handleOAuthSignIn("google")}
        className="w-full sm:w-auto"
      >
        <Icons.google className="mr-2 size-4" />
        Google
      </Button>

      <Button
        aria-label="Sign in with gitHub"
        variant="outline"
        onClick={() => void handleOAuthSignIn("github")}
        className="w-full sm:w-auto"
      >
        <Icons.gitHub className="mr-2 size-4" />
        GitHub
      </Button>
    </div>
  )
}
