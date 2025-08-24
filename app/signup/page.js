"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import 'firebaseui/dist/firebaseui.css';
import Image from "next/image";

export default function SignupPage() {
  const uiRef = useRef();
  const router = useRouter();

  useEffect(() => {
    import('firebaseui').then(firebaseui => {
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(auth);

      ui.start("#firebaseui-auth-container", {
        signInOptions: [
          "google.com",
          "password",
        ],
        signInFlow: "popup", // or "redirect"
        callbacks: {
          signInSuccessWithAuthResult: (authResult) => {
            // Redirect after success
            router.push("/dashboard");
            return false; // Important: Prevent FirebaseUI from doing its own redirect
          },
        },
      });
    });
  }, [router]);

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <Image
        src="/alan.gif"
        alt="Animated space"
        fill
        priority
        className="object-cover object-center z-0"
        style={{ opacity: 0.34 }}
      />
      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
      <div className="relative z-20 flex flex-col items-center justify-center min-w-[320px] max-w-md bg-black/80 rounded-2xl shadow-2xl px-7 py-10">
        <h1 className="text-2xl font-bold mb-6 text-sky-200">
          Sign up for Sonar
        </h1>
        <div id="firebaseui-auth-container" ref={uiRef} />
      </div>
    </main>
  );
}
