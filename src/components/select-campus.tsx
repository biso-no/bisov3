import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCampus } from "./context/campus";

type SelectCampusProps = {
  placeholder?: string;
  className?: string;
};

export const SelectCampus = ({ placeholder = "Velg campus", className }: SelectCampusProps) => {
  const { campuses, activeCampusId, selectCampus, loading } = useCampus();
  const handleValueChange = (value: string) => {
    selectCampus(value);
  };

  return (
    <Select value={activeCampusId ?? undefined} onValueChange={handleValueChange} disabled={loading}>
      <SelectTrigger className={className} aria-label="Velg campus">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {campuses.map((campus) => (
          <SelectItem key={campus.$id} value={campus.$id}>
            {campus.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
