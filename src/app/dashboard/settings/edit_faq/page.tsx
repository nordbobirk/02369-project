import { getFAQs } from './actions'
import FAQList from './FAQList'

export default async function FAQPage() {
    const faqs = await getFAQs()

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">FAQ - Frequently asked questions</h1>
            <FAQList initialFAQs={faqs} />
        </div>
    )
}