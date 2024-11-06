import { createContext, useContext, useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

const ThemeContext = createContext<[string, () => void]>(["light", () => {}]);

export const ThemeProvider = ({
  children,
  theme: initialTheme,
}: {
  children: React.ReactNode;
  theme: string;
}) => {
  const [theme, setTheme] = useState(initialTheme);
  const fetcher = useFetcher();

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    fetcher.submit(
      { theme: newTheme },
      { action: "/set-theme", method: "post" }
    );
  };

  return (
    <ThemeContext.Provider value={[theme, toggleTheme]}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
