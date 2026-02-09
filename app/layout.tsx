import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Package, Calendar, BookOpen, Library, Tag } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Delivery Plan App",
  description: "Manage delivery plans for Expert Services engagements",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <nav className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold">
                  Delivery Plans
                </Link>
                <div className="flex gap-6">
                  <Link
                    href="/customers"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Package className="h-4 w-4" />
                    Customers
                  </Link>
                  <Link
                    href="/engagements"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Calendar className="h-4 w-4" />
                    Engagements
                  </Link>
                  <Link
                    href="/delivery-plans"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <BookOpen className="h-4 w-4" />
                    Delivery Plans
                  </Link>
                  <Link
                    href="/library"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Library className="h-4 w-4" />
                    Library
                  </Link>
                  <Link
                    href="/topics"
                    className="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Tag className="h-4 w-4" />
                    Topics
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  )
}

