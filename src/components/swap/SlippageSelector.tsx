
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlippageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  disabled?: boolean;
}

const SlippageSelector = ({
  value,
  onChange,
  options,
  disabled = false,
}: SlippageSelectorProps) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-fipt-muted mb-2 block">Slippage Tolerance</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <Button
            key={option}
            type="button"
            variant="outline"
            className={cn(
              "flex-1 text-sm", 
              value === option && "bg-fipt-blue/10 border-fipt-blue text-fipt-blue"
            )}
            onClick={() => onChange(option)}
            disabled={disabled}
          >
            {option}%
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SlippageSelector;
