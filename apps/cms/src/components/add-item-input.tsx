import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddItemInputProps {
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	onAdd: () => void;
	disabled?: boolean;
	icon?: React.ReactNode;
}

export const AddItemInput = ({
	placeholder,
	value,
	onChange,
	onAdd,
	disabled,
	icon,
}: AddItemInputProps) => {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			onAdd();
		}
	};

	return (
		<div className="flex gap-2">
			<Input
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				disabled={disabled}
			/>
			<Button onClick={onAdd} disabled={disabled}>
				{icon || "+"}
			</Button>
		</div>
	);
};
