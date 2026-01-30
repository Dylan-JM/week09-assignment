import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <SignIn />
    </div>
  );
}
