import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { showToastSuccess } from '../../utils/showToast';
import SettingsAccount from '../Settings/SettingsAccount';
import SupportActions from '../../actions/SupportActions';
import VoterActions from '../../actions/VoterActions';
import VoterConstants from '../../constants/VoterConstants';
import VoterStore from '../../stores/VoterStore';

class PositionPublicToggle extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    inTestMode: PropTypes.bool,
    supportProps: PropTypes.object,
    type: PropTypes.string.isRequired,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      showPositionPublicHelpModal: false,
      showToThePublicOn: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const isPublicOpinion = this.props.supportProps && this.props.supportProps.is_public_position;
    this.setState({
      showToThePublicOn: isPublicOpinion || false,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  handlePositionToggle = (evt) => {
    const { value } = evt.target;
    if (value === 'Public') {
      this.showItemToPublic();
    } else {
      this.showItemToFriendsOnly();
    }
  }

  showItemToFriendsOnly () {
    this.setState({
      showToThePublicOn: false,
    });

    // console.log("PositionPublicToggle-showItemToFriendsOnly, this.props.type:", this.props.type);
    SupportActions.voterPositionVisibilitySave(this.props.ballotItemWeVoteId, this.props.type, 'FRIENDS_ONLY');
    showToastSuccess('Position now visible to friends only!');
  }

  showItemToPublic () {
    const { voter } = this.state;

    // console.log("PositionPublicToggle-showItemToPublic, this.props.type:", this.props.type);
    if (voter && voter.is_signed_in) {
      this.setState({
        showToThePublicOn: true,
      });
      SupportActions.voterPositionVisibilitySave(this.props.ballotItemWeVoteId, this.props.type, 'SHOW_PUBLIC');
      const positionPublicToggleModalHasBeenShown = VoterStore.getInterfaceFlagState(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      if (!positionPublicToggleModalHasBeenShown) {
        this.togglePositionPublicHelpModal();
        VoterActions.voterUpdateInterfaceStatusFlags(VoterConstants.POSITION_PUBLIC_MODAL_SHOWN);
      } else {
        showToastSuccess('This position now visible to anyone on We Vote!');
      }
    } else {
      this.togglePositionPublicHelpModal();
    }
  }

  togglePositionPublicHelpModal () {
    const { showPositionPublicHelpModal } = this.state;
    this.setState({
      showPositionPublicHelpModal: !showPositionPublicHelpModal,
    });
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    const { voter, showToThePublicOn } = this.state;
    if (!this.state.voter) {
      return <div className="undefined-props" />;
    }

    if (this.props.supportProps === undefined) {
      return <div className="undefined-props" />;
    }

    let inTestMode = false;
    if (this.props !== undefined && this.props.inTestMode !== undefined && this.props.inTestMode) {
      inTestMode = true;
    }

    let { is_public_position: isPublicPosition } = this.props.supportProps;

    let onChange;
    const _this = this;
    if (isPublicPosition) {
      onChange = () => {
        isPublicPosition = false;

        // TODO Somehow cause the tooltip to update if inTestMode
        if (!inTestMode) {
          _this.showItemToFriendsOnly();
        }
      };
    } else {
      onChange = () => {
        isPublicPosition = true;

        // TODO Somehow cause the tooltip to update if inTestMode
        if (!inTestMode) {
          _this.showItemToPublic();
        }
      };
    }

    // this onKeyDown function is for accessibility: the parent div of the toggle
    // has a tab index so that users can use tab key to select the toggle, and then
    // press either space or enter (key codes 32 and 13, respectively) to toggle
    const onKeyDown = (e) => {
      const enterAndSpaceKeyCodes = [13, 32];
      if (enterAndSpaceKeyCodes.includes(e.keyCode)) {
        onChange();
      }
    };

    // This modal is shown when the user clicks on public position toggle either when not signed in
    // or for the first time after being signed in.
    const PositionPublicToggleHelpModal = (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.state.showPositionPublicHelpModal}
        onClose={() => { this.togglePositionPublicHelpModal(); }}
      >
        <DialogTitle>
          <div className="text-center">Make Your Positions Public</div>
        </DialogTitle>
        <DialogContent>
          <section className="card">
            <div className="text-center">
              {voter && voter.is_signed_in ? (
                <div>
                  <div className="u-f2">You have just made your position visible to anyone on We Vote.</div>
                  <div className="u-f4">If you do NOT want to share your position publicly, click the toggle again to restrict visibility to We Vote friends only.</div>
                </div>
              ) : (
                <div>
                  { !this.state.voter.is_signed_in ?
                    <SettingsAccount /> :
                    null }
                </div>
              )}
              <br />
              We Vote makes it easy to share your views either publicly, or privately with your We Vote friends.
              <br />
              <br />
            </div>
          </section>
        </DialogContent>
      </Dialog>
    );

    return (
      <Wrapper className={this.props.className}>
        { this.state.showPositionPublicHelpModal ? PositionPublicToggleHelpModal : null }
        <PublicToggle onKeyDown={onKeyDown}>
          <FormControl classes={{ root: classes.formControl }}>
            <RadioGroup
              onChange={this.handlePositionToggle}
            >
              <RadioItem>
                <FormControlLabel
                  classes={{ label: classes.radioLabel }}
                  id="positionPublicToggleFriendsOnly"
                  value="Friends Only"
                  label="Friends Only"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={showToThePublicOn === false}
                      />
                    )
                  }
                />
              </RadioItem>
              <RadioItem>
                <FormControlLabel
                  id="positionPublicTogglePublic"
                  classes={{ label: classes.radioLabel }}
                  value="Public"
                  label="Public"
                  labelPlacement="end"
                  control={
                    (
                      <Radio
                        classes={{ colorPrimary: classes.radioPrimary }}
                        color="primary"
                        checked={showToThePublicOn === true}
                      />
                    )
                  }
                />
              </RadioItem>
            </RadioGroup>
          </FormControl>
        </PublicToggle>
      </Wrapper>
    );
  }
}

const styles = theme => ({
  radioPrimary: {
    padding: '.1rem',
    margin: '.1rem .1rem .6rem .6rem',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  },
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
  },
  radioLabel: {
    fontSize: '14px',
    bottom: '4px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      fontSize: '11px',
    },
  },
  formControl: {
    width: '100%',
  },
});

const Wrapper = styled.div`
  flex: 1 1 0;
`;

const PublicToggle = styled.div`
  padding-left: 15px;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 4px;
    margin-bottom: 4px;
  }
`;

const RadioItem = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100% !important;
    min-width: 100% !important;
  }
`;

// const RadioLabel = styled.div`
//   height: 44px;
//   padding: 10px 4px;
//   @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
//     font-size: 10px;
//     position: relative;
//     top: 4px;
//   }
// `;

const RadioGroup = styled.div`
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: -10px;
  }
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: flex;
    flex-flow: row nowrap;;
  }
`;


export default withStyles(styles)(PositionPublicToggle);
