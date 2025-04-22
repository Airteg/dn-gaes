import { auth } from "@/auth";
import UserSection from "./UserSection";
import NavLink from "./ui/NavLink";
import ThemeToggleButton from "./ThemeToggleButton";
import MobileMenu from "./MobileMenu";

export default async function Menu() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="bg-[var(--nav-bg)] text-[var(--foreground)] p-4">
      <div className="hidden xl:flex w-full max-w-[1280px] mx-auto items-center justify-between gap-4">
        {/* Ліво: Заголовок */}
        <div className="text-sm xl:text-base 2xl:text-lg font-bold">
          <h5>ПрАТ Нижньодністровська ГЕС</h5>
        </div>

        {/* Центр: Навігація */}
        <div className="flex gap-4">
          <NavLink href="/">Головна</NavLink>
          <NavLink href="/news">Новини</NavLink>
          <NavLink href="/documents">Документи</NavLink>
          <NavLink href="/contacts">Контакти</NavLink>
          <NavLink href="/admin">Адміністрування</NavLink>
        </div>

        {/* Право: Юзер і Тема */}
        <div className="flex items-center gap-4">
          <UserSection user={user} />
          <ThemeToggleButton />
        </div>
      </div>

      {/* MobileMenu — рендериться завжди, але показує себе сам */}
      <MobileMenu user={user} />
    </nav>
  );
}
