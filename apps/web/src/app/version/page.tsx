"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useVersion } from "@/contexts/VersionContext";
import type { ChangelogEntry } from "@/types/changelog";

export default function VersionPage() {
  const { changelog, fullVersionString } = useVersion();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          Versiones y registro de cambios
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Versión actual: <span className="font-mono">{fullVersionString}</span>
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Volver al inicio
        </Link>
      </header>

      <section className="space-y-6">
        {changelog.map((entry: ChangelogEntry, index: number) => {
          const tagUrl = `https://github.com/edcalderon/bietnetwork.org/releases/tag/v${entry.version}`;

          return (
            <article
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white/80 dark:bg-gray-900/70"
            >
              <header className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Link
                    href={tagUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    <span>v{entry.version}</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </Link>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                    {entry.type}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </header>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {entry.description}
              </p>

              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300 mt-1">
              {entry.features.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                    Novedades
                  </h3>
                  <ul className="space-y-1">
                    {entry.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 text-green-500">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {entry.improvements.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                    Mejoras
                  </h3>
                  <ul className="space-y-1">
                    {entry.improvements.map((improvement: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 text-blue-500">•</span>
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

                {entry.fixes.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">
                      Correcciones
                    </h3>
                    <ul className="space-y-1">
                      {entry.fixes.map((fix: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 text-red-500">•</span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
