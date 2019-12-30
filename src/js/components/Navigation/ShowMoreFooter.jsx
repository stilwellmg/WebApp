import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme, withStyles } from '@material-ui/core/esm/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { renderLog } from '../../utils/logging';


class ShowMoreFooter extends React.Component {
  static propTypes = {
    classes: PropTypes.object,
    showMoreId: PropTypes.string.isRequired,
    showMoreLink: PropTypes.func.isRequired,
    showMoreText: PropTypes.string,
  };

  render () {
    renderLog('ShowMoreFooter');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, showMoreId, showMoreLink } = this.props;

    let { showMoreText } = this.props;
    if (!showMoreText) {
      showMoreText = 'Show more';
    }

    return (
      <ShowMoreFooterStyled className="card-child" id={showMoreId} onClick={showMoreLink}>
        <ShowMoreFooterText>
          { showMoreText }
          {' '}
          <ArrowForwardIcon classes={{ root: classes.cardFooterIconRoot }} />
        </ShowMoreFooterText>
      </ShowMoreFooterStyled>
    );
  }
}

const styles = theme => ({
  cardFooterIconRoot: {
    fontSize: 16,
    margin: '0 0 .1rem .3rem',
    [theme.breakpoints.down('lg')]: {
      marginBottom: '.2rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 18,
    },
  },
});

const ShowMoreFooterStyled = styled.div`
  margin-top: 8px !important;
  color: #4371cc;
  font-size: 16px;
  display: block !important;
  text-align: right !important;
  user-select: none;
  cursor: pointer;
  background: #fff !important;
  color: #2e3c5d;
  font-weight: bold;
  padding: 0px !important;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
  }
  &:hover {
    background-color: rgba(46, 60, 93, 0.15) !important;
    transition-duration: .2s;
  }
  @media print{
    display: none;
  }
`;

const ShowMoreFooterText = styled.div`
  padding: 8px !important;
  text-align: right !important;
  &:hover {
    text-decoration: underline;
  }
`;

export default withTheme(withStyles(styles)(ShowMoreFooter));



