import { Link } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

const List = styled.li`
  list-style: none;
  text-align: center;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F7F7F7;
  margin-top: 3px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #47C1BF;
    color: white;
  }
  a {
    text-decoration: none;
    color: inherit;
    width: 100%;
  }
`

const StyledUl = styled.ul`
  padding: 0px;
`

class Sidebar extends React.PureComponent {
  render() {
    return (
      <StyledUl>
        <List><Link to='/admin'>Dashboard</Link></List>
        <List><Link to='/admin/sites'>Sites</Link></List>
        <List><Link to='/admin/users'>Users</Link></List>
      </StyledUl>
    )
  }
}

export default Sidebar