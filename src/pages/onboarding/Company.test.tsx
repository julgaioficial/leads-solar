import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import OnboardingCompany from "./Company";
import { generateSlug } from "@/lib/slug";

describe("OnboardingCompany", () => {
  it("renders the company form", () => {
    render(
      <BrowserRouter>
        <OnboardingCompany />
      </BrowserRouter>
    );

    expect(screen.getByText("Dados da Empresa")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome da Empresa")).toBeInTheDocument();
    expect(screen.getByLabelText("CNPJ")).toBeInTheDocument();
    expect(screen.getByLabelText("Cidade")).toBeInTheDocument();
    expect(screen.getByLabelText("Estado")).toBeInTheDocument();
  });

  it("displays slug preview when company name is entered", () => {
    render(
      <BrowserRouter>
        <OnboardingCompany />
      </BrowserRouter>
    );

    const companyInput = screen.getByLabelText("Nome da Empresa") as HTMLInputElement;
    
    // Simulate user input
    fireEvent.change(companyInput, { target: { value: "Solar Energy Ltda", name: "companyName" } });

    // Check that the slug preview is displayed
    expect(screen.getByText(/Seu domínio:/)).toBeInTheDocument();
    expect(screen.getByText(/seudominio\.com\/s\//)).toBeInTheDocument();
  });

  it("does not display slug preview when company name is empty", () => {
    render(
      <BrowserRouter>
        <OnboardingCompany />
      </BrowserRouter>
    );

    expect(screen.queryByText(/seudominio\.com\/s\//)).not.toBeInTheDocument();
  });

  it("displays back and continue buttons", () => {
    render(
      <BrowserRouter>
        <OnboardingCompany />
      </BrowserRouter>
    );

    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continuar/i })).toBeInTheDocument();
  });

  it("displays all required form fields", () => {
    render(
      <BrowserRouter>
        <OnboardingCompany />
      </BrowserRouter>
    );

    expect(screen.getByLabelText("Nome da Empresa")).toBeInTheDocument();
    expect(screen.getByLabelText("CNPJ")).toBeInTheDocument();
    expect(screen.getByLabelText("Cidade")).toBeInTheDocument();
    expect(screen.getByLabelText("Estado")).toBeInTheDocument();
    expect(screen.getByLabelText("Endereço")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição (opcional)")).toBeInTheDocument();
  });
});
