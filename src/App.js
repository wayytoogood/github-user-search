import React from 'react'
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from './pages'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// AutWrapper'a almamızın nedeni şu, normalde isLoading, user gibi değerlere bütün App'i Auth0Provider içine aldığımız gibi ulaşabiliyoruz fakat bu ulaşma zaman içerisinde değişiyor, yani loading ilk başta true'yken sonradan false oluyor. İşte login sayfasından signup kısmına geçtiğimizde, başarılı bi şekilde doğrulama yapıldıktan sonra callback url'de belirttiğimiz ana sayfaya geçiş yapıyor fakat bizim durumumuzda ana sayfa'nın router'ı PrivateRoute ve burda da eğer user bilgilerine ulaşamıyorsak login'e dön deniyor, direk geçiş yapıldığında hala loading devam ettiği için user bilgileri undefined oluyor ve yine login sayfasına dönülüyor. Bu durumun önüne geçmek için bi wrapper oluşturuluyor ve loading durumunda sadece loading component'ının dönmesi, bilgiler dönünce de normal route'larımızın dönmesi sağlanıyor.

function App() {
  return (
    <div>
      <AuthWrapper>
        <Router>
          <Switch>
            <PrivateRoute exact path='/'>
              <Dashboard></Dashboard>
            </PrivateRoute>
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='*'>
              <Error />
            </Route>
          </Switch>
        </Router>
      </AuthWrapper>
    </div>
  )
}

export default App
