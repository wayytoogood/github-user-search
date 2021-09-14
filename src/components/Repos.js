import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/context'
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts'

const Repos = () => {
  const { repos } = useGlobalContext()

  const languages = repos.reduce((acc, curr) => {
    const { language, stargazers_count } = curr
    if (!language) return acc
    if (!acc[language]) {
      acc[language] = { label: language, value: 1, stars: stargazers_count }
    } else {
      acc[language] = {
        ...acc[language],
        value: acc[language].value + 1,
        stars: acc[language].stars + stargazers_count,
      }
    }
    return acc
  }, {})

  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value
    })
    .slice(0, 5)

  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars
    })
    .map((item) => {
      return { ...item, value: item.stars }
    })
    .slice(0, 5)

  const starAndForks = repos.reduce((acc, curr) => {
    const { name, stargazers_count, forks } = curr
    acc[name] = { stars: stargazers_count, forks }
    return acc
  }, {})

  const sortByStarAndFork = (identifier) => {
    return Object.entries(starAndForks)
      .map((item) => {
        const [key, info] = item
        return { label: key, value: info[identifier] }
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D data={mostUsed} />
        <Column3D data={sortByStarAndFork('stars')} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={sortByStarAndFork('forks')} />
      </Wrapper>
    </section>
  )
}

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`

export default Repos
