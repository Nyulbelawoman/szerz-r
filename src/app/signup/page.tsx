import AuthForm from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <AuthForm mode="signup" />
    </div>
  );
}
