import { describe, it, expect, vi } from "vitest";
import { useForm } from "~/composables/useForm";

describe("useForm", () => {
  const initialData = {
    name: "",
    email: "",
    phone: "",
  };

  it("initialise avec les donnees fournies", () => {
    const { formData } = useForm(initialData);
    expect(formData.name).toBe("");
    expect(formData.email).toBe("");
    expect(formData.phone).toBe("");
  });

  it("valide un champ avec une regle passante", () => {
    const rules = {
      name: (v: string) => (v.trim() ? null : "Requis"),
      email: () => null,
      phone: () => null,
    };
    const { formData, validateField, errors } = useForm(initialData, rules);
    formData.name = "Marie";
    const valid = validateField("name");
    expect(valid).toBe(true);
    expect(errors.name).toBeNull();
  });

  it("valide un champ avec une regle echouante", () => {
    const rules = {
      name: (v: string) => (v.trim() ? null : "Requis"),
      email: () => null,
      phone: () => null,
    };
    const { validateField, errors } = useForm(initialData, rules);
    const valid = validateField("name");
    expect(valid).toBe(false);
    expect(errors.name).toBe("Requis");
  });

  it("validate() retourne false si un champ est invalide", () => {
    const rules = {
      name: (v: string) => (v.trim() ? null : "Requis"),
      email: (v: string) => (v.includes("@") ? null : "Email invalide"),
      phone: () => null,
    };
    const { validate } = useForm(initialData, rules);
    expect(validate()).toBe(false);
  });

  it("validate() retourne true si tous les champs sont valides", () => {
    const rules = {
      name: (v: string) => (v.trim() ? null : "Requis"),
      email: (v: string) => (v.includes("@") ? null : "Email invalide"),
      phone: () => null,
    };
    const { formData, validate } = useForm(initialData, rules);
    formData.name = "Marie";
    formData.email = "marie@test.com";
    expect(validate()).toBe(true);
  });

  it("reset() reinitialise les donnees et les erreurs", () => {
    const rules = {
      name: (v: string) => (v.trim() ? null : "Requis"),
      email: () => null,
      phone: () => null,
    };
    const { formData, validate, reset, errors, isSuccessful } = useForm(
      initialData,
      rules
    );
    formData.name = "Marie";
    validate();
    reset();
    expect(formData.name).toBe("");
    expect(errors.name).toBeNull();
    expect(isSuccessful.value).toBe(false);
  });

  it("submit() appelle le handler et passe isSuccessful a true", async () => {
    const handler = vi.fn();
    const { formData, submit, isSuccessful } = useForm(
      initialData,
      undefined,
      handler
    );
    formData.name = "Marie";
    await submit();
    expect(handler).toHaveBeenCalledOnce();
    expect(isSuccessful.value).toBe(true);
  });

  it("submit() rejette si la validation echoue", async () => {
    const rules = {
      name: (v: string) => (v.trim() ? null : "Requis"),
      email: () => null,
      phone: () => null,
    };
    const handler = vi.fn();
    const { submit } = useForm(initialData, rules, handler);
    await expect(submit()).rejects.toThrow("Formulaire invalide");
    expect(handler).not.toHaveBeenCalled();
  });

  it("submit() capture les erreurs du handler", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("Erreur serveur"));
    const { submit, submitError, isSubmitting } = useForm(
      initialData,
      undefined,
      handler
    );
    await expect(submit()).rejects.toThrow("Erreur serveur");
    expect(submitError.value).toBe("Erreur serveur");
    expect(isSubmitting.value).toBe(false);
  });

  it("fonctionne sans regles de validation", () => {
    const { validate } = useForm(initialData);
    expect(validate()).toBe(true);
  });
});
