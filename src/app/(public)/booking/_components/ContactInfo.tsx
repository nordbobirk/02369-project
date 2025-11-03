import { BookingFormData } from "./Form";

export function ContactInfo({
  formData,
  handleInputChange,
}: {
  formData: BookingFormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}) {
  return (
    <div className="rounded-xl p-8 border-2 border-black">
      <h2 className="text-2xl font-bold mb-6">4. Dine kontaktoplysninger</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block font-medium mb-2">
            Dit fulde navn<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="Dit fulde navn"
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-medium mb-2">
            Din emailadresse<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
            placeholder="din@email.dk"
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="phone" className="block font-medium mb-2">
          Telefonnummer<span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border rounded-lg"
          placeholder="Telefonnummer"
        />
      </div>
      <div className="mt-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="isFirstTattoo"
            checked={formData.isFirstTattoo}
            onChange={handleInputChange}
            className="w-5 h-5 rounded"
          />
          <span>
            Det er min første tatovering. (bruges kun til at tage ekstra hensyn
            til dig)
          </span>
        </label>
      </div>
    </div>
  );
}
