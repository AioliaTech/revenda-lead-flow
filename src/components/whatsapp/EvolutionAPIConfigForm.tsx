
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useEvolutionAPIConfig } from "@/hooks/use-evolution-api-config";
import { showSuccessToast } from "@/components/ui/toast-helper";

interface Props {
  onSave?: () => void;
}

const EvolutionAPIConfigForm: React.FC<Props> = ({ onSave }) => {
  const { config, updateConfig } = useEvolutionAPIConfig();
  const [form, setForm] = useState(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateConfig(form);
    showSuccessToast("Configuração do Evolution API salva!");
    onSave?.();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">URL do Evolution API</label>
        <Input
          name="baseURL"
          value={form.baseURL}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Token da API</label>
        <Input
          name="defaultToken"
          value={form.defaultToken}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Nome da Instância</label>
        <Input
          name="defaultInstance"
          value={form.defaultInstance}
          onChange={handleChange}
        />
      </div>
      <Button type="button" onClick={handleSave} className="bg-crm-primary gap-2">
        <Save className="h-4 w-4" /> Salvar Configuração
      </Button>
    </div>
  );
};

export default EvolutionAPIConfigForm;
