"use client";
import { useEffect, useRef } from "react";
import { auth } from "@/lib/firebase"; // you should have already created this file
import 'firebaseui/dist/firebaseui.css';

export default function LoginPage() {
  const uiRef = useRef();

  useEffect(() => {
    import("firebaseui").then(firebaseui => {
      // Only render UI once
      if (!uiRef.current?.firstChild) {
        const ui =
          firebaseui.auth.AuthUI.getInstance() ||
          new firebaseui.auth.AuthUI(auth);
        ui.start("#firebaseui-auth-container", {
          signInOptions: [
            "google.com",
            "password",
          ],
          callbacks: {
            signInSuccessWithAuthResult: () => false,
          },
        });
      }
    });
  }, []);

  return (
    <main className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-white/90 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-black">Login to Sonar</h1>
        <div id="firebaseui-auth-container" ref={uiRef} />
      </div>
    </main>
  );
}
