import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <SignUp />
    </div>
  );
}
