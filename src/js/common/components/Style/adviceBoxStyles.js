import styled from 'styled-components';

const AdviceBox = styled('div')(({ theme }) => (`
  // margin: 25px;
  // ${theme.breakpoints.down('sm')} {
  //   margin: 20px;
  // }
`));

const AdviceBoxText = styled('div')`
  color: #999;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const AdviceBoxTitle = styled('div')`
  color: #999;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const AdviceBoxWrapper = styled('div')`
  // background-color: #f8f8f8;
  // border: 1px solid #ddd;
  // border-radius: 5px;
  margin-top: 40px;
`;

export {
  AdviceBox,
  AdviceBoxText,
  AdviceBoxTitle,
  AdviceBoxWrapper,
};