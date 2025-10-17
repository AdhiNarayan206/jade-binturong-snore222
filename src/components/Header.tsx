import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  return (
    <header className="flex items-center justify-end p-4 border-b">
      <ThemeToggle />
    </header>
  );
};

export default Header;