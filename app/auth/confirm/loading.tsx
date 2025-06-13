import { Loader2 } from "lucide-react"

export default function ConfirmationLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4 text-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#5281EE]" />
        <h1 className="text-2xl font-bold">Verifying your email...</h1>
        <p className="text-gray-600">Please wait while we confirm your email address.</p>
      </div>
    </div>
  )
}
