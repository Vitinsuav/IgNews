import styles from './styles.module.scss'
import { SignInButton } from '../signInButton'
import { ActiveLink } from '../activeLink'

export function Header(){

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src='/images/logo.svg' alt='ignews'/>
                <nav>
                <ActiveLink activeClassName={styles.active} href='/'>
                    <a>Home</a>
                </ActiveLink>
                <ActiveLink activeClassName={styles.active} href='/posts'>
                    <a>Posts</a>
                </ActiveLink>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}
//prefetch carrega rapido em Link