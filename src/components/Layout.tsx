import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="coins-list">
            <Outlet />
        </div>
      </main>
    </>
  )
}

export default Layout