"use client";

import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn, useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Login() {
    const { isLoaded, isSignedIn } = useUser();
    const { signIn, isLoaded: isSignInLoaded } = useSignIn();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isLoaded) return <div className="flex bg-white h-screen w-full items-center justify-center"><div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div><div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div><div className="h-1.5 w-1.5 bg-black rounded-full animate-bounce"></div></div>;

    if (isSignedIn) {
        router.push("/");
        return null;
    }

    const handleOAuth = async (strategy: any) => {
        if (!isSignInLoaded) return;
        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback?__clerk_ssr=true",
                redirectUrlComplete: "/",
            });
        } catch (err) {
            console.error("OAuth error", err);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded) return;
        setLoading(true);
        try {

            const { supportedFirstFactors } = await signIn.create({
                identifier: email,
            });

        } catch (err: any) {
            console.error("Email error", err);
            if (err.errors?.[0]?.code === "form_identifier_not_found") {
                alert("Account not found. Please sign up.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col font-sans">
            <header className="p-4 text-2xl font-bold text-[#2d333a] flex justify-center sm:justify-start">ChatGPT</header>
            <div className="max-w-[320px] m-auto text-center mt-[4rem] px-4">
                <h1 className="text-3xl font-bold text-[#2d333a]">Log in or sign up</h1>
                <p className="text-black/50 mt-3 text-sm leading-5">You'll get smarter responses and can upload files, images and more.</p>

                <div className="mt-8">
                    <div>
                        <form onSubmit={handleEmailSubmit}>
                            <input
                                className="border border-gray-300 p-3 w-full rounded-full placeholder:text-gray-400 outline-none focus:border-[#10a37f] transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-full bg-[#10a37f] hover:bg-[#1a7f64] w-full p-3 text-white font-medium my-4 cursor-pointer transition-colors"
                            >
                                {loading ? "Loading..." : "Continue"}
                            </button>
                        </form>
                    </div>
                    <div className="flex gap-2 items-center my-4">
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                        <div className="px-1 font-semibold text-xs text-gray-400">OR</div>
                        <div className="flex-1 h-[1px] bg-gray-200"></div>
                    </div>
                    <div className="space-y-3">
                        <button className="flex items-center justify-start gap-3 w-full border border-gray-300 p-3 rounded-full hover:bg-gray-50 transition-colors relative px-4" onClick={() => handleOAuth("oauth_google")}>
                            <Image src={'https://auth-cdn.oaistatic.com/assets/google-logo-NePEveMl.svg'} width={20} height={20} alt="Google Icon" />
                            <span className="flex-1 text-center font-medium text-[#2d333a]">Continue with Google</span>
                        </button>
                        <button className="flex items-center justify-start gap-3 w-full border border-gray-300 p-3 rounded-full hover:bg-gray-50 transition-colors relative px-4" onClick={() => handleOAuth("oauth_microsoft")}>
                            <Image src={'https://auth-cdn.oaistatic.com/assets/microsoft-logo-BUXxQnXH.svg'} width={20} height={20} alt="Microsoft Icon" />
                            <span className="flex-1 text-center font-medium text-[#2d333a]">Continue with Microsoft</span>
                        </button>
                        <button className="flex items-center justify-start gap-3 w-full border border-gray-300 p-3 rounded-full hover:bg-gray-50 transition-colors relative px-4" onClick={() => handleOAuth("oauth_apple")}>
                            <Image src={'https://auth-cdn.oaistatic.com/assets/apple-logo-vertically-balanced-rwLdlt8P.svg'} width={17} height={17} alt="Apple Icon" />
                            <span className="flex-1 text-center font-medium text-[#2d333a]">Continue with Apple</span>
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex justify-center items-center gap-3">
                    <Link href="/" className="text-[#10a37f] text-xs hover:underline">Terms of Use</Link>
                    <div className="text-gray-300">|</div>
                    <Link href="/" className="text-[#10a37f] text-xs hover:underline">Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}
