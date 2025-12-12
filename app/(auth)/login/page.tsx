"use client";

import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Login() {
    const { isLoaded, isSignedIn } = useUser();
    const { signIn, isLoaded: isSignInLoaded, setActive: setSignInActive } = useSignIn();
    const { signUp, isLoaded: isSignUpLoaded, setActive: setSignUpActive } = useSignUp();

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [missingRequirements, setMissingRequirements] = useState<string[]>([]);

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
        if (!isSignInLoaded || !isSignUpLoaded) return;
        setLoading(true);
        try {
            const { status, supportedFirstFactors } = await signIn.create({
                identifier: email.trim(),
            });

            if (status === "complete") {
                await setSignInActive({ session: signIn.createdSessionId });
                router.push("/");
                return;
            }

            const emailCodeFactor = supportedFirstFactors?.find(
                (factor) => factor.strategy === "email_code"
            );

            if (emailCodeFactor) {
                const { emailAddressId } = emailCodeFactor as any;
                await signIn.prepareFirstFactor({
                    strategy: "email_code",
                    emailAddressId,
                });
                setVerifying(true);
                setIsSignUp(false);
            } else {
                alert("Login with email code matches is not enabled or available for this user.");
            }

        } catch (err: any) {
            if (err.errors?.[0]?.code === "form_identifier_not_found") {
                await startSignUp();
            } else {
                console.error("Email Login error", err);
                alert("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const startSignUp = async () => {
        try {
            await signUp?.create({
                emailAddress: email.trim(),
            });

            await signUp?.prepareVerification({
                strategy: "email_code",
            });

            setVerifying(true);
            setIsSignUp(true);
        } catch (err: any) {
            console.error("Sign Up error", err);
            if (err.errors?.[0]?.code === "form_identifier_exists") {
                alert("Account already exists. Please try logging in.");
            }
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignInLoaded || !isSignUpLoaded) return;
        setLoading(true);

        try {
            const trimmedCode = code.trim();
            if (isSignUp) {
                const completeSignUp = await signUp.attemptVerification({
                    strategy: "email_code",
                    code: trimmedCode,
                });

                if (completeSignUp.status === "complete") {
                    await setSignUpActive({ session: completeSignUp.createdSessionId });
                    router.push("/");
                } else if (completeSignUp.status === "missing_requirements") {
                    setMissingRequirements(completeSignUp.missingFields || []);
                } else {
                    console.error("Sign up verification failed", completeSignUp);
                    alert(`Verification failed. Status: ${completeSignUp.status}`);
                }
            } else {
                const completeSignIn = await signIn.attemptFirstFactor({
                    strategy: "email_code",
                    code: trimmedCode,
                });

                if (completeSignIn.status === "complete") {
                    await setSignInActive({ session: completeSignIn.createdSessionId });
                    router.push("/");
                } else {
                    console.error("Sign in verification failed", completeSignIn);
                    alert(`Verification incomplete. Status: ${completeSignIn.status}`);
                }
            }
        } catch (err: any) {
            console.error("Verification error", err);
            const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || "Invalid code. Please try again.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizeSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSignUpLoaded) return;
        setLoading(true);
        try {
            // Update the user with the missing requirements
            const completeSignUp = await signUp.update({
                password: password,
                firstName: firstName,
                lastName: lastName
            });

            if (completeSignUp.status === "complete") {
                await setSignUpActive({ session: completeSignUp.createdSessionId });
                router.push("/");
            } else {
                console.error("Finalization failed", completeSignUp);
                alert("Could not complete sign up. Check console.");
            }
        } catch (err: any) {
            console.error("Finalization error", err);
            const msg = err.errors?.[0]?.message || "Failed to finalize account.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    }

    // We show the "Finalize" form if we are missing *any* requirements (including password)
    // You could make this more granular, but asking for Name+Password together is standard.
    const showFinalizeForm = missingRequirements.length > 0;

    return (
        <div className="min-h-screen bg-white text-black flex flex-col font-sans">
            <header className="p-4 text-2xl font-bold text-[#2d333a] flex justify-center sm:justify-start">ChatGPT</header>
            <div className="max-w-[320px] m-auto text-center mt-[4rem] px-4">
                <h1 className="text-3xl font-bold text-[#2d333a]">
                    {showFinalizeForm ? "Complete your account" : verifying ? "Enter code" : "Log in or sign up"}
                </h1>
                <p className="text-black/50 mt-3 text-sm leading-5">
                    {showFinalizeForm
                        ? "Please enter your details to finish creating your account."
                        : verifying
                            ? `We sent a code to ${email}`
                            : "You'll get smarter responses and can upload files, images and more."
                    }
                </p>

                <div className="mt-8">
                    <div>
                        {!verifying ? (
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
                        ) : showFinalizeForm ? (
                            <form onSubmit={handleFinalizeSignUp} className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <input
                                        className="border border-gray-300 p-3 w-full rounded-full placeholder:text-gray-400 outline-none focus:border-[#10a37f] transition-all"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        type="text"
                                        required
                                    />
                                    <input
                                        className="border border-gray-300 p-3 w-full rounded-full placeholder:text-gray-400 outline-none focus:border-[#10a37f] transition-all"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        type="text"
                                        required
                                    />
                                </div>
                                <input
                                    className="border border-gray-300 p-3 w-full rounded-full placeholder:text-gray-400 outline-none focus:border-[#10a37f] transition-all"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-full bg-[#10a37f] hover:bg-[#1a7f64] w-full p-3 text-white font-medium my-4 cursor-pointer transition-colors"
                                >
                                    {loading ? "Finishing..." : "Complete Sign Up"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerify}>
                                <input
                                    className="border border-gray-300 p-3 w-full rounded-full placeholder:text-gray-400 outline-none focus:border-[#10a37f] transition-all text-center tracking-widest text-lg"
                                    placeholder="123456"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    type="text"
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-full bg-[#10a37f] hover:bg-[#1a7f64] w-full p-3 text-white font-medium my-4 cursor-pointer transition-colors"
                                >
                                    {loading ? "Verifying..." : "Verify"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVerifying(false)}
                                    className="text-sm text-[#10a37f] hover:underline mt-2"
                                >
                                    Edit email
                                </button>
                            </form>
                        )}
                    </div>

                    {!verifying && (
                        <>
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
                        </>
                    )}
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
