
export function SiteFooter() {
    return (
      <footer className="md:px-2 sm:px-8 md:py-2 w-full bg-inherit">
        <div className="px-2 sm:px-8 mx-auto w-full flex flex-col items-center justify-between gap-4 md:flex-row">
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
            . If you have any inquiries, please contact {" "}
            <a
              href='https://m.me/imbayuki'
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              me
            </a>
            .
          </p>
        </div>
      </footer>
    )
  }