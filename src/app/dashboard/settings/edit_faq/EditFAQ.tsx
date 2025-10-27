import SaveEditedFAQ from './SaveEditedFAQ'
import CancelEdit from './CancelEdit'

/**
 * Props for the EditFAQ component
 */
type EditFAQProps = {
    id: number
    question: string
    answer: string
    onQuestionChange: (value: string) => void
    onAnswerChange: (value: string) => void
    onCancelAction: () => void
    onSavedAction: (updated: { id: number, question: string, answer: string }) => void
}

/**
 * EditFAQ Component
 *
 * Provides an inline editing interface for FAQ entries with input fields for
 * the question and answer, along with save and cancel buttons.
 *
 * @component
 */
export default function EditFAQ({
        id,
        question,
        answer,
        onQuestionChange,
        onAnswerChange,
        onCancelAction,
        onSavedAction
    }: EditFAQProps) {
    return (
        <>
            <input
                value={question}
                onChange={(e) => onQuestionChange(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
            />
            <textarea
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                rows={4}
            />
            <SaveEditedFAQ
                id={id}
                question={question}
                answer={answer}
                onCancelAction={onCancelAction}
                onSavedAction={onSavedAction}
            />
            <CancelEdit onCancelAction={onCancelAction} />
        </>
    )
}
