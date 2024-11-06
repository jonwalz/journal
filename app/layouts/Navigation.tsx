import ToggleThemeButton from "~/features/theme/ToggleThemeButton";

export default function Navigation() {
  return (
    <nav className="fixed left-0 top-0 z-20 mx-auto flex h-[88px] w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack px-5 m500:h-16">
      <ToggleThemeButton />
    </nav>
  );
}
