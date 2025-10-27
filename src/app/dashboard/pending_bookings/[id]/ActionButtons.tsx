
'use client'

// apparently this is needed for the client side since we are using nextjs routing
// and there can't be used multiple of such client components in the same server side file.

import AcceptButton from './AcceptPendingBooking'
import RejectButton from './RejectPendingBooking'

export default function ActionButtons() {
    return (
        <div>
            <AcceptButton /><span> </span>
            <RejectButton />
        </div>
    )
}