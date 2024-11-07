import ToggleThemeButton from "~/components/ToggleThemeButton";

export default function Navigation() {
  return (
    <nav className="justify-between fixed left-0 top-0 z-20 mx-auto flex h-[88px] w-full items-center border-b-4 border-border dark:border-darkNavBorder bg-white dark:bg-secondaryBlack px-5 m500:h-16">
      <a
        className="dark:text-darkText text-[33px] m900:w-[unset] font-heading m500:text-xl"
        href="/"
      >
        Journal Brain
      </a>
      <ToggleThemeButton />
    </nav>
  );
}
