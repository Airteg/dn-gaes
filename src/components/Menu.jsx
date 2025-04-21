import { auth } from "@/auth";
import Image from "next/image.js";
import ButtonLogout from "./ButtonLogout.jsx";
import ThemeToggleButton from "./ThemeToggleButton.jsx";
import NavLink from "./ui/NavLink.jsx";
import MobileMenu from "./MobileMenu";

export default async function Menu() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="bg-[var(--nav-bg)]  p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="max-[1479px]:hidden border border-red-500">
          <h5>ПрАТ Нижньодністровська ГЕС</h5>
        </div>
        <div className="flex justify-around max-[1479px]:hidden border border-green-500">
          <NavLink href="/">Головна</NavLink>
          <NavLink href="/news">Новини</NavLink>
          <NavLink href="/documents">Документи</NavLink>
          <NavLink href="/contacts">Контакти</NavLink>
          <NavLink href="/admin">Адміністрування</NavLink>
        </div>
        <div className="flex justify-between items-center w-auto max-[1479px]:hidden border border-orange-500">
          {user ? (
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center">
                {user.image && (
                  <Image
                    src={user.image}
                    width={40}
                    height={40}
                    alt={user.name ?? "Avatar"}
                    style={{
                      borderRadius: "50%",
                    }}
                  />
                )}
                <div>
                  <NavLink href="/dashboard">
                    <p>{user.name}</p> <p>({user.role})</p>
                  </NavLink>
                </div>
                <ButtonLogout />
              </div>
            </div>
          ) : (
            <NavLink href="/login">Увійти</NavLink>
          )}
        </div>
        <div className="max-[1479px]:hidden">
          <ThemeToggleButton />
        </div>

        <MobileMenu user={user} />
      </div>
    </nav>
  );
}
