import { type Filter } from "../hooks/useTodoFilter";
type TodoFilterBarProps = {
  filter: Filter;
  onFilterChange: (nextFilter: Filter) => void;
};
function TodoFilterBar({ filter, onFilterChange }: TodoFilterBarProps) {
  const filterOptions: { label: string; value: Filter }[] = [
    {
      label: "Alle",
      value: "all",
    },
    { label: "Offen", value: "active" },
    { label: "Erledigt", value: "completed" },
  ];
  return (
    <div
      role="group"
      aria-label="Filtern nach Status"
      className="button-container">
      {filterOptions.map((option) => (
        <button
          onClick={() => onFilterChange(option.value)}
          key={option.value}
          aria-pressed={filter === option.value}
          type="button">
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TodoFilterBar;
