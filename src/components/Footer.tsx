import { profile } from '../data/profile'

export function Footer() {
  // Year is computed at render rather than build, so it stays correct on a
  // long-lived static deploy without a yearly recut.
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 text-sm text-fg-muted md:flex-row md:items-center">
        <p>
          © {year} {profile.name}
        </p>
        <nav className="flex items-center gap-5">
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-accent"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
