
import { toast } from "@/hooks/use-toast";

export const showSuccessToast = (message: string) => {
  toast({
    title: "Sucesso",
    description: message,
    duration: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast({
    title: "Erro",
    description: message,
    variant: "destructive",
    duration: 5000,
  });
};

export const showConfirmationToast = (message: string, onConfirm: () => void) => {
  toast({
    title: "Confirmação",
    description: message,
    action: (
      <button 
        onClick={onConfirm}
        className="px-3 py-1 rounded-md bg-destructive text-white text-xs font-medium"
      >
        Confirmar
      </button>
    ),
    duration: 5000,
  });
};
