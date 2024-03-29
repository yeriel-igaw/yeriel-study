import './globals.scss'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import GNB from "@/app/layout/GNB";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: '예리엘 실습공간 - Chart',
    description: 'Generated by create next app',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <GNB/>
                {children}
            </body>
        </html>
    )
}
