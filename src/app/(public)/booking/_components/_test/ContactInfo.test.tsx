import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactInfo } from "../ContactInfo";

describe("ContactInfo", () => {
  const baseFormData = {
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "12345678",
    isFirstTattoo: false,
    tattoos: [],
    dateTime: new Date(),
  };

  it("renders all input fields with correct labels", () => {
    const mockHandler = jest.fn();

    render(
      <ContactInfo formData={baseFormData} handleInputChange={mockHandler} />
    );

    // Name
    expect(
      screen.getByLabelText(/Dit fulde navn/i)
    ).toBeInTheDocument();

    // Email
    expect(
      screen.getByLabelText(/Din emailadresse/i)
    ).toBeInTheDocument();

    // Phone
    expect(
      screen.getByLabelText(/Telefonnummer/i)
    ).toBeInTheDocument();

    // Checkbox
    expect(
      screen.getByLabelText(/Det er min første tatovering/i)
    ).toBeInTheDocument();
  });

  it("populates inputs with formData values", () => {
    const mockHandler = jest.fn();

    render(
      <ContactInfo formData={baseFormData} handleInputChange={mockHandler} />
    );

    expect(screen.getByLabelText(/Dit fulde navn/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/Din emailadresse/i)).toHaveValue(
      "john@example.com"
    );
    expect(screen.getByLabelText(/Telefonnummer/i)).toHaveValue("12345678");
    expect(
      screen.getByLabelText(/Det er min første tatovering/i)
    ).not.toBeChecked();
  });

  it("calls handleInputChange when typing in inputs", () => {
    const mockHandler = jest.fn();

    render(
      <ContactInfo formData={baseFormData} handleInputChange={mockHandler} />
    );

    const nameInput = screen.getByLabelText(/Dit fulde navn/i);
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it("calls handleInputChange when checkbox toggled", () => {
    const mockHandler = jest.fn();

    render(
      <ContactInfo formData={baseFormData} handleInputChange={mockHandler} />
    );

    const checkbox = screen.getByLabelText(/Det er min første tatovering/i);
    fireEvent.click(checkbox);

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });
});
