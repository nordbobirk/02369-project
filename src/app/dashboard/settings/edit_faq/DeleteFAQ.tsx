'use client'

import { Button } from '@/components/ui/button'
import { deleteFAQ } from './actions'

/**
 * DeleteFAQ Component
 * 
 * Permanently deletes an FAQ entry from the database.
 * Prompts the user to confirm deletion before calling the server.
 */
export default function DeleteFAQ({ id, onDeletedAction }: { id: number, onDeletedAction: () => void }) {
  return (
    <form
      action={async () => {
        // Ask for confirmation
        if (!window.confirm("Are you sure you want to delete this FAQ?")) {
          return
        }

        // If confirmed, delete and call callback
        await deleteFAQ(id)
        onDeletedAction()
      }}
      className="inline"
    >
      <Button type="submit" className="bg-rose-300 hover:bg-rose-400 text-white font-semibold rounded-xl px-4 py-2 shadow-sm">
        Delete
      </Button>
    </form>
  )
}
