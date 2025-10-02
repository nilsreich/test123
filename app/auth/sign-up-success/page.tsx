

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="border rounded-md p-4">
            <h2 className="text-2xl">Thank you for signing up!</h2>
            <p className="mt-2">Check your email to confirm</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
