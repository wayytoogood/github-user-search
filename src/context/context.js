import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const AppContext = React.createContext()

// - [Get User](https://api.github.com/users/john-smilga)
// - [Repos](https://api.github.com/users/john-smilga/repos?per_page=100)
// - [Followers](https://api.github.com/users/john-smilga/followers)

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [name, setName] = useState('brad-traversy')
  const [githubUser, setGithubUser] = useState(mockUser)
  const [followers, setFollowers] = useState(mockFollowers)
  const [repos, setRepos] = useState(mockRepos)
  const [requests, setRequests] = useState()

  const handleInput = (e) => {
    setName(e.target.value)
  }

  useEffect(() => {
    axios(`${rootUrl}/rate_limit`)
      .then((response) => {
        const {
          rate: { remaining },
        } = response.data
        setRequests(remaining)
        if (remaining === 0) {
          setError('Sorry, you have exceeded your hourly rate limit!')
        }
      })
      .catch((err) => console.log(err))
  }, [])

  const startSearch = async () => {
    const urlWithUser = `${rootUrl}/users/${name}`
    if (!name) return
    setLoading(true)
    // Burda try catch bloğu yanlış yazımdan kaynaklı, 404 error'ü de yakalıyor.
    try {
      const userResponse = await axios(urlWithUser)

      const results = await Promise.allSettled([
        axios(`${urlWithUser}/followers?per_page=100`),
        axios(`${urlWithUser}/repos?per_page=100`),
        axios(`${rootUrl}/rate_limit`),
      ])
      setError(false)
      setGithubUser(userResponse.data)

      const [followers, repos, requests] = results
      if (followers.status === 'fulfilled') {
        setFollowers(followers.value.data)
      }
      if (repos.status === 'fulfilled') {
        setRepos(repos.value.data)
      }
      if (requests.status === 'fulfilled') {
        setRequests(requests.value.data.rate.remaining)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setError('There Is No User With That Username')
      setLoading(false)
    }
  }

  return (
    <AppContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        loading,
        error,
        requests,
        handleInput,
        startSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

const useGlobalContext = () => {
  return React.useContext(AppContext)
}

export { AppProvider, useGlobalContext }
