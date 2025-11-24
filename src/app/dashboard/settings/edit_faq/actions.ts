'use server'

import { initServerClient } from "@/lib/supabase/server";
import { revalidatePath } from 'next/cache'

/**
 * Fetches all FAQ entries from the database.
 * Returns FAQs ordered by their index in ascending order.
 *
 * @returns {Promise<Array>} Array of FAQ objects containing id, question, answer, and index
 * @throws {Error} If the database query fails
 */
export async function getFAQs() {
    const supabase = await initServerClient()
    const { data, error } = await supabase
        .from('faq_contents')
        .select('*')
        .order('index', { ascending: true })

    if (error) throw error
    return data
}

export async function getCategories() {
    const supabase = await initServerClient()
    const { data, error } = await supabase
        .from('faq_contents')
        .select('category')
        .order('index', { ascending: true })

    if (error) throw error
    return data
}

/**
 * Updates an existing FAQ entry with new question and answer text.
 * Revalidates the FAQ page cache after successful update.
 *
 * @param {number} id - The unique identifier of the FAQ to update
 * @param {string} question - The new question text
 * @param {string} answer - The new answer text
 * @throws {Error} If the update fails
 */
export async function updateFAQ(id: number, category: string, question: string, answer: string) {
    const supabase = await initServerClient()
    const { error } = await supabase
        .from('faq_contents')
        .update({ category, question, answer })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/dashboard/settings/edit_faq')

}

/**
 * Creates a new FAQ entry in the database.
 * Revalidates the FAQ page cache after successful creation.
 *
 * @param {string} question - The question text for the new FAQ
 * @param {string} answer - The answer text for the new FAQ
 * @param {number} index - The position where the new FAQ should be inserted
 * @throws {Error} If the creation fails
 */
export async function createFAQ(category: string, question: string, answer: string, index: number): Promise<{
    id: number
    category: string
    question: string
    answer: string
    index: number
}> {
    const supabase = await initServerClient()
    const { data, error } = await supabase
        .from('faq_contents')
        .insert({ category, question, answer, index })
        .select()
        .single()

    if (error) throw error
    revalidatePath('/dashboard/settings/edit_faq')

    return data
}


/**
 * Permanently deletes an FAQ entry from the database.
 * Revalidates the FAQ page cache after successful deletion.
 *
 * @param {number} id - The unique identifier of the FAQ to delete
 * @throws {Error} If the deletion fails
 */
export async function deleteFAQ(id: number) {
    const supabase = await initServerClient()
    const { error } = await supabase
        .from('faq_contents')
        .delete()
        .eq('id', id)

    if (error) throw error
    revalidatePath('/dashboard/settings/edit_faq')

}

/**
 * Reorders an FAQ item to a new position in the list.
 * Recalculates and updates the index for all affected FAQ entries
 * to maintain consistent ordering.
 *
 * @param {number} id - The unique identifier of the FAQ to move
 * @param {number} newIndex - The target position (0-indexed) for the FAQ
 * @throws {Error} If the reordering fails
 */
export async function reorderFAQ(id: number, newIndex: number) {
    const supabase = await initServerClient()

    // Henter alle FAQs
    const { data: allFAQs, error: fetchError } = await supabase
        .from('faq_contents')
        .select('*')
        .order('index', { ascending: true })

    if (fetchError || !allFAQs) {
        console.error('Error fetching FAQs:', fetchError)
        return
    }

    const oldIndex = allFAQs.findIndex(f => f.id === id)

    if (oldIndex === -1 || oldIndex === newIndex) return

    // Only update affected FAQs
    const updates = []

    if (oldIndex < newIndex) {
        // Moving down: shift items between oldIndex and newIndex up by 1
        for (let i = oldIndex + 1; i <= newIndex; i++) {
            updates.push(
                supabase
                    .from('faq_contents')
                    .update({ index: i - 1 })
                    .eq('id', allFAQs[i].id)
            )
        }
    } else {
        // Moving up: shift items between newIndex and oldIndex down by 1
        for (let i = newIndex; i < oldIndex; i++) {
            updates.push(
                supabase
                    .from('faq_contents')
                    .update({ index: i + 1 })
                    .eq('id', allFAQs[i].id)
            )
        }
    }

    // Update the moved item
    updates.push(
        supabase
            .from('faq_contents')
            .update({ index: newIndex })
            .eq('id', id)
    )

    await Promise.all(updates)
    revalidatePath('/dashboard/settings/edit_faq')

}
