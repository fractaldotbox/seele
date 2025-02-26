import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddItemInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}

export const AddItemInput = ({
  placeholder,
  value,
  onChange,
  onAdd,
}: AddItemInputProps) => (
  <div className="flex items-center gap-4">
    <Input
      type="text"
      placeholder={placeholder}
      className="w-full"
      onChange={(e) => onChange(e.target.value)}
      value={value}
    />
    <Button
      variant="ghost"
      size="icon"
      onClick={onAdd}
      disabled={!value.trim()}
    >
      <Plus className="w-4 h-4" />
    </Button>
  </div>
);
