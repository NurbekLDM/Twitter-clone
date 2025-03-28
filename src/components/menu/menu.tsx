"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { JSX, useRef, useState } from "react";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { IoHomeOutline, IoSettingsOutline, IoBookmarksOutline } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiSquarePlus } from "react-icons/ci";
import { PiArticle } from "react-icons/pi";

const menuItems = [
  { title: "Home", icon: <IoHomeOutline />, href: "/home" },
  { title: "Profile", icon: <FaRegCircleUser />, href: "/profile" },
  { title: "Settings", icon: <IoSettingsOutline />, href: "/settings" },
  { title: "Create Post", icon: <CiSquarePlus />, href: "/create" },
  { title: "Posts", icon: <PiArticle />, href: "/posts" },
  { title: "Bookmarks", icon: <IoBookmarksOutline />, href: "/bookmarks" },
];

const MenuSection = ({ desktopClassName, mobileClassName }: { desktopClassName: string; mobileClassName: string }) => (
  <>
    <FloatingDockDesktop items={menuItems} className={desktopClassName} />
    <FloatingDockMobile items={menuItems} className={mobileClassName} />
  </>
);

const FloatingDockMobile = ({ items, className }: { items: { title: string; icon: JSX.Element; href: string }[]; className: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative left-2 block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div layoutId="nav" className="absolute bg-gray-900 rounded-md w-fit bottom-full mb-2 flex flex-col gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Link href={item.href} className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
                  <div className="h-3 w-3">{item.icon}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center">
        <AiOutlineMenuUnfold className="h-7 w-7 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className }: { items: { title: string; icon: JSX.Element; href: string }[]; className: string }) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto hidden md:flex justify-center h-16 gap-4 items-end rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3", className)}
    >
      {items.map((item) => (
        <IconContainer key={item.title} mouseX={mouseX} {...item} />
      ))}
    </motion.div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconContainer = ({ mouseX, title, icon, href }: { mouseX: any; title: string; icon: JSX.Element; href: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const iconSizeTransform = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const size = useSpring(sizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconSize = useSpring(iconSizeTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (

    <Link href={href} passHref>
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div style={{ width: iconSize, height: iconSize }} className="flex items-center sm:text-5xl justify-center">
          {icon}
        </motion.div>
      </motion.div>
    </Link>

  );
};

export default MenuSection;
