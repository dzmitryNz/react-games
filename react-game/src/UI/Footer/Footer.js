import React, { PureComponent } from 'react';
import styled from 'styled-components';

class Footer extends PureComponent {
  render() {
    const { children } = this.props
    return <Container>{children}</Container>
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0;
  width: 425px;
  align-items: center;
  color: snow;
  text-decoration: none;
  transition: all 0.5s;
  img{
    height: 70px;
    weight: 70px;
    transition: all 0.5s;

  }
  img:hover {
    transform: rotate(45deg);
  }

  a{
    color: snow;
    text-decoration: none;
    vertical-align: middle;
    margin: 0 10px;
    transition: all 0.3s;
  }
  a:hover {
  color: green;
  }

`
export default Footer
