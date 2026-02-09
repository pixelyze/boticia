import { reactive, ref } from "vue";

/**
 * Composable pour gérer les formulaires avec validation et soumission
 * @param initialData Données initiales du formulaire
 * @param validationRules Règles de validation pour les champs du formulaire (optionnel)
 * @param submitHandler Fonction à exécuter lors de la soumission du formulaire
 * @returns État et méthodes pour manipuler le formulaire
 */
export const useForm = <T extends Record<string, any>>(
  initialData: T,
  validationRules?: Record<keyof T, (value: any) => string | null>,
  submitHandler?: (data: T) => Promise<void> | void
) => {
  // État du formulaire
  const formData = reactive<T>({ ...initialData }) as T;
  const errors = reactive<Record<string, string | null>>({});
  const isSubmitting = ref(false);
  const isSuccessful = ref(false);
  const submitError = ref<string | null>(null);

  /**
   * Valide un champ spécifique du formulaire
   * @param field Nom du champ à valider
   * @returns true si le champ est valide, false sinon
   */
  const validateField = (field: keyof T): boolean => {
    // Si pas de règles de validation, considéré comme valide
    if (!validationRules || !validationRules[field]) {
      errors[field as string] = null;
      return true;
    }

    // Appliquer la règle de validation
    const errorMessage = validationRules[field](formData[field]);
    errors[field as string] = errorMessage;

    return errorMessage === null;
  };

  /**
   * Valide tous les champs du formulaire
   * @returns true si tous les champs sont valides, false sinon
   */
  const validate = (): boolean => {
    let isValid = true;

    // Valider chaque champ
    for (const field in formData) {
      if (!validateField(field as keyof T)) {
        isValid = false;
      }
    }

    return isValid;
  };

  /**
   * Réinitialise le formulaire à son état initial
   */
  const reset = () => {
    // Réinitialiser les données
    Object.keys(formData).forEach((key) => {
      formData[key as keyof T] = initialData[key as keyof T];
    });

    // Réinitialiser les erreurs et l'état
    Object.keys(errors).forEach((key) => {
      errors[key] = null;
    });

    isSuccessful.value = false;
    submitError.value = null;
  };

  /**
   * Soumet le formulaire après validation
   * @returns Promise résolue si soumission réussie, rejetée sinon
   */
  const submit = async (): Promise<void> => {
    // Valider le formulaire
    const isValid = validate();
    if (!isValid) {
      return Promise.reject(new Error("Formulaire invalide"));
    }

    // Si pas de gestionnaire de soumission, retourner succès
    if (!submitHandler) {
      isSuccessful.value = true;
      return Promise.resolve();
    }

    try {
      // Exécuter la soumission
      isSubmitting.value = true;
      submitError.value = null;

      await submitHandler(formData);

      isSuccessful.value = true;
      return Promise.resolve();
    } catch (error) {
      // Gérer l'erreur
      submitError.value =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la soumission";
      return Promise.reject(error);
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isSuccessful,
    submitError,
    validateField,
    validate,
    reset,
    submit,
  };
};
