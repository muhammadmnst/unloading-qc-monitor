import Link from "next/link"

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Register Vehicle</h1>
        <p className="text-muted-foreground">QC Staff input for incoming material deliveries.</p>
      </div>

      <div className="mb-8 flex space-x-2 border-b">
        <Link 
          href="/register/cpo" 
          className="px-4 py-2 text-sm font-medium border-b-2 hover:border-primary border-transparent transition-colors focus:outline-none"
        >
          CPO
        </Link>
        <Link 
          href="/register/pk" 
          className="px-4 py-2 text-sm font-medium border-b-2 hover:border-primary border-transparent transition-colors focus:outline-none"
        >
          PK
        </Link>
        <Link 
          href="/register/cangkang" 
          className="px-4 py-2 text-sm font-medium border-b-2 hover:border-primary border-transparent transition-colors focus:outline-none"
        >
          Cangkang
        </Link>
      </div>

      {children}
    </div>
  )
}
