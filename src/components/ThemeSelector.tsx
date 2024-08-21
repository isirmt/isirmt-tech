'use client'
import { getTheme, preloadTheme, selectDarkTheme, selectLightTheme, selectOSPreferenceTheme } from "@/lib/themeManager";
import { useEffect, useState } from "react";

type ThemeName = "light" | "dark" | "os";

const themeFunctions: {
  theme: ThemeName, func: () => void, icon: string, title: string
}[] = [
    { theme: "light", func: selectLightTheme, icon: "i-tabler-sun", title: "ライトテーマ" },
    { theme: "dark", func: selectDarkTheme, icon: "i-tabler-moon", title: "ダークテーマ" },
    { theme: "os", func: selectOSPreferenceTheme, icon: "i-tabler-sun-moon", title: "システム設定" },
  ]

export default function ThemeSelector() {
  const [nowTheme, setNowTheme] = useState<ThemeName | null>();

  useEffect(() => {
    setNowTheme(getTheme());
    preloadTheme();
  }, [])

  const theme = themeFunctions.find((t) => t.theme === nowTheme);

  const handleThemeToggle = () => {
    const nextThemeIndex = (themeFunctions.findIndex(t => t.theme === nowTheme) + 1) % themeFunctions.length;
    const nextTheme = themeFunctions[nextThemeIndex];
    nextTheme.func();
    setNowTheme(nextTheme.theme);
    preloadTheme();
  }

  return (
    <div className="group relative z-auto">
      <button
        onClick={handleThemeToggle}
        className="transition-colors size-6 bg-gray-100 flex justify-center items-center rounded-3xl dark:bg-slate-800"
      >
        {theme ? <span className={`${theme.icon} size-4`} title="テーマスイッチャー" /> : null}
      </button>
      <div className="transition-colors drop-shadow-lg gap-1 absolute z-30 hidden flex-col top-5 group-hover:flex bg-gray-200 px-1.5 py-2 rounded-3xl dark:bg-slate-700 -left-2">
        {themeFunctions.map((item, i) => (
          <button
            className="relative z-auto transition-colors hover:bg-gray-300 dark:hover:bg-slate-600 rounded-3xl size-7 items-center flex justify-center"
            key={i}
            title={`${item.theme}に変更`}
            onClick={() => {
              item.func();
              setNowTheme(item.theme);
              preloadTheme();
            }}
          >
            <span className={`${item.icon} size-6`} />
          </button>
        ))}
      </div>
    </div>
  );
}
