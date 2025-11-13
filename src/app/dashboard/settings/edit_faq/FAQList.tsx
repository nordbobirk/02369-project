'use client'

import { Button } from '@/components/ui/button'
import AddFAQ from './AddFAQ'
import DeleteFAQ from './DeleteFAQ'
import EditFAQ from './EditFAQ'
import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { reorderFAQ } from './actions'
import type { DragEndEvent } from '@dnd-kit/core'
import Image from "next/image";

/**
 * FAQ data structure
 */
type FAQ = {
    id: number
    category: string
    question: string
    answer: string
    index: number
}

/**
 * SortableFAQItem Component
 *
 * Renders a single FAQ item with drag-and-drop functionality.
 * Displays either the view mode with edit/delete buttons or the edit mode with input fields.
 * Uses dnd-kit for drag-and-drop reordering.
 *
 * @component
 * @param {Object} props - Component props
 * @param {FAQ} props.faq - The FAQ data to display
 * @param {boolean} props.isEditing - Whether this FAQ is currently being edited
 * @param {Function} props.onEdit - Callback to enter edit mode
 * @param {string} props.editCategroy - Current value of the category in edit mode
 * @param {string} props.editQuestion - Current value of the question in edit mode
 * @param {string} props.editAnswer - Current value of the answer in edit mode
 * @param {Function} props.onCategoryChance - Callback when category text changes
 * @param {Function} props.onQuestionChange - Callback when question text changes
 * @param {Function} props.onAnswerChange - Callback when answer text changes
 * @param {Function} props.onCancelAction - Callback to exit edit mode
 */
function SortableFAQItem({ faq, isEditing, onEdit, editCategory, editQuestion, editAnswer, onCategoryChange, onQuestionChange, onAnswerChange, onCancelAction, onDeletedAction, onSavedAction }: {
    faq: FAQ
    isEditing: boolean
    onEdit: () => void
    editCategory: string
    editQuestion: string
    editAnswer: string
    onCategoryChange: (c: string) => void
    onQuestionChange: (q: string) => void
    onAnswerChange: (a: string) => void
    onCancelAction: () => void
    onDeletedAction: () => void
    onSavedAction: (updated: { id: number, category: string, question: string, answer: string }) => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: faq.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className="border p-4 rounded-lg bg-white">
            {isEditing ? (
                <EditFAQ
                    id={faq.id}
                    category={editCategory}
                    question={editQuestion}
                    answer={editAnswer}
                    onCategoryChange={onCategoryChange}
                    onQuestionChange={onQuestionChange}
                    onAnswerChange={onAnswerChange}
                    onCancelAction={onCancelAction}
                    onSavedAction={onSavedAction}
                />
            ) : (
                <>
                    <div className="flex items-start gap-3">
                        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1 text-gray-400 hover:text-gray-600">
                            <Image src="/icons/drag_indicator.svg" alt="Drag handle" width={20} height={20} />
                        </div>
                        <div className="mb-4 p-4 rounded-lg ">
                            <h1 className="text-sm font-semibold text-rose-300 tracking-wide mb-1">{faq.category}</h1>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
                            <Button onClick={onEdit} variant="outline" className="mr-2">Rediger</Button>
                            <DeleteFAQ
                                id={faq.id}
                                onDeletedAction={onDeletedAction}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

/**
 * FAQList Component
 *
 * Main component for displaying and managing the FAQ list.
 * Provides drag-and-drop reordering, editing, and deletion functionality.
 * Manages edit state and handles optimistic updates for reordering.
 *
 * @component
 * @param {Object} props - Component props
 * @param {FAQ[]} props.initialFAQs - Initial FAQ data fetched from the server
 */
export default function FAQList({ initialFAQs }: { initialFAQs: FAQ[] }) {
    const [faqs, setFaqs] = useState(initialFAQs)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editCategory, setEditCategory] = useState('')
    const [editQuestion, setEditQuestion] = useState('')
    const [editAnswer, setEditAnswer] = useState('')

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleEdit = (faq: FAQ) => {
        setEditingId(faq.id)
        setEditCategory(faq.category)
        setEditQuestion(faq.question)
        setEditAnswer(faq.answer)
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditCategory('')
        setEditQuestion('')
        setEditAnswer('')
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        console.log('Drag ended:', { active: active.id, over: over?.id })

        if (over && active.id !== over.id) {
            const oldIndex = faqs.findIndex(f => f.id === active.id)
            const newIndex = faqs.findIndex(f => f.id === over.id)

            // Optimistic update - updates ui before server call
            const newFaqs = arrayMove(faqs, oldIndex, newIndex)

            // Opdaterer med de nye index værdier
            const updatedFaqs = newFaqs.map((faq, idx) => ({
                ...faq,
                index: idx
            }))

            setFaqs(updatedFaqs)

            await reorderFAQ(Number(active.id), newIndex)
        }
    }

    const maxIndex = faqs[faqs.length - 1]?.index ?? 0

    return (
        <div className="space-y-4">
            <AddFAQ
                maxIndex={maxIndex}
                onFAQAddedAction={(newFAQ) => setFaqs([...faqs, newFAQ])}
            />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={faqs.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    {faqs.map(faq => (
                        <SortableFAQItem
                            key={faq.id}
                            faq={faq}
                            isEditing={editingId === faq.id}
                            onEdit={() => handleEdit(faq)}
                            editCategory={editCategory}
                            editQuestion={editQuestion}
                            editAnswer={editAnswer}
                            onCategoryChange={setEditCategory}
                            onQuestionChange={setEditQuestion}
                            onAnswerChange={setEditAnswer}
                            onCancelAction={handleCancel}
                            onDeletedAction={() => setFaqs(faqs.filter(f => f.id !== faq.id))}
                            onSavedAction={(updated) => setFaqs(faqs.map(f => f.id === updated.id ? { ...f, ...updated } : f))}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    )
}
