import React, { useEffect } from "react";
import styled from "styled-components";

function LandingPage(props) {
  // useEffect fonctionne de la même manière que ComponentDidMount () d'un composant de type classe.
  useEffect(() => {
   
  }, []);

  return <Title>Welcome To DROBOX!</Title>;
}

const Title = styled.h1`
  text-align: center
;

`;

export default LandingPage;
