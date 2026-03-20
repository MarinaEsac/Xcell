"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserNav() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleToggle = () => setOpen(!open);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        className="h-10 w-10 overflow-hidden border border-gray-300 transition rounded-xl"
      >
        <Image
          src={
            session?.user?.image && session.user.image.trim() !== ""
              ? session.user.image
              : "/user.png"
          }
          alt="User Avatar"
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-gray-700 border border-gray-200 rounded-md shadow-lg z-50">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-200">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-200 truncate">
              {session?.user?.email}
            </p>
          </div>
          <div className="border-t border-gray-200" />
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-200"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
