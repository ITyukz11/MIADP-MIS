
export function SiteFooter() {
  return (
    <footer className="py-6 md:px-8 md:py-0 mt-auto w-full ">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <a
            href='https://www.linkedin.com/in/itabella/'
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            MIADP - Programmer
          </a>
          . If you have any inquiries, please contact the{" "}
          <a
            href='https://m.me/joseph.rico.56/'
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Project Leader
          </a>
          .
        </p>
      </div>
    </footer>
  )
}