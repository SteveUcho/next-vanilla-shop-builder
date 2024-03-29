import 'bootstrap/dist/css/bootstrap.css'
import NavBar from "../components/NavBar";
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session,...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <NavBar />
            <Component {...pageProps}>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                    crossOrigin="anonymous"
                />
            </Component>
        </SessionProvider>
    )
}
