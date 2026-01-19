import LoginForm from "./_components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-xl mb-4 overflow-hidden">
          <Image
            src="/drphil.svg"
            alt="Dr. Phil Logo"
            width={64}
            height={64}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold text-green-600">Admin Portal</h1>
        <p className="text-slate-400 mt-2">Sign In brother :3</p>
      </div>
      <LoginForm />
    </div>
  );
}
