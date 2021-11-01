import styled from "styled-components";

export const Header = styled.header`
  // background-color: #282c34;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
  display: flex;
  justify-content: center;
  width: 100%;
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const Body = styled.div`
  align-items: center;
  // background-color: #282c34;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  justify-content: center;
  min-height: calc(100vh - 70px);
`;

export const Image = styled.img`
  height: 25vmin;
  margin-bottom: 16px;
  pointer-events: none;
`;

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #61dafb;
  margin-top: 10px;
`;

export const Button = styled.button`  
  border: none;
  border-radius: 8px;
  color: #282c34;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  margin: 0px 20px;
  padding: 12px 24px;

  background-color: rgba(0, 0, 0, 0.05);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  color: white;
  letter-spacing: 1px;
  position: relative;

  border-bottom: 1px solid rgba(50, 216, 0, 0.4);
  ${props => props.hidden && "hidden"} :focus {
    border: none;
    outline: none;
  }
`;
