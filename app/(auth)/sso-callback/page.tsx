import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import SkeletonLoader from '@/components/ui/skeleton-loader'

export default function SSOCallback() {
    return (
        <>
            <div className="fixed inset-0 z-50 bg-[#212121]">
                <SkeletonLoader />
            </div>
            <AuthenticateWithRedirectCallback />
        </>
    )
}
