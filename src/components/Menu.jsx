import { auth } from "@/auth";
import UserSection from "./UserSection";
import NavLink from "./ui/NavLink";
import ThemeToggleButton from "./ThemeToggleButton";
import MobileMenu from "./MobileMenu";

export default async function Menu() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="bg-[var(--nav-bg)] p-4">
      {/* MobileMenu — рендериться завжди, але показує себе сам */}
      <MobileMenu user={user} />
      <div className="hidden xl:flex w-full max-w  mx-auto items-center justify-between">
        {/* Ліво: Заголовок */}
        <div className="text-sm xl:text-base basis-1/4 2xl:text-lg font-bold">
          <h4 className="text-[var(--t-color)] ">Нижньодністровська ГЕС</h4>
        </div>

        {/* Центр: Навігація */}
        <div className="pl-10 flex grow-1 justify-around  text-[var(--m-color)]">
          <NavLink href="/">Головна</NavLink>
          <NavLink href="/news">Про нас</NavLink>
          <NavLink href="/documents">Документи</NavLink>
          <NavLink href="/contacts">Контакти</NavLink>
          <NavLink href="/admin">Адміністрування</NavLink>
        </div>

        {/* Право: Юзер і Тема */}
        <div className="flex items-center basis-1/4 justify-around">
          <UserSection user={user} />
          <ThemeToggleButton />
        </div>
      </div>
    </nav>
  );
}
