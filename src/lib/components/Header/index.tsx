"use client"
import { getClassNameFactory } from "../../get-className-factory";
import { usePathname } from "next/navigation";
import { getNavItems } from "@/lib/actions/main/actions";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

const getClassName = getClassNameFactory("Header", styles);

const NavItem = ({ label, href }: { label: string; href: string }) => {
  const navPath = usePathname().replace("/edit", "") || "/";

  const isActive = navPath === (href.replace("/edit", "") || "/");

  const El = href ? "a" : "span";

  return (
    <El
      href={href || "/"}
      style={{
        textDecoration: "none",
        color: isActive
          ? "var(--puck-color-grey-02)"
          : "var(--puck-color-grey-06)",
        fontWeight: isActive ? "600" : "400",
      }}
    >
      {label}
    </El>
  );
};

export const Header = ({ editMode }: { editMode: boolean }) => {
  const [navItems, setNavItems] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchNavItems = async () => {
      const items = await getNavItems();
      setNavItems(items);
    };

    fetchNavItems();
  }, []);
  return (
  <header className={getClassName()}>
    <div className={getClassName("logo")}>LOGO</div>
    <nav className={getClassName("items")}>
      {navItems.map(item => (
        <NavItem key={item.$id} label={item.title} href={editMode ? "" : item.path} />
      ))}
    </nav>
  </header>
  );
}
