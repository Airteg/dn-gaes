import Image from "next/image";
import NavLink from "./ui/NavLink";
import ButtonLogout from "./ButtonLogout";

export default function UserSection({ user, onClose }) {
  return user ? (
    <div className="flex items-center gap-3 min-w-0">
      <Image
        src={user.image || "/img/avatar/Default-avatar.png"}
        width={40}
        height={40}
        alt={user.name ?? "Avatar"}
        className="rounded-full"
      />

      <NavLink href="/dashboard" onClick={onClose}>
        <div className="flex flex-col">
          <p>{user.name}</p>
          {/* <p className="text-sm">({user.role})</p> */}
        </div>
      </NavLink>
      <ButtonLogout />
    </div>
  ) : (
    <NavLink href="/login">Увійти</NavLink>
  );
}
