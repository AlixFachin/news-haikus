"use client";

import { useState } from "react";
import Link from "next/link";

export default function AppMenu() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="fixed right-2 top-2 flex flex-col justify-start self-end rounded-lg bg-orange-500 transition-all">
      <button
        className="p-4"
        onClick={() => setOpened((oldOpened) => !oldOpened)}
      >
        Menu
      </button>
      {opened && (
        <div className="mb-2 rounded-lg bg-orange-500 p-4">
          <ul>
            <li className="mb-2">
              <Link href="/generate">Generate Haikus</Link>
            </li>
            <li className="mb-2">
              <Link href="/myHaikus">My Haikus</Link>
            </li>
            <li className="mb-2">
              <Link href="/archive">Archive</Link>
            </li>
            <li className="mb-2">
              <Link href="/">Home</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
