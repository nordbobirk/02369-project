'use client'

import SaveEditedFAQ from './SaveEditedFAQ'
import CancelEdit from './CancelEdit'
import { DropSelectMenu } from './DropSelect'

type EditFAQProps = {
  id: number
  category: string
  question: string
  answer: string
  onCategoryChange: (value: string) => void
  onQuestionChange: (value: string) => void
  onAnswerChange: (value: string) => void
  onCancelAction: () => void
  onSavedAction: (updated: { id: number, category: string, question: string, answer: string }) => void
}

/**
 * EditFAQ Component
 *
 * Provides an inline editing interface for FAQ entries with input fields for
 * the question, answer, and category — plus save/cancel buttons.
 */
export default function EditFAQ({
  id,
  category,
  question,
  answer,
  onCategoryChange,
  onQuestionChange,
  onAnswerChange,
  onCancelAction,
  onSavedAction,
}: EditFAQProps) {

  return (
    <>
      {/* Category dropdown */}
      <DropSelectMenu value={category} hasCreate={false} onChange={onCategoryChange} />

      {/* Hidden input so the value is sent in form submissions if needed */}
      <input type="hidden" name="category" value={category} />

      {/* Question input */}
      <input
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder="Question"
        className="w-full mb-2 p-2 border rounded"
        required
      />

      {/* Answer input */}
      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Answer"
        className="w-full mb-2 p-2 border rounded"
        rows={4}
      />

      {/* Save & Cancel buttons */}
      <SaveEditedFAQ
        id={id}
        category={category}
        question={question}
        answer={answer}
        onCancelAction={onCancelAction}
        onSavedAction={onSavedAction}
      />
      <CancelEdit onCancelAction={onCancelAction} />
    </>
  )
}
