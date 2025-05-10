
"use client"

import type { Dispatch, SetStateAction} from "react";
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof window !== 'undefined' ? localStorage.getItem(storageKey) as Theme : null) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, systemTheme)
      }
      // Update the theme state to reflect the actual system theme applied
      // This ensures consistency if setTheme is called with 'system' externally
      if (theme !== systemTheme) {
         // setTheme(systemTheme); // This line can cause an infinite loop if not handled carefully.
                               // It's safer to let the effect for 'theme' handle storage.
      }
      return
    }
    
    root.classList.add(theme)
    if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme)
    }
  }, [theme, storageKey])
  
  // Separate effect to update localStorage when theme changes specifically.
  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, theme)
    }
  }, [theme, storageKey]);


  const value = {
    theme,
    setTheme: (newThemeOrUpdater) => {
      setTheme(prevTheme => {
        const newTheme = typeof newThemeOrUpdater === 'function' 
          ? newThemeOrUpdater(prevTheme) 
          : newThemeOrUpdater;
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, newTheme)
        }
        return newTheme;
      });
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
