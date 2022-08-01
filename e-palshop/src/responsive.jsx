import { css } from "styled-components";

export const mobile = (props) => {
  return css`
    @media only screen and (max-width: 380px) {
      ${props}
    }
  `;
};


export const oppoA92020 = (props) => {
  return css`
    @media only screen and (max-width: 286px) {
      ${props}
    }
  `;
};