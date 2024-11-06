import { Button } from "../ui/button";
import { useTheme } from "../ThemeProvider";

export default function ToggleThemeButton() {
  const [theme, toggleTheme] = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  );
}
